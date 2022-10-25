import {useMemo} from "react"
import {changeBlockLanguage} from "../editor/editing"
import {getSelectedBlock} from "../editor/editor-utils"

const ToolbarButton = props => {
  const {
    style, disabled = false, onClick, children,
  } = props

  return (
    <button
      className="editor-toolbar__button"
      style={style}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

const Toolbar = ({editorConfig, editorState, setEditorState}) => {
  const selectedBlockLanguage = getSelectedBlock(editorState).getData().language
  const languageConfig = useMemo(
    () =>
      editorConfig.blockConfig.find(
        x => x.language === selectedBlockLanguage,
      ) || editorConfig.blockConfig[0],
    [editorConfig.blockConfig, selectedBlockLanguage],
  )

  return (
    <div className="editor-toolbar">
      <ToolbarButton
        style={{
          color: languageConfig.style.color,
          borderColor: languageConfig.style.color,
        }}
        onClick={_ =>
          changeBlockLanguage({
            selectedBlockLanguage,
            editorState,
            setEditorState,
          })
        }
      >
        {selectedBlockLanguage}
      </ToolbarButton>
    </div>
  )
}

export {Toolbar}
