import React, {useState, useCallback, useEffect} from "react"
import {
  ContentBlock, ContentState, Editor, EditorState, genKey,
} from "draft-js"
import {useRecoilCallback} from "recoil"
import {List} from "immutable"

import {LanguageBlock} from "./LanguageBlock"
import {Toolbar} from "./Toolbar"
import {handleChange, handlePastedText, handleKeyCommand} from "./editing"
import {blockLanguages} from "./constants"
import {keybindings} from "./keybindings"
import {createCrosslinkDecorator} from "./decorators"

const renderBlock = blockConfig => block => {
  const {language} = block.getData()

  if (language != null) {
    return {
      component: LanguageBlock,
      props: blockConfig.find(x => x.language === language),
    }
  }

  return null
}

const styleBlock = blockLanguages => block => {
  const {language} = block.getData()

  if (blockLanguages[language] != null) {
    return `block block__${language}`
  }

  return "block"
}

function ArchitextEditor({editorConfig}) {
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
  useEffect(() => {
    setEditorState(editorState =>
      EditorState.set(editorState, {
        decorator: createCrosslinkDecorator(setEditorState),
      }),
    )
  }, [setEditorState])
  const onChange = useRecoilCallback(
    ({set}) => handleChange(setEditorState, set),
    [editorState],
  )
  const handleWrapperInteration = useCallback(_ => {
    setTimeout(_ => editor.current.focus(), 0)
  }, [])

  return (
    <div
      className="editor-wrapper"
      role="textbox"
      tabIndex="0"
      onClick={handleWrapperInteration}
      aria-hidden={true}
    >
      <Toolbar
        editorConfig={editorConfig}
        editorState={editorState}
        setEditorState={setEditorState}
      />
      <Editor
        ref={editor}
        blockStyleFn={styleBlock(blockLanguages)}
        blockRendererFn={renderBlock(editorConfig.blockConfig)}
        editorState={editorState}
        onChange={onChange}
        handlePastedText={handlePastedText(setEditorState)}
        handleKeyCommand={handleKeyCommand({
          editorState,
          setEditorState,
        })}
        keyBindingFn={keybindings}
        placeholder=""
      />
    </div>
  )
}

export {ArchitextEditor}
