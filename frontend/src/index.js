import React from "react"
import ReactDOM from "react-dom"

import {Editor} from "./editor"

const editorConfig = {
  tags: [
    {tag: "bo", color: "#800000"},
    {tag: "en", color: "#0000ff"},
  ],
}

ReactDOM.render(
  React.createElement(Editor, editorConfig, null),
  document.querySelector(".js-app"),
)

