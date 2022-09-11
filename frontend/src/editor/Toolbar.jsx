import {useMemo} from "react"
import {changeBlockLanguage} from "./editing"
import {getSelectedBlock} from "./editor-utils"

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
      <button
        className="editor-toolbar__button"
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
      </button>
    </div>
  )
}

export {Toolbar}
