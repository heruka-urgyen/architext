/**
 * @jest-environment jsdom
 */

import {render} from "@testing-library/react"
import "@testing-library/jest-dom"

import {Maybe} from "../Maybe.jsx"

describe("Maybe", () => {
  test("it renders `then component` when condition is true", () => {
    const Child1 = () => <h1>Child 1</h1>

    const {queryByText} = render(<Maybe if={true} then={<Child1 />} />)

    expect(queryByText("Child 1")).toBeInTheDocument()
  })

  test("it renders `else component` when condition is false", () => {
    const Child1 = () => <h1>Child 1</h1>
    const Child2 = () => <h1>Child 2</h1>

    const {queryByText} = render(
      <Maybe if={false} then={<Child1 />} else={<Child2 />} />,
    )

    expect(queryByText("Child 1")).not.toBeInTheDocument()
    expect(queryByText("Child 2")).toBeInTheDocument()
  })

  test("it renders null when there is no `else component`", () => {
    const Child1 = () => <h1>Child 1</h1>

    const {queryByText} = render(<Maybe if={false} then={<Child1 />} />)

    expect(queryByText("Child 1")).not.toBeInTheDocument()
  })
})
