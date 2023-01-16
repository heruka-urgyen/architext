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
              [
                "foo",
                [
                  [
                    [
                      {token: "foo definition 1", type: "definition"},
                      {token: "foo definition 2", type: "definition"},
                    ],
                  ],
                ],
              ],
            ],
          },
          {
            dictionary: "dictionary 2",
            definitions: [
              [
                "bar",
                [
                  [
                    [
                      {token: "bar definition 1", type: "definition"},
                      {token: "bar definition 2", type: "definition"},
                    ],
                  ],
                ],
              ],
            ],
          },
        ]
      }

      if (selector.key.includes("withSearchTerm")) {
        return {
          term: "baz",
          results: [
            {
              dictionary: "dictionary 3",
              definitions: [
                [
                  "baz",
                  [
                    [
                      [
                        {token: "baz definition 1", type: "definition"},
                        {token: "baz definition 2", type: "definition"},
                      ],
                    ],
                  ],
                ],
              ],
            },
          ],
        }
      }

      if (selector.key.includes("withDictionaries")) {
        return [
          {name: "dictionary 1", selected: true},
          {name: "dictionary 2", selected: false},
        ]
      }

      return null
    },
  }
})

describe("Glossary", () => {
  test("it renders main glossary view in detailed view", () => {
    jest.spyOn(React, "useState").mockImplementation(_ => ["baz", _ => _])

    const {queryByText} = render(<Glossary />)

    expect(queryByText("←")).toBeInTheDocument()
    expect(queryByText("baz")).toBeInTheDocument()
    expect(queryByText(/baz definition 1/)).toBeInTheDocument()
    expect(queryByText(/baz definition 2/)).toBeInTheDocument()
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
