import React, {useState, useCallback, useEffect} from "react"
import {
  Modifier,
  ContentBlock,
  ContentState,
  EditorState,
  genKey,
} from "draft-js"
import {useRecoilCallback} from "recoil"
import {List} from "immutable"
import Editor from "@draft-js-plugins/editor"
import createInlineToolbarPlugin from "@draft-js-plugins/inline-toolbar"

import {Toolbar, CrosslinkButton} from "../toolbars"

import {LanguageBlock} from "./LanguageBlock"
import {handleChange, handlePastedText, handleKeyCommand} from "./editing"
import {blockLanguages} from "./constants"
import {keybindings} from "./keybindings"
import {createCrosslinkDecorator} from "./decorators"

import "@draft-js-plugins/inline-toolbar/lib/plugin.css"

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

  const selection = editorState.getSelection()
  const [crosslinks, setCrosslinks] = useState([])

  useEffect(() => {
    if (crosslinks[0] != null && crosslinks[1] != null) {
      const [link1, link2] = crosslinks
      const c2 = Modifier.applyEntity(
        link1.content,
        link2.selection,
        link2.entityKey,
      )

      const c3 = c2
        .replaceEntityData(link1.entityKey, {
          linkTo: link2.entityKey,
          selection: link1.selection,
        })
        .replaceEntityData(link2.entityKey, {
          linkTo: link1.entityKey,
          selection: link2.selection,
        })

      const newEditorState = EditorState.set(editorState, {
        selection: selection.set("anchorOffset", selection.getFocusOffset()),
        currentContent: c3,
      })

      setCrosslinks([])
      setEditorState(newEditorState)
    }
  }, [crosslinks, editorState, setEditorState, selection])

  const [{plugins, InlineToolbar}] = useState(() => {
    const inlineToolbarPlugin = createInlineToolbarPlugin()
    const {InlineToolbar} = inlineToolbarPlugin
    const plugins = [inlineToolbarPlugin]

    return {
      plugins,
      InlineToolbar,
    }
  })

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
        plugins={plugins}
        placeholder=""
      />
      <InlineToolbar>
        {props => (
          <CrosslinkButton
            crosslinks={crosslinks}
            setCrosslinks={setCrosslinks}
            {...props}
          />
        )}
      </InlineToolbar>
    </div>
  )
}

export {ArchitextEditor}
