#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import io
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

# 修复 Windows 编码问题
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

class CustomHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加 CORS 和缓存控制头
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        return super().end_headers()

    def do_GET(self):
        # 获取请求路径
        path = self.path.split('?')[0]  # 移除查询参数
        
        # 如果路径以 / 结尾，查找 index.html
        if path.endswith('/'):
            index_path = os.path.join(os.getcwd(), path.lstrip('/'), 'index.html')
            if os.path.isfile(index_path):
                self.path = path + 'index.html'
        
        # 如果路径不以 / 结尾且没有文件扩展名，尝试作为目录
        elif '.' not in path.split('/')[-1]:
            dir_path = os.path.join(os.getcwd(), path.lstrip('/'))
            if os.path.isdir(dir_path):
                # 重定向到带 / 的路径
                self.send_response(301)
                self.send_header('Location', path + '/')
                self.end_headers()
                return
            else:
                # 尝试作为 .html 文件
                html_path = dir_path + '.html'
                if os.path.isfile(html_path):
                    self.path = path + '.html'
        
        return super().do_GET()

if __name__ == '__main__':
    # 切换到 src 目录
    src_dir = os.path.join(os.path.dirname(__file__), 'src')
    os.chdir(src_dir)
    
    PORT = 8000
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, CustomHTTPRequestHandler)
    
    print(f'🚀 Server running at http://localhost:{PORT}')
    print(f'📁 Serving from: {src_dir}')
    print('Press Ctrl+C to stop')
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n✓ Server stopped')
        sys.exit(0)
