import React, {useState} from "react"
import {
  Editor,
  EditorState,
} from "draft-js"

const handleChange = setEditorState => state => {
  setEditorState(state)
}

function ArchitextEditor() {
  const editor = React.useRef(null)
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
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
