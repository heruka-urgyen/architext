import React, {useState} from "react"
import {
  Editor,
  EditorState,
} from "draft-js"

import {createTagDecorator} from "./decorators"
import {getLineUnderCursor} from "./getLineUnderCursor"
import {withLineUnderCursor} from "../states/glossary"

const handleChange = (setEditorState, getLineUnderCursor, setLineUnderCursor) => editorState => {
  setEditorState(editorState)
  setLineUnderCursor(getLineUnderCursor(editorState))
}

function ArchitextEditor(props) {
  const {tags} = props
  const editor = React.useRef(null)
  const [state, setState] = useState({
    editorState: EditorState.createEmpty(createTagDecorator(tags)),
    glossary: [],
  })

  return (
    <div className="editor-wrapper">
      <Editor
        ref={editor}
        editorState={state.editorState}
        onChange={handleChange(setState)}
        placeholder=""
      />
    </div>
  )
}

export {ArchitextEditor}
