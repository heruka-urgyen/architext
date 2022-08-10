const getFocusKey = editorState => editorState.getSelection().getFocusKey()

const getFocusOffset = editorState =>
  editorState.getSelection().getFocusOffset()

const getBlockMap = editorState => editorState.getCurrentContent().getBlockMap()

const getSelectedBlock = editorState =>
  getBlockMap(editorState).get(getFocusKey(editorState))

const getTextInSelectedBlock = editorState =>
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

const getLineUnderCursor = editorState =>
  findLine(getTextInSelectedBlock(editorState), getFocusOffset(editorState))

export {
  getFocusKey,
  getFocusOffset,
  getBlockMap,
  getSelectedBlock,
  getTextInSelectedBlock,
  getLineUnderCursor,
}
