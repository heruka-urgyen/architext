/**
 * @jest-environment jsdom
 */

import "regenerator-runtime/runtime"
import {render} from "@testing-library/react"
import "@testing-library/jest-dom"

import {DefinitionList} from "../DefinitionList"

describe("DefinitionList", () => {
  test("matches snapshot", () => {
    const entries = [
      [["term 1", "def 1-1", "def 1-2"]],
      [["term 2", "def 2-1", "def 2-2"]],
    ]

    const handleTitleClick = jest.fn(_ => _)

    const screen = render(
      <DefinitionList entries={entries} handleTitleClick={handleTitleClick} />,
    )

    expect(screen).toMatchSnapshot()
  })
})
