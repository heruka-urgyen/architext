from flask import Flask, request
from flask_cors import CORS, cross_origin
from botok import Text

import csv
import pyewts

architext = Flask(__name__, static_url_path="")
cors = CORS(architext, resources={r"/api/*": {"origins": "http://127.0.0.1:3000"}})
converter = pyewts.pyewts()

def read_dictionary(d):
    reader = csv.reader(d, delimiter="|")
    return list(reader)

with (
    open("./dictionary/ranjung-yeshe.csv", newline="") as ry,
    open("./dictionary/hopkins-sanskrit.csv", newline="") as hs,
    open("./dictionary/dag_tshig_gsar_bsgrigs-tibetan.csv", newline="") as dt,
    open("./dictionary/dung-dkar-tshig-mdzod-chen-mo-tibetan.csv", newline="") as dd,
    open("./dictionary/mahavyutpatti-sanskrit.csv", newline="") as ms,
    open("./dictionary/tshig-mdzod-chen-mo-tibetan.csv", newline="") as tm,
    open("./dictionary/yoghacharabhumi-glossary.csv", newline="") as yg,
):
    dictionaries = [
        {
            "name": "ranjung-yeshe",
            "dictionary": read_dictionary(ry),
        },
        {
            "name": "hopkins-sanskrit",
            "dictionary": read_dictionary(hs),
        },
        {
            "name": "dag-tshig-gsar-bsgrigs-tibetan",
            "dictionary": read_dictionary(dt),
        },
        {
            "name": "dung-dkar-tshig-mdzod-chen-mo-tibetan",
            "dictionary": read_dictionary(dd),
        },
        {
            "name": "mahavyutpatti-sanskrit",
            "dictionary": read_dictionary(ms),
        },
        {
            "name": "tshig-mdzod-chen-mo-tibetan",
            "dictionary": read_dictionary(tm),
        },
        {
            "name": "yoghacharabhumi-glossary",
            "dictionary": read_dictionary(yg),
        },
    ]

@architext.route("/", methods=["GET"])
def main():
    return architext.send_static_file("index.html")

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

@architext.route("/api/glossary", methods=["POST"])
def glossary():
    text = request.get_json()["text"]
    t = Text(text)

    words = t.tokenize_words_raw_lines.split(" ")
    wylie = converter.toWylie(text)
    wylie_word_list = list(filter(lambda x: x != "/", map(lambda w: w.strip(), [converter.toWylie(word) for word in words])))
    glossary = get_defs(set(wylie_word_list))

    return {
                "words": words,
                "wylie": wylie,
                "wylie_word_list": wylie_word_list,
                "glossary": glossary,
            }


def get_defs(terms):
    res = []
    for dictionary in dictionaries:
        res.append({
                        "dictionary": dictionary["name"],
                        "definitions": list(map(lambda term: search(dictionary["dictionary"], term), terms))
                   })
    return res


@architext.route("/api/term/<term>", methods=["GET"])
def handleSearchTerm(term):
    return {
                "term": term,
                "results": get_defs([term])
           }


def search(dictionary, term):
    return list(filter(lambda td: td[0] == term, dictionary))
