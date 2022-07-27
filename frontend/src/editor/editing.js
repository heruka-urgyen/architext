import {getLineUnderCursor} from "./getLineUnderCursor"

import {withLineUnderCursor} from "../states/glossary"

const handleChange = (setEditorState, setRecoilState) => editorState => {
  setEditorState(editorState)
  setRecoilState(withLineUnderCursor, getLineUnderCursor(editorState))
}

export {handleChange}
