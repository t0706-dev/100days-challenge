import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

APP_DIR = os.path.dirname(os.path.abspath(__file__))

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=APP_DIR, **kwargs)
    def log_message(self, fmt, *args):
        pass

HTTPServer.allow_reuse_address = True
with HTTPServer(('127.0.0.1', 3016), Handler) as httpd:
    httpd.serve_forever()
