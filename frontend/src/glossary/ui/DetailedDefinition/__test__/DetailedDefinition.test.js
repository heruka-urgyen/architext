/**
 * @jest-environment jsdom
 */

import "regenerator-runtime/runtime"
import {render} from "@testing-library/react"
import "@testing-library/jest-dom"

import {DetailedDefinition} from "../DetailedDefinition.jsx"

describe("DetailedDefinition", () => {
  test("matches snapshot", () => {
    const term = "snying thig"
    const definitions = ["def 1", "def 2"]
    const goBack = jest.fn(_ => _)

    const screen = render(
      <DetailedDefinition
        term={term}
        definitions={definitions}
        goBack={goBack}
      />
    )

    expect(screen).toMatchSnapshot()
  })
})
