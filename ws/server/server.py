#!/usr/bin/env python
'''
Created on Jan 23, 2016

@author: oreste
'''

from argh import ArghParser
from flask import Flask
from flask.helpers import send_file as _send_file
from os.path import isdir, exists, abspath, join, isfile, dirname
from plecnoutils.base import debugger
from werkzeug.exceptions import abort
from logging import info, basicConfig, INFO
from sys import stderr
from commands import getstatusoutput
from urlparse import urlparse
from pystache.renderer import Renderer
from pygments import highlight
from pygments.lexers.javascript import  JavascriptLexer
from pygments.formatters.html import HtmlFormatter
from pygments.lexers.html import HtmlLexer

def send_file(filepath):
    return _send_file(filepath, conditional=True)

class ExecuteException(Exception):
    def __init__(self, s, o):
        super(ExecuteException, self).__init__(o)
        self.errno=s

def execute(cmd):
    s , o = getstatusoutput(cmd)
    if s != 0:
        raise ExecuteException(s, o)
    return o

def markdown(filepath):
    return execute("markdown '{filepath}'".format(filepath=filepath))

def serve(hostname="localhost", port=5000):
    app = _create_app(root=_template_dir())
    app.run(hostname, port)

def _create_app(root):
    app = Flask(__name__)
    #autoindex = AutoIndex(app,  browse_root=root, add_url_rules=False)

    @app.route("/<path:path>.md")
    def md_handler(path):
        full_filepath = join(root, path)+".md"
        res = markdown(full_filepath)
        return res

    @app.route("/<path:path>")
    def default_handler(path=None):
        res = None
        path = path or ""
        fullpath = join(root,  path)
        if isdir(fullpath):
            fullpath_index = join(fullpath, "index.html")
            if isfile(fullpath_index):
                res = send_file(fullpath_index)
        else:
            if exists(fullpath):
                res = send_file(fullpath)
        if res is None:
            abort(404)
        return res

    @app.route("/")
    def index():
        class Index(object):
            def read_file(text):
                def __call__(filename):
                    fullpath = join(search_dir, filename.strip())
                    with open(fullpath) as f:
                        content = f.read()
                    return content

                return __call__
            def html_formatter(self):
                def __call__(text):
                    rendered = renderer.render(text.strip(), self)
                    res = highlight(rendered, HtmlLexer(), HtmlFormatter())
                    return res
                return __call__
        search_dir = join(abspath(dirname(__name__)), "html")
        renderer = Renderer(search_dirs=[search_dir], file_extension="html")
        res = renderer.render_name("index", Index())
        return res
    return app

def _template_dir():
    root = abspath(join(dirname(__file__), "html"))
    return root

def call_url(url=""):
    #_setup_log("ERROR")
    app = _create_app(_template_dir())
    app.debug=True
    client_app = app.test_client()
    parsed = urlparse(url)
    query_string =parsed.query
    return  client_app.get(parsed.path, query_string=query_string).data

def main():
    basicConfig(level=INFO, stream=stderr)
    parser = ArghParser()
    parser.add_commands([serve, call_url])
    parser.dispatch()


if __name__ == "__main__":
    main()
