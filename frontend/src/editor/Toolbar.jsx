import {useState, useEffect, useMemo} from "react"
import {EditorState, Modifier} from "draft-js"
import {changeBlockLanguage} from "./editing"
import {
  getSelectedBlock,
  maybeGetEntity,
  isEntityCrosslink,
} from "./editor-utils"
import {entityTypes} from "./constants"

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

const CrosslinkButton = props => {
  const {crosslinks, setCrosslinks, editorState, setEditorState} = props

  const selection = editorState.getSelection()
  const currentContent = editorState.getCurrentContent()
  const block = getSelectedBlock(editorState)
  const entityKey = block.getEntityAt(selection.get("focusOffset") - 1)
  const hasEntity = entityKey != null
  const entityIsCrosslink = isEntityCrosslink(maybeGetEntity(editorState))
  const mode = hasEntity && entityIsCrosslink ? "remove" : "add"
  const disabled = mode === "add" && selection.getAnchorOffset() === selection.getFocusOffset()
  const getCrosslinkButtonColor = ({mode, disabled, crosslinks}) => {
    if (mode === "remove") {
      return "red"
    }

    if (disabled) {
      return "grey"
    }

    if (crosslinks.length === 0) {
      return "inherit"
    }

    return "green"
  }
  const style = {
    borderColor: getCrosslinkButtonColor({mode, disabled, crosslinks}),
    color: getCrosslinkButtonColor({mode, disabled, crosslinks}),
  }

  return (
    <ToolbarButton
      style={style}
      disabled={disabled}
      onClick={_ => {
        if (mode === "remove") {
          const entityData1 = currentContent.getEntity(entityKey).getData()
          const c1 = Modifier.applyEntity(
            currentContent,
            entityData1.selection,
            null,
          )

          if (entityData1.linkTo == null) {
            setEditorState(s => EditorState.set(s, {currentContent: c1}))
          } else {
            const entityData2 = currentContent
              .getEntity(entityData1.linkTo)
              .getData()
            const c2 = Modifier.applyEntity(c1, entityData2.selection, null)

            setEditorState(s => EditorState.set(s, {currentContent: c2}))
          }

          setCrosslinks([])
        } else if (mode === "add") {
          const content = currentContent.createEntity(
            entityTypes.crosslink,
            "MUTABLE",
            {selection},
          )
          const entityKey = content.getLastCreatedEntityKey()

          const newContent = Modifier.applyEntity(content, selection, entityKey)

          setCrosslinks(s => {
            s.push({
              content: newContent,
              selection,
              entityKey,
            })

            return s
          })

          setEditorState(editorState =>
            EditorState.set(editorState, {
              selection: selection.set(
                "anchorOffset",
                selection.getFocusOffset(),
              ),
              currentContent: newContent,
            }),
          )
        }
      }}
    >
      {hasEntity ? (
        <span className="material-symbols-outlined">link_off</span>
      ) : (
        <span className="material-symbols-outlined">add_link</span>
      )}
    </ToolbarButton>
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

  const [crosslinks, setCrosslinks] = useState([])

  const selection = editorState.getSelection()

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

      <CrosslinkButton
        crosslinks={crosslinks}
        setCrosslinks={setCrosslinks}
        editorState={editorState}
        setEditorState={setEditorState}
      />
    </div>
  )
}

export {Toolbar}
