import {getFocusOffset, getTextInSelectedBlock} from "./editor-utils"

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

export {getLineUnderCursor}
