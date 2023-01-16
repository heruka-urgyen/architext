/**
 * @jest-environment jsdom
 */

import React from "react"
import "regenerator-runtime/runtime"
import {render} from "@testing-library/react"
import "@testing-library/jest-dom"

import {DefinitionBlock} from "../DefinitionBlock"

describe("DefinitionBlock", () => {
  test("matches snapshot", () => {
    const definitions = [
      [
        [
          {type: "definition", token: "def"},
          {type: "none", token: "1"},
        ],
      ],
      [
        [
          {type: "definition", token: "def"},
          {type: "none", token: "2"},
        ],
      ],
    ]

    const titleNode = React.createElement("h1", null, "term")

    const screen = render(
      <DefinitionBlock definitions={definitions} titleNode={titleNode} />,
    )

    expect(screen).toMatchSnapshot()
  })
})
