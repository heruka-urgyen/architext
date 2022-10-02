import {ContentBlock, EditorState, genKey, CharacterMetadata} from "draft-js"

import {List} from "immutable"
import {
  getSelectedBlock,
  getBlockMap,
  getLineUnderCursor,
  getFocusKey,
} from "./editor-utils"
import {blockLanguages} from "./constants"

import {withLineUnderCursor} from "../states/glossary"

export const handleChange = (setEditorState, setRecoilState) => editorState => {
  setEditorState(editorState)
  setRecoilState(withLineUnderCursor, getLineUnderCursor(editorState))
}

export const addBlock = states => data => {
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

export const handlePastedText = setEditorState => (text, _, editorState) => {
  const selection = editorState.getSelection()
  const blockMap = getBlockMap(editorState)
  const currentContent = editorState.getCurrentContent()
  const updatedContent = currentContent.merge({
    blockMap: blockMap
      .setIn([getFocusKey(editorState), "text"], text)
      .setIn(
        [getFocusKey(editorState), "characterList"],
        List(text.split("").map(_ => CharacterMetadata.create())),
      ),
    selectionBefore: selection,
    selectionAfter: selection,
  })

  setEditorState(EditorState.push(editorState, updatedContent, "paste text"))

  return true
}

export const handleKeyCommand =
  ({editorState, setEditorState}) =>
  command => {
    const setLanguageForBlock = ({caseBo, caseEn}) => {
      const addBlock1 = addBlock({editorState, setEditorState})
      const selectedBlock = getSelectedBlock(editorState)
      const {language} = selectedBlock.getData()

      if (language === blockLanguages.bo) {
        addBlock1(caseBo)
      }

      if (language === blockLanguages.en) {
        addBlock1(caseEn)
      }
    }

    if (command === "add-language-block") {
      setLanguageForBlock({
        caseBo: {language: blockLanguages.en},
        caseEn: {language: blockLanguages.bo},
      })
      return "handled"
    }

    if (command === "add-block") {
      setLanguageForBlock({
        caseBo: {language: blockLanguages.bo},
        caseEn: {language: blockLanguages.en},
      })
      return "handled"
    }

    return "not-handled"
  }

export const changeBlockLanguage = ({
  selectedBlockLanguage,
  editorState,
  setEditorState,
}) => {
  let language = "en"

  if (selectedBlockLanguage === blockLanguages.en) {
    language = "bo"
  }

  const selection = editorState.getSelection()
  const blockMap = getBlockMap(editorState)
  const currentContent = editorState.getCurrentContent()
  const updatedContent = currentContent.merge({
    blockMap: blockMap.setIn([getFocusKey(editorState), "data"], {
      language,
    }),
    selectionBefore: selection,
    selectionAfter: selection,
  })

  setEditorState(
    EditorState.push(editorState, updatedContent, "change-block-language"),
  )
}
