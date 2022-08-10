import {ContentBlock, EditorState, genKey} from "draft-js"
import {getSelectedBlock, getBlockMap, getLineUnderCursor} from "./editor-utils"

import {withLineUnderCursor} from "../states/glossary"

const handleChange = (setEditorState, setRecoilState) => editorState => {
  setEditorState(editorState)
  setRecoilState(withLineUnderCursor, getLineUnderCursor(editorState))
}

const addBlock = states => data => {
  const {editorState, setEditorState} = states

  const selection = editorState.getSelection()
  const offset = selection.get("anchorOffset")
  const blockMap = getBlockMap(editorState)
  const selectedBlock = getSelectedBlock(editorState)
  const seq = blockMap.toSeq()
  const blocksBefore = seq.takeUntil(v => v === selectedBlock)
  const blocksAfter = seq.skipUntil(v => v === selectedBlock).slice(1)

  const updatedSelectedBlock = selectedBlock
    .update("text", t => t.slice(0, offset))
    .update("characterList", t => t.slice(0, offset))

  const key = genKey()
  const newBlock = new ContentBlock({
    key,
    type: "unstyled",
    text: selectedBlock.get("text").slice(offset),
    characterList: selectedBlock.get("characterList").slice(offset),
    data,
  })

  const newBlockMap = blocksBefore
    .concat(
      [
        [updatedSelectedBlock.getKey(), updatedSelectedBlock],
        [key, newBlock],
      ],
      blocksAfter,
    )
    .toOrderedMap()

  const currentContent = editorState.getCurrentContent()
  const updatedContent = currentContent.merge({
    blockMap: newBlockMap,
    selectionBefore: selection,
    selectionAfter: selection.merge({
      anchorKey: key,
      anchorOffset: 0,
      focusKey: key,
      focusOffset: 0,
      isBackward: false,
    }),
  })

  setEditorState(
    EditorState.push(editorState, updatedContent, "add-language-block"),
  )
}

export {handleChange, addBlock}
