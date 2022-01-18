from flask import Flask
from flask_cors import CORS, cross_origin

architext = Flask(__name__, static_url_path="")
cors = CORS(architext, resources={r"/api/*": {"origins": "http://localhost:1234"}})

@architext.route("/", methods=["GET"])
def main():
    return architext.send_static_file("index.html")
