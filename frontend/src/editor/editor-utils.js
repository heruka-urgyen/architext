import {Modifier} from "draft-js"
import {entityTypes} from "./constants"

export const getFocusKey = editorState =>
  editorState.getSelection().getFocusKey()

export const getFocusOffset = editorState =>
  editorState.getSelection().getFocusOffset()

export const getBlockMap = editorState =>
  editorState.getCurrentContent().getBlockMap()

export const getSelectedBlock = editorState =>
  getBlockMap(editorState).get(getFocusKey(editorState))

export const getTextInSelectedBlock = editorState =>
  getSelectedBlock(editorState).getText()

const findLine = (text, offset) => {
  const chunks = [...text.matchAll(/(།|༔)?(.*?)(།|༔|\s)/g)]
  const lines = chunks.reduce(
    (acc, chunk, i) => {
      if (acc.res !== "") {
        return acc
      }

      const chunkLength = [...chunk[0]].length
      const charCountSoFar = acc.length + chunkLength

      acc.length = charCountSoFar
      acc.position = i

      if (charCountSoFar <= offset) {
        return acc
      }

      acc.res = chunk[2]

      return acc
    },
    {position: 0, length: 0, res: ""},
  )

  return lines.res
}

export const getLineUnderCursor = editorState =>
  findLine(getTextInSelectedBlock(editorState), getFocusOffset(editorState))

export const maybeGetEntity = (entityKey, editorState) => {
  const currentContent = editorState.getCurrentContent()

  if (entityKey != null) {
    return currentContent.getEntity(entityKey)
  }

  return {
    getType: () => null,
  }
}

export const isEntityCrosslink = entity =>
  entity.getType() === entityTypes.crosslink

export const removeEntity = (currentContent, selection) =>
  Modifier.applyEntity(currentContent, selection, null)

export const findEntityInSelection = editorState => {
  const selection = editorState.getSelection()
  const block = getSelectedBlock(editorState)
  const ao = selection.get("anchorOffset")
  const fo = selection.get("focusOffset")

  const entityKey = Array.from(
    {length: Math.abs(ao - fo)},
    (_, i) => Math.min(ao, fo) + i,
  )
    .map(i => block.getEntityAt(i))
    .find(x => x)

  return [entityKey, maybeGetEntity(entityKey, editorState)]
}
