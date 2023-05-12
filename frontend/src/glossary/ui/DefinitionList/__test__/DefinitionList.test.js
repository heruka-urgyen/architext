/**
 * @jest-environment jsdom
 */

import "regenerator-runtime/runtime"
import {render} from "@testing-library/react"
import "@testing-library/jest-dom"

import {DefinitionList} from "../DefinitionList"

describe("DefinitionList", () => {
  test("matches snapshot", () => {
    const definitions = [
      [
        [
          {type: "definition", token: "def"},
          {type: "none", token: "1"},
        ],
      ],
    ]
    const entry = {dictionary: "a", definitions: [["term 1", definitions]]}
    const handleTitleClick = jest.fn(_ => _)

    const screen = render(
      <DefinitionList entry={entry} handleTitleClick={handleTitleClick} />,
    )

    expect(screen).toMatchSnapshot()
  })
})
