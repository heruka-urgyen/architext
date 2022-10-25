import {
  ContentBlock, EditorState, genKey, CharacterMetadata,
} from "draft-js"

import {List} from "immutable"
import {
  getSelectedBlock,
  getBlockMap,
  getLineUnderCursor,
  getFocusKey,
} from "./editor-utils"
import {blockLanguages, entityTypes} from "./constants"

import {withLineUnderCursor} from "../states/glossary"

const findEntityRangesInBlock = (b, currentContent) => {
  const entityRanges = []
  const blockKey = b.getKey()
  let entityKey

  b.findEntityRanges(
    character => {
      entityKey = character.getEntity()

      if (entityKey != null) {
        return (
          currentContent.getEntity(entityKey).getType()
          === entityTypes.crosslink
        )
      }

      return false
    },
    (offsetStart, offsetEnd) => {
      entityRanges.push({
        entityKey,
        blockKey,
        offsetStart,
        offsetEnd,
      })
    },
  )

  return entityRanges
}

// FIXME: find and update entity ranges for linked entities
const updateEntityRanges = (block, currentContent, editorState) => {
  const entityRanges = findEntityRangesInBlock(block, currentContent)

  if (entityRanges.length > 0) {
    const newState = entityRanges.reduce((state, range) => {
      const {
        entityKey, blockKey, offsetStart, offsetEnd,
      } = range

      return EditorState.set(state, {
        currentContent: currentContent.mergeEntityData(entityKey, {
          pos: [blockKey, offsetStart, offsetEnd],
        }),
      })
    }, editorState)

    return newState
  }

  return editorState
}

export const handleChange = (setEditorState, setRecoilState) => editorState => {
  setRecoilState(withLineUnderCursor, getLineUnderCursor(editorState))

  const block = getSelectedBlock(editorState)
  const currentContent = editorState.getCurrentContent()

  const newState = updateEntityRanges(block, currentContent, editorState)

  setEditorState(newState)
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

  const newState = EditorState.push(
    updateEntityRanges(newBlock, currentContent, editorState),
    updatedContent,
    "add-language-block",
  )

  setEditorState(newState)
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

export const handleKeyCommand = ({editorState, setEditorState}) =>
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
