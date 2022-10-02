import React from "react"
import {EditorState, CompositeDecorator} from "draft-js"

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
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === entityTypes.crosslink
    )
  }, callback)
}

const Crosslink = setEditorState => props => {
  const {contentState, entityKey, children} = props

  const onClick = () => {
    const currentContent = contentState
    const blockMap = currentContent.getBlockMap()
    const selection = currentContent.getSelectionBefore()

    blockMap.forEach(b =>
      b.findEntityRanges(
        character => {
          const entityKey = character.getEntity()

          if (entityKey) {
            const entity = currentContent.getEntity(entityKey)

            return (
              entity.getType() === entityTypes.crosslink &&
              entity.getData().linkTo === entityKey
            )
          }

          return false
        },
        (_, offsetEnd) => {
          setEditorState(editorState => {
            const newEditorState = EditorState.forceSelection(
              editorState,
              selection
                .set("anchorKey", b.getKey())
                .set("focusKey", b.getKey())
                .set("anchorOffset", offsetEnd)
                .set("focusOffset", offsetEnd),
            )
            return newEditorState
          })
        },
      ),
    )
  }

  const isOrphanLink = () =>
    contentState.getEntity(entityKey).getData().linkTo == null

  return (
    <button
      className="crosslink"
      onClick={onClick}
      style={{
        textDecoration: isOrphanLink() ? "none" : "underline",
        cursor: "pointer",
        color: isOrphanLink() ? "grey" : "green",
        borderBottom: isOrphanLink() ? "1px dashed grey" : "none",
      }}
    >
      {children}
    </button>
  )
}

const createCrosslinkDecorator = setEditorState =>
  new CompositeDecorator([
    {
      strategy: findCrossLinkEntities,
      component: Crosslink(setEditorState),
    },
  ])

export {createTagDecorator, createCrosslinkDecorator}
