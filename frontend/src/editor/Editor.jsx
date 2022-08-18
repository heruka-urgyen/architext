import React, {useState, useCallback} from "react"
import {
  ContentBlock, ContentState, Editor, EditorState, genKey,
} from "draft-js"
import {useRecoilCallback} from "recoil"
import {List} from "immutable"

import {handleChange, addBlock} from "./editing"
import {getSelectedBlock} from "./editor-utils"
import {blockLanguages} from "./constants"
import {keybindings} from "./keybindings"

function ArchitextEditor() {
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
  const handleWrapperInteration = useCallback(_ => editor.current.focus(), [])

  const handleKeyCommand = command => {
    const addBlock1 = addBlock({editorState, setEditorState})

    if (command === "add-language-block") {
      const selectedBlock = getSelectedBlock(editorState)
      const {language} = selectedBlock.getData()

      if (language === blockLanguages.bo) {
        addBlock1({language: blockLanguages.en})
      }

      if (language === blockLanguages.en) {
        addBlock1({language: blockLanguages.bo})
      }

      return "handled"
    }

    if (command === "add-block") {
      const selectedBlock = getSelectedBlock(editorState)
      const {language} = selectedBlock.getData()

      if (language === blockLanguages.bo) {
        addBlock1({language: blockLanguages.bo})
      }

      if (language === blockLanguages.en) {
        addBlock1({language: blockLanguages.en})
      }

      return "handled"
    }

    return "not-handled"
  }

  return (
    <div
      className="editor-wrapper"
      role="textbox"
      tabIndex="0"
      onKeyDown={handleWrapperInteration}
      onClick={handleWrapperInteration}
    >
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={onChange}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={keybindings}
        placeholder=""
      />
    </div>
  )
}

export {ArchitextEditor}
