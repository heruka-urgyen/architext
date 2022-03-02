import React, {useState} from "react"
import {
  Editor,
  EditorState,
  CompositeDecorator,
} from "draft-js"

import {createTagDecorator} from "./decorators"

const handleChange = setEditorState => state => {
  setEditorState(state)
}

function ArchitextEditor(props) {
  const {tags} = props
  const editor = React.useRef(null)
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(createTagDecorator(tags))
  )

  return (
    <>
      <div className="editor-wrapper">
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={handleChange(setEditorState)}
          placeholder=""
        />
      </div>
    </>
  )
}

export {ArchitextEditor}
