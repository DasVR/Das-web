#!/usr/bin/env python3
"""Deploy webhook.

Auth is an HMAC-SHA256 signature over the raw request body, so a captured
header cannot be replayed against a different payload. The shared secret comes
from the DEPLOY_SECRET environment variable and is never stored in this repo.

Run with:
    DEPLOY_SECRET=... ./webhook-server.py 9002
"""
import hashlib
import hmac
import json
import os
import subprocess
import sys
import time
from http.server import BaseHTTPRequestHandler, HTTPServer

DEPLOY_SCRIPT = os.environ.get("DEPLOY_SCRIPT", "/home/das/portfolio-v2/deploy.sh")
REPO_DIR = os.environ.get("REPO_DIR", "/home/das/portfolio-v2")
DEPLOY_LOG = os.environ.get("DEPLOY_LOG", "/tmp/deploy.log")
STATUS_FILE = os.environ.get("DEPLOY_STATUS_FILE", "/tmp/deploy-status.json")

SECRET = os.environ.get("DEPLOY_SECRET", "").encode()
if not SECRET:
    sys.exit("DEPLOY_SECRET is required. Refusing to start without it.")

MAX_BODY_BYTES = 8192
# Reject signatures whose timestamp is outside this window, to limit replay.
MAX_SKEW_SECONDS = 300


def expected_signature(raw_body: bytes) -> str:
    return hmac.new(SECRET, raw_body, hashlib.sha256).hexdigest()


def write_status(running: bool = False, success: bool = False, error: str = "", log_tail: str = ""):
    with open(STATUS_FILE, "w") as f:
        json.dump({
            "timestamp": int(time.time()),
            "running": running,
            "success": success,
            "error": error,
            "log_tail": log_tail,
        }, f)


class Handler(BaseHTTPRequestHandler):
    server_version = "deploy-webhook"
    sys_version = ""

    def _deny(self, code: int) -> None:
        # Same terse response for every rejection so probes learn nothing.
        self.send_response(code)
        self.send_header("Content-Length", "0")
        self.end_headers()

    def _json(self, data: dict, code: int = 200) -> None:
        body = json.dumps(data).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/deploy/status":
            try:
                with open(STATUS_FILE, "r") as f:
                    status = json.load(f)
            except (FileNotFoundError, json.JSONDecodeError):
                status = {"timestamp": 0, "running": False, "success": False, "error": "", "log_tail": ""}
            self._json(status)
            return
        self._deny(404)

    def do_POST(self):
        if self.path != "/deploy":
            self._deny(404)
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self._deny(400)
            return

        if length < 0 or length > MAX_BODY_BYTES:
            self._deny(413)
            return

        raw_body = self.rfile.read(length) if length else b""
        signature = self.headers.get("X-Deploy-Signature", "")

        if not hmac.compare_digest(signature, expected_signature(raw_body)):
            self._deny(403)
            return

        if not self._timestamp_fresh(raw_body):
            self._deny(403)
            return

        self.send_response(202)
        self.send_header("Content-Length", "0")
        self.end_headers()

        write_status(running=True, success=False)
        try:
            with open(DEPLOY_LOG, "a") as log:
                proc = subprocess.run(
                    ["bash", DEPLOY_SCRIPT],
                    cwd=REPO_DIR,
                    stdout=log,
                    stderr=subprocess.STDOUT,
                    capture_output=False,
                )
            # Read last 10 lines of log for status
            try:
                with open(DEPLOY_LOG, "r") as f:
                    lines = f.readlines()
                    log_tail = "".join(lines[-10:]).strip()
            except Exception:
                log_tail = ""
            write_status(running=False, success=proc.returncode == 0, error="" if proc.returncode == 0 else f"deploy script exited {proc.returncode}", log_tail=log_tail)
        except Exception as e:
            write_status(running=False, success=False, error=str(e), log_tail="")

    def _timestamp_fresh(self, raw_body: bytes) -> bool:
        try:
            sent_at = int(json.loads(raw_body or b"{}").get("timestamp", 0))
        except (ValueError, AttributeError):
            return False
        return abs(time.time() - sent_at) <= MAX_SKEW_SECONDS

    def log_message(self, format, *args):
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 9002
    print(f"Deploy webhook on port {port}")
    HTTPServer(("0.0.0.0", port), Handler).serve_forever()
