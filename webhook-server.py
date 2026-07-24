#!/usr/bin/env python3
import subprocess, os, sys
from http.server import HTTPServer, BaseHTTPRequestHandler

DEPLOY_SCRIPT = '/home/das/portfolio-v2/deploy.sh'
REPO_DIR = '/home/das/portfolio-v2'
TOKEN = 'das-web-autodeploy-2026'

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != '/deploy':
            self.send_error(404)
            return
        
        token = self.headers.get('X-Deploy-Token', '')
        if token != TOKEN:
            self.send_error(403)
            return
        
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'Deploy triggered')
        
        subprocess.Popen(['bash', DEPLOY_SCRIPT], cwd=REPO_DIR,
                         stdout=open('/tmp/deploy.log', 'a'),
                         stderr=subprocess.STDOUT)
    
    def log_message(self, format, *args):
        pass

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 9002
    print(f"Deploy webhook on port {port}")
    HTTPServer(('0.0.0.0', port), Handler).serve_forever()
