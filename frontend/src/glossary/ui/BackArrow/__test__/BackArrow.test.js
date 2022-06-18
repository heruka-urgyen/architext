/**
 * @jest-environment jsdom
 */

import "regenerator-runtime/runtime"
import {render} from "@testing-library/react"
import "@testing-library/jest-dom"

import {BackArrow} from "../BackArrow.jsx"

describe("BackArrow", () => {
  test("matches snapshot", () => {
    const onMouseDown = jest.fn()

    const screen = render(
      <BackArrow
        onMouseDown={onMouseDown}
      />
    )

    expect(screen).toMatchSnapshot()
  })
})
