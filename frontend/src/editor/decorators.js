import React from "react"
import {EditorState, CompositeDecorator, SelectionState} from "draft-js"

import {entityTypes} from "./constants"

function findWithRegex(tag, contentBlock, callback) {
  const text = contentBlock.getText()
  const tagPair = `<${tag}>|</${tag}>`

  for (const match of text.matchAll(tagPair)) {
    callback(match.index, match.index + match[0].length)
  }
}

function handleStrategy(tag) {
  return (contentBlock, callback) => {
    findWithRegex(tag, contentBlock, callback)
  }
}

function Tag(props) {
  const {className, color, children} = props

  return (
    <span style={{color}} className={className}>
      {children}
    </span>
  )
}

function createTag({tag, color}) {
  const className = `tag tag__${tag}`

  return ({children}) => React.createElement(Tag, {className, color}, children)
}

function createTagDecorator(tags) {
  return new CompositeDecorator(
    tags.map(tag => ({
      strategy: handleStrategy(tag.tag),
      component: createTag(tag),
    })),
  )
}

function findCrossLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity()

    return (
      entityKey !== null
      && contentState.getEntity(entityKey).getType() === entityTypes.crosslink
    )
  }, callback)
}

const Crosslink = props => {
  const {
    setEditorState, contentState, entityKey, children,
  } = props

  const currentContent = contentState
  const entity = currentContent.getEntity(entityKey)
  const entityData = entity.getData()
  const isOrphanLink = entityData.linkTo == null
  const pos = isOrphanLink
    ? []
    : currentContent.getEntity(entityData.linkTo).getData().pos

  const onClick = () => {
    setEditorState(editorState => {
      const newEditorState = EditorState.forceSelection(
        editorState,
        SelectionState.createEmpty()
          .set("anchorKey", pos[0])
          .set("focusKey", pos[0])
          .set("anchorOffset", pos[2])
          .set("focusOffset", pos[2]),
      )
      return newEditorState
    })
  }

  const style = {
    textDecoration: isOrphanLink ? "none" : "underline",
    cursor: "pointer",
    color: isOrphanLink ? "grey" : "green",
    borderBottom: isOrphanLink ? "1px dashed grey" : "none",
  }

  return (
    <button className="crosslink" onClick={_ => onClick({})} style={style}>
      {children}
    </button>
  )
}

const createCrosslink = setEditorState => props =>
  React.createElement(Crosslink, {...props, setEditorState}, props.children)

const createCrosslinkDecorator = setEditorState =>
  new CompositeDecorator([
    {
      strategy: findCrossLinkEntities,
      component: createCrosslink(setEditorState),
    },
  ])

export {createTagDecorator, createCrosslinkDecorator}
