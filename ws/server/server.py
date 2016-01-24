'''
Created on Jan 23, 2016

@author: oreste
'''

from argh import ArghParser
from flask import Flask
from flask.helpers import send_file
from flask_autoindex import AutoIndex
from os.path import isdir, exists, abspath
from plecnoutils.base import debugger
from werkzeug.exceptions import abort
from logging import info, basicConfig, INFO
from sys import stderr

def serve(hostname="localhost", port=5000):
    app = Flask(__name__)
    AutoIndex(app,  browse_root=".")  
        
    app.run(hostname, port)

def main():
    basicConfig(level=INFO, stream=stderr)
    parser = ArghParser()
    parser.add_commands([serve])
    parser.dispatch()


if __name__ == "__main__":
    main()