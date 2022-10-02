import {useEffect} from "react"
import {EditorState, Modifier} from "draft-js"
import {
  getSelectedBlock,
  maybeGetEntity,
  isEntityCrosslink,
} from "../editor/editor-utils"
import {entityTypes} from "../editor/constants"

const RemoveCrosslink = props => {
  const {getEditorState, setEditorState, onOverrideContent, setCrosslinks} =
    props
  const editorState = getEditorState()
  const selection = editorState.getSelection()
  const currentContent = editorState.getCurrentContent()
  const block = getSelectedBlock(editorState)
  const entityKey = block.getEntityAt(selection.get("focusOffset") - 1)
  const entityIsCrosslink = isEntityCrosslink(maybeGetEntity(editorState))

  useEffect(() => {
    if (!entityIsCrosslink) {
      onOverrideContent(undefined)
    }
  }, [entityIsCrosslink, onOverrideContent])

  return (
    <button
      className="headline-button"
      onMouseDown={_ => {
        const entityData1 = currentContent.getEntity(entityKey).getData()
        const c1 = Modifier.applyEntity(
          currentContent,
          entityData1.selection,
          null,
        )

        if (entityData1.linkTo == null) {
          setEditorState(EditorState.set(editorState, {currentContent: c1}))
        } else {
          const entityData2 = currentContent
            .getEntity(entityData1.linkTo)
            .getData()
          const c2 = Modifier.applyEntity(c1, entityData2.selection, null)

          setEditorState(EditorState.set(editorState, {currentContent: c2}))
        }

        setCrosslinks([])
        props.onOverrideContent(undefined)
      }}
    >
      <span className="material-symbols-outlined">link_off</span>
    </button>
  )
}

export const CrosslinkButton = props => {
  const {
    crosslinks,
    setCrosslinks,
    getEditorState,
    setEditorState,
    onOverrideContent,
  } = props
  const editorState = getEditorState()
  const selection = editorState.getSelection()
  const currentContent = editorState.getCurrentContent()
  const entityIsCrosslink = isEntityCrosslink(maybeGetEntity(editorState))
  const getCrosslinkButtonClass = crosslinks => {
    if (crosslinks.length === 0) {
      return "headline-button"
    }

    return "headline-button headline-button--active"
  }

  useEffect(() => {
    if (entityIsCrosslink) {
      onOverrideContent(props => (
        <RemoveCrosslink setCrosslinks={setCrosslinks} {...props} />
      ))
    } else {
      onOverrideContent(undefined)
    }
  }, [selection, entityIsCrosslink, onOverrideContent, setCrosslinks])

  return (
    <div className="headline-button-wrapper">
      <button
        className={getCrosslinkButtonClass(crosslinks)}
        onMouseDown={_ => {
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

          setEditorState(
            EditorState.set(editorState, {
              selection: selection.set(
                "anchorOffset",
                selection.getFocusOffset(),
              ),
              currentContent: newContent,
            }),
          )
        }}
      >
        <span className="material-symbols-outlined">add_link</span>
      </button>
    </div>
  )
}
