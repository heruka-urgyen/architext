/**
 * @jest-environment jsdom
 */

import "regenerator-runtime/runtime"
import {fireEvent, render} from "@testing-library/react"
import "@testing-library/jest-dom"

import {Title} from "../Title.jsx"

describe("Title", () => {
  test("it renders searchable title", () => {
    const term = "snying thig"
    const onClick = jest.fn(_ => _)

    const {queryByText} = render(
      <Title term={term} onClick={onClick} />,
    )

    const snying = queryByText("snying")
    const thig = queryByText("thig")

    expect(snying).toBeInTheDocument()
    expect(thig).toBeInTheDocument()

    fireEvent.mouseDown(snying)
    fireEvent.mouseDown(thig)

    expect(onClick.mock.calls.length).toBe(2)
  })

  test("it renders non-searchable title", () => {
    const term = "snying thig"
    const onClick = jest.fn()

    const {queryByText} = render(
      <Title term={term} />,
    )

    const snying = queryByText("snying")
    const thig = queryByText("thig")

    expect(snying).toBeInTheDocument()
    expect(thig).toBeInTheDocument()

    fireEvent.mouseDown(snying)
    fireEvent.mouseDown(thig)

    expect(onClick.mock.calls.length).toBe(0)
  })

  test("it handles variously formatted terms", () => {
    const term1 = "snyingthig"
    const term2 = "snying  thig"
    const term3 = "snying         thig"

    const screen1 = render(
      <Title term={term1} />,
    )

    expect(screen1.queryByText("snyingthig")).toBeInTheDocument()

    screen1.rerender(
      <Title term={term2} />,
    )

    expect(screen1.queryByText("snying")).toBeInTheDocument()
    expect(screen1.queryByText("thig")).toBeInTheDocument()

    screen1.rerender(
      <Title term={term3} />,
    )

    expect(screen1.queryByText("snying")).toBeInTheDocument()
    expect(screen1.queryByText("thig")).toBeInTheDocument()
  })
})
