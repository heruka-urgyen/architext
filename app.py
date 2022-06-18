from flask import Flask, request
from flask_cors import CORS, cross_origin
from botok import Text

import csv
import pyewts

architext = Flask(__name__, static_url_path="")
cors = CORS(architext, resources={r"/api/*": {"origins": "http://localhost:1234"}})
converter = pyewts.pyewts()

with open("./dictionary/ranjung-yeshe.csv", newline="") as csvfile:
    reader = csv.reader(csvfile, delimiter="|")
    dictionary = list(reader)

@architext.route("/", methods=["GET"])
def main():
    return architext.send_static_file("index.html")

@architext.route("/api/glossary", methods=["POST"])
def glossary():
    text = request.get_json()["text"]
    t = Text(text)


    words = t.tokenize_words_raw_lines.split(" ")
    wylie = converter.toWylie(text)
    wylie_word_list = list(filter(lambda x: x != "/", map(lambda w: w.strip(), [converter.toWylie(word) for word in words])))
    glossary = list(map(search, set(wylie_word_list)))

    return {
                "words": words,
                "wylie": wylie,
                "wylie_word_list": wylie_word_list,
                "glossary": glossary,
            }

@architext.route("/api/term/<term>", methods=["GET"])
def handleSearch(term):
    return {
                "term": term,
                "definitions": list(map(lambda r: r[1], search(term)))
           }


def search(term):
    return list(filter(lambda td: td[0] == term, dictionary))

