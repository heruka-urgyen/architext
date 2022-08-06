const getFocusKey = editorState => editorState.getSelection().getFocusKey()

const getFocusOffset = editorState =>
  editorState.getSelection().getFocusOffset()

const getTextInSelectedBlock = editorState =>
  editorState
    .getCurrentContent()
    .getBlockMap()
    .get(getFocusKey(editorState))
    .getText()

export {getFocusKey, getFocusOffset, getTextInSelectedBlock}
