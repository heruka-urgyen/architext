/**
 * @jest-environment jsdom
 */

import {EditorState, ContentState, SelectionState} from "draft-js"

import {
  getFocusKey,
  getFocusOffset,
  getTextInSelectedBlock,
  getLineUnderCursor,
} from "../editor-utils"

jest.mock("draft-js/lib/generateRandomKey", () => () => "test-focus-key")

describe("editor utils", () => {
  test("getFocusKey", () => {
    const selectionState = SelectionState.createEmpty().merge({
      focusKey: "test-focus-key",
      focusOffset: 0,
    })

    const state = EditorState.createWithContent(ContentState.createFromText(""))

    const stateWithSelection = EditorState.forceSelection(state, selectionState)

    expect(getFocusKey(stateWithSelection)).toEqual("test-focus-key")
  })

  test("getFocusOffset", () => {
    const selectionState = SelectionState.createEmpty().merge({
      focusKey: "test-focus-key",
      focusOffset: 3,
    })

    const state = EditorState.createWithContent(ContentState.createFromText(""))

    const stateWithSelection = EditorState.forceSelection(state, selectionState)

    expect(getFocusOffset(stateWithSelection)).toEqual(3)
  })

  test("getTextInSelectedBlock", () => {
    const selectionState = SelectionState.createEmpty().merge({
      focusKey: "test-focus-key",
      focusOffset: 0,
    })

    const state = EditorState.createWithContent(
      ContentState.createFromText("test"),
    )

    const stateWithSelection = EditorState.forceSelection(state, selectionState)

    expect(getTextInSelectedBlock(stateWithSelection)).toEqual("test")
  })

  test("read a line wrapped in special line ending symbols", () => {
    const chunks = [
      "མེས་པོའི་ཤུལ་བཞག་ལས།",
      "།མེས་པོའི་ཤུལ་བཞག་ལས།",
      "མེས་པོའི་ཤུལ་བཞག་ལས༔",
      "༔མེས་པོའི་ཤུལ་བཞག་ལས༔",
    ]

    const states = chunks.map(c =>
      EditorState.createWithContent(ContentState.createFromText(c)),
    )

    expect(getLineUnderCursor(states[0])).toEqual("མེས་པོའི་ཤུལ་བཞག་ལས")
    expect(getLineUnderCursor(states[1])).toEqual("མེས་པོའི་ཤུལ་བཞག་ལས")
    expect(getLineUnderCursor(states[2])).toEqual("མེས་པོའི་ཤུལ་བཞག་ལས")
    expect(getLineUnderCursor(states[3])).toEqual("མེས་པོའི་ཤུལ་བཞག་ལས")
  })

  test("get a line without special symbols based on spaces", () => {
    const state = EditorState.createWithContent(
      ContentState.createFromText(
        "མེས་པོའི་ཤུལ་བཞག་ལས་ ཀློང་ཆེན་རབ་འབྱམས་ཀྱི་གསུང་འབུམ ",
      ),
    )

    const selectionState = SelectionState.createEmpty().merge({
      focusKey: "test-focus-key",
      focusOffset: 40,
    })

    const stateWithSelection = EditorState.forceSelection(state, selectionState)

    expect(getLineUnderCursor(stateWithSelection)).toEqual(
      "ཀློང་ཆེན་རབ་འབྱམས་ཀྱི་གསུང་འབུམ",
    )
  })
})
