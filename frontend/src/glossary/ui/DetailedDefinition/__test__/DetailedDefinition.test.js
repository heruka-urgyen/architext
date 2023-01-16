/**
 * @jest-environment jsdom
 */

import "regenerator-runtime/runtime"
import {render} from "@testing-library/react"
import "@testing-library/jest-dom"

import {DetailedDefinition} from "../DetailedDefinition"

describe("DetailedDefinition", () => {
  test("matches snapshot", () => {
    const term = "snying thig"
    const definitions = [
      [
        [
          [
            {type: "definition", token: "snying"},
            {type: "definition", token: "thig"},
          ],
        ],
      ],
      [
        [
          [
            {type: "definition", token: "def"},
            {type: "none", token: "2"},
          ],
        ],
      ],
    ]
    const entries = [
      {dictionary: "a", definitions: [["snying thig", definitions[0]]]},
      {dictionary: "b", definitions: [["term 2", definitions[1]]]},
    ]
    const goBack = jest.fn(_ => _)

    const screen = render(
      <DetailedDefinition term={term} entries={entries} goBack={goBack} />,
    )

    expect(screen).toMatchSnapshot()
  })
})
