import React from "react"
import ReactDOM from "react-dom"

import {App} from "./app"

ReactDOM.render(
  React.createElement(App, null, null),
  document.querySelector(".js-app"),
)
