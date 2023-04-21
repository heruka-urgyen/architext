/**
 * @jest-environment jsdom
 */

import React from "react"
import "regenerator-runtime/runtime"
import {render} from "@testing-library/react"
import "@testing-library/jest-dom"

import {Glossary} from "../Glossary"

jest.mock("recoil", () => {
  const originalModule = jest.requireActual("recoil")

  return {
    __esModule: true,
    ...originalModule,
    useRecoilValue: selector => {
      if (selector.key.includes("withGlossary")) {
        return [
          {
            dictionary: "dictionary 1",
            definitions: [
              ["foo", ["foo definition 1", "foo definition 2"]],
            ]
          },
          {
            dictionary: "dictionary 2",
            definitions: [
              ["bar", ["bar definition 1", "bar definition 2"]],
            ]
          },
        ]
      }

      if (selector.key.includes("withSearchTerm")) {
        return {term: "foo", results: [{definitions: ["foo definition 1", "foo definition 2"]}]}
      }

      if (selector.key.includes("withDictionaries")) {
        return ["dictionary 1", "dictionary 2"]
      }

      return null
    },
  }
})

describe("Glossary", () => {
  test("it renders main glossary view in detailed view", () => {
    jest.spyOn(React, "useState").mockImplementation(_ => ["foo", _ => _])

    const {queryByText} = render(<Glossary />)

    expect(queryByText("←")).toBeInTheDocument()
    expect(queryByText("foo")).toBeInTheDocument()
    expect(queryByText(/definition 1/)).toBeInTheDocument()
    expect(queryByText(/definition 2/)).toBeInTheDocument()
  })

  test("it renders main glossary view in list view", () => {
    jest.spyOn(React, "useState").mockImplementation(_ => [null, _ => _])

    const {queryByText} = render(<Glossary />)

    expect(queryByText("dictionary 1")).toBeInTheDocument()
    expect(queryByText("foo")).toBeInTheDocument()
    expect(queryByText(/foo definition 1/)).toBeInTheDocument()
    expect(queryByText(/foo definition 2/)).toBeInTheDocument()

    expect(queryByText("dictionary 2")).toBeInTheDocument()
    expect(queryByText("bar")).toBeInTheDocument()
    expect(queryByText(/bar definition 1/)).toBeInTheDocument()
    expect(queryByText(/bar definition 2/)).toBeInTheDocument()
  })
})
