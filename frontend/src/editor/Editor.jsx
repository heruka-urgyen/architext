import React, {useState, useCallback} from "react"
import {ContentBlock, ContentState, Editor, EditorState, genKey} from "draft-js"
import {List} from "immutable"
import {useRecoilCallback} from "recoil"

import {createTagDecorator} from "./decorators"
import {handleChange} from "./editing"
import {blockLanguages} from "./constants"

function ArchitextEditor(props) {
  const {tags} = props
  const editor = React.useRef(null)
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray([
        new ContentBlock({
          key: genKey(),
          type: "unstyled",
          text: "",
          characterList: List(),
          data: {
            language: blockLanguages.bo,
          },
        }),
      ]),
    ),
  )
  const onChange = useRecoilCallback(
    ({set}) => handleChange(setEditorState, set),
    [editorState],
  )
  const handleWrapperClick = useCallback(_ => editor.current.focus())

  return (
    <div className="editor-wrapper" onClick={handleWrapperClick}>
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
