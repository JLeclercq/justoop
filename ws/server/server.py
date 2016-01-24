#!/usr/bin/env python
'''
Created on Jan 23, 2016

@author: oreste
'''

from argh import ArghParser
from flask import Flask
from flask.helpers import send_file
from flask_autoindex import AutoIndex
from os.path import isdir, exists, abspath, join
from plecnoutils.base import debugger
from werkzeug.exceptions import abort
from logging import info, basicConfig, INFO
from sys import stderr
from commands import getstatusoutput

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

def serve(hostname="localhost", port=5000, root="."):
    app = Flask(__name__)
    autoindex = AutoIndex(app,  browse_root=root)  

    @app.route("/<path:path>.md")
    def md_handler(path):
        full_filepath = join(autoindex.rootdir.abspath, path)+".md"
        res = markdown(full_filepath)
        return res
        
    app.run(hostname, port)

def main():
    basicConfig(level=INFO, stream=stderr)
    parser = ArghParser()
    parser.set_default_command(serve)
    parser.dispatch()


if __name__ == "__main__":
    main()