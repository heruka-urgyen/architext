/**
 * @jest-environment jsdom
 */

import {EditorState, ContentState, SelectionState} from "draft-js"

import {getFocusKey, getFocusOffset, getTextInSelectedBlock} from "../utils"

jest.mock("draft-js/lib/generateRandomKey", () => () => "test-focus-key")

describe("editor utils", () => {
  test("getFocusKey", () => {
    const selectionState = SelectionState
      .createEmpty()
      .merge({
        focusKey: "test-focus-key",
        focusOffset: 0,
      })

    const state = EditorState
      .createWithContent(ContentState.createFromText(""))

    const stateWithSelection = EditorState.forceSelection(state, selectionState)

    expect(getFocusKey(stateWithSelection)).toEqual("test-focus-key")
  })

  test("getFocusOffset", () => {
    const selectionState = SelectionState
      .createEmpty()
      .merge({
        focusKey: "test-focus-key",
        focusOffset: 3,
      })

    const state = EditorState
      .createWithContent(ContentState.createFromText(""))

    const stateWithSelection = EditorState.forceSelection(state, selectionState)

    expect(getFocusOffset(stateWithSelection)).toEqual(3)
  })

  test("getTextInSelectedBlock", () => {
    const selectionState = SelectionState
      .createEmpty()
      .merge({
        focusKey: "test-focus-key",
        focusOffset: 0,
      })

    const state = EditorState
      .createWithContent(ContentState.createFromText("test"))

    const stateWithSelection = EditorState.forceSelection(state, selectionState)

    expect(getTextInSelectedBlock(stateWithSelection)).toEqual("test")
  })
})
