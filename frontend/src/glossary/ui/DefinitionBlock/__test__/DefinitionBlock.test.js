/**
 * @jest-environment jsdom
 */

import React from "react"
import "regenerator-runtime/runtime"
import {render} from "@testing-library/react"
import "@testing-library/jest-dom"

import {DefinitionBlock} from "../DefinitionBlock.jsx"

describe("DefinitionBlock", () => {
  test("matches snapshot", () => {
    const definitions = [
      "def 1",
      "def 2",
      "def 3",
      "def 4",
    ]

    const titleNode = React.createElement("h1", null, "term")

    const screen = render(
      <DefinitionBlock
        definitions={definitions}
        titleNode={titleNode}
      />
    )

    expect(screen).toMatchSnapshot()
  })
})
