#!/usr/bin/env python3
import hmac, hashlib, json, os, subprocess, sys
from http.server import HTTPServer, BaseHTTPRequestHandler

WEBHOOK_SECRET = os.environ.get('GITHUB_WEBHOOK_SECRET', 'change-me')
DEPLOY_SCRIPT = '/home/das/portfolio-v2/deploy.sh'
REPO_DIR = '/home/das/portfolio-v2'

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != '/webhook':
            self.send_error(404)
            return
        
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length)
        
        # Verify signature
        sig = self.headers.get('X-Hub-Signature-256', '')
        expected = 'sha256=' + hmac.new(WEBHOOK_SECRET.encode(), body, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected):
            self.send_error(401)
            return
        
        # Check event type
        event = self.headers.get('X-GitHub-Event', '')
        if event != 'push':
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'Ignored non-push event')
            return
        
        # Run deploy
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'Deploy triggered')
        
        subprocess.Popen(['bash', DEPLOY_SCRIPT], cwd=REPO_DIR,
                         stdout=open('/tmp/deploy.log', 'a'),
                         stderr=subprocess.STDOUT)
    
    def log_message(self, format, *args):
        pass

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 9000
    print(f"Webhook server on port {port}")
    HTTPServer(('', port), Handler).serve_forever()
