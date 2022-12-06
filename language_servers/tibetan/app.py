from flask import Flask, request
from flask_cors import CORS, cross_origin
from botok import Text

import pyewts

architext = Flask(__name__, static_url_path="")
cors = CORS(architext, resources={r"/api/*": {"origins": "http://127.0.0.1:3000"}})
converter = pyewts.pyewts()

def parse_json(request):
    text = request.get_json()["text"]
    return Text(text)

def tokenize_words(request):
    t = parse_json(request)
    return {
               "words": t.tokenize_words_raw_lines.split(" ")
           }

def convert_to_wylie(text):
    return converter.toWylie(text)

@architext.route("/api/tokenize_words", methods=["POST"])
def tokenize_words_handler():
    return tokenize_words(request)

@architext.route("/api/convert_to_wylie", methods=["POST"])
def convert_to_wylie_hanlder():
    t = parse_json(request)
    return {
               "wylie": convert_to_wylie(t)
           }

@architext.route("/api/wylie_word_list", methods=["POST"])
def wylie_word_list_handler():
    t = parse_json(request)
    words = tokenize_words(request)["words"]
    wylie_word_list = list(filter(lambda x: x != "/", map(lambda w: w.strip(), [convert_to_wylie(word) for word in words])))
    return {
                "wylieWordList": wylie_word_list,
           }
