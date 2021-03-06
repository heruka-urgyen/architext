import React, {useState} from "react"
import {
  Editor,
  EditorState,
} from "draft-js"
import {useRecoilCallback} from "recoil"

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
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(createTagDecorator(tags))
  )
  const onChange = useRecoilCallback(({set}) => (
    handleChange(setEditorState, getLineUnderCursor, set.bind(null, withLineUnderCursor))
  ), [editorState])

  return (
    <div className="editor-wrapper">
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={onChange}
        placeholder=""
      />
    </div>
  )
}

export {ArchitextEditor}
