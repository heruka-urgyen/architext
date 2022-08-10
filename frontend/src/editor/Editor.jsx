import React, {useState, useCallback} from "react"
import {
  ContentBlock,
  ContentState,
  DefaultDraftBlockRenderMap,
  Editor,
  EditorState,
  genKey,
} from "draft-js"
import {Map, List, Seq} from "immutable"
import {useRecoilCallback} from "recoil"

import {createTagDecorator} from "./decorators"
import {handleChange, addBlock} from "./editing"
import {getSelectedBlock, getBlockMap} from "./editor-utils"
import {blockLanguages} from "./constants"
import {keybindings} from "./keybindings"

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
    <div className="editor-wrapper" onClick={handleWrapperClick}>
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
