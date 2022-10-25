import {useState, useEffect} from "react"
import {EditorState, Modifier, SelectionState} from "draft-js"
import {
  isEntityCrosslink,
  removeEntity,
  findEntityInSelection,
} from "../editor/editor-utils"
import {entityTypes} from "../editor/constants"

const addCrosslinkEntity = (content, selection) => {
  const content1 = content.createEntity(entityTypes.crosslink, "MUTABLE", {})
  const entityKey = content1.getLastCreatedEntityKey()

  const content2 = Modifier.applyEntity(content1, selection, entityKey)

  return {entityKey, content: content2}
}

const selectCrosslink = entityData =>
  SelectionState.createEmpty()
    .set("anchorKey", entityData.pos[0])
    .set("focusKey", entityData.pos[0])
    .set("anchorOffset", entityData.pos[1])
    .set("focusOffset", entityData.pos[2])
    .set("isBackward", false)
    .set("hasFocus", true)

const findRemoveCrosslinks = (currentContent, entityKey) => {
  const inner = removed => (currentContent, entityKey) => {
    if (entityKey == null || removed.find(x => x === entityKey)) {
      return currentContent
    }

    const entityData = currentContent.getEntity(entityKey).getData()
    const entitySelection = selectCrosslink(entityData)
    const contentWithoutEntity = removeEntity(currentContent, entitySelection)

    return inner([...removed, entityKey])(
      contentWithoutEntity,
      entityData.linkTo,
    )
  }

  return inner([])(currentContent, entityKey)
}

const removeCrosslink = props => _ => {
  const {
    entityKey,
    getEditorState,
    setEditorState,
    onOverrideContent,
    setOrphanLink,
  } = props

  const editorState = getEditorState()
  const currentContent = editorState.getCurrentContent()

  setEditorState(
    EditorState.set(editorState, {
      currentContent: findRemoveCrosslinks(currentContent, entityKey),
    }),
  )

  setOrphanLink(null)

  onOverrideContent(undefined)
}

const addCrosslink = props => _ => {
  const {
    orphanLink, setOrphanLink, editorState, setEditorState,
  } = props
  const currentContent = editorState.getCurrentContent()
  const selection = editorState.getSelection()

  if (orphanLink != null) {
    const entityData = currentContent.getEntity(orphanLink).getData()

    const cl1Selection = selectCrosslink(entityData)

    const cl1 = addCrosslinkEntity(
      removeEntity(currentContent, cl1Selection),
      cl1Selection,
    )
    const cl2 = addCrosslinkEntity(cl1.content, selection)

    const [anchorOffset, focusOffset] = [
      selection.getAnchorOffset(),
      selection.getFocusOffset(),
    ]

    const newContent = cl2.content
      .mergeEntityData(cl1.entityKey, {
        linkTo: cl2.entityKey,
        pos: entityData.pos,
      })
      .mergeEntityData(cl2.entityKey, {
        linkTo: cl1.entityKey,
        pos: [
          selection.getEndKey(),
          Math.min(anchorOffset, focusOffset),
          Math.max(anchorOffset, focusOffset),
        ],
      })

    setEditorState(
      EditorState.set(editorState, {
        selection: selection.set("anchorOffset", selection.getFocusOffset()),
        currentContent: newContent,
      }),
    )

    setOrphanLink(null)
  } else {
    const cl1 = addCrosslinkEntity(currentContent, selection)

    setEditorState(
      EditorState.set(editorState, {
        selection: selection.set("anchorOffset", selection.getFocusOffset()),
        currentContent: cl1.content,
      }),
    )

    setOrphanLink(cl1.entityKey)
  }
}

const getCrosslinkButtonClass = orphanLink => {
  if (orphanLink != null) {
    return "headline-button"
  }

  return "headline-button headline-button--active"
}

const RemoveCrosslinkButton = props => (
  <button className="headline-button" onMouseDown={removeCrosslink(props)}>
    <span className="material-symbols-outlined">link_off</span>
  </button>
)

export const CrosslinkButton = props => {
  const {getEditorState, setEditorState, onOverrideContent} = props

  const [orphanLink, setOrphanLink] = useState(undefined)

  const editorState = getEditorState()
  const [entityKey, entity] = findEntityInSelection(editorState)
  const entityIsCrosslink = isEntityCrosslink(entity)

  useEffect(() => {
    if (entityIsCrosslink) {
      onOverrideContent(props => (
        <RemoveCrosslinkButton
          setOrphanLink={setOrphanLink}
          entityKey={entityKey}
          {...props}
        />
      ))
    } else {
      onOverrideContent(undefined)
    }
  }, [entityIsCrosslink, onOverrideContent, setOrphanLink, entityKey])

  return (
    <div className="headline-button-wrapper">
      <button
        className={getCrosslinkButtonClass(orphanLink)}
        onMouseDown={addCrosslink({
          orphanLink,
          setOrphanLink,
          editorState,
          setEditorState,
        })}
      >
        <span className="material-symbols-outlined">add_link</span>
      </button>
    </div>
  )
}
