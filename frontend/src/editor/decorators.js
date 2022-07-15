import React from "react"
import {
  CompositeDecorator,
} from "draft-js"

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
    <span style={{color}} className={className}>{children}</span>
  )
}

function createTag({tag, color}) {
  const className = `tag tag__${tag}`

  return ({children}) => React.createElement(Tag, {className, color}, children)
}

function createTagDecorator(tags) {
  return new CompositeDecorator(tags.map(tag => ({
    strategy: handleStrategy(tag.tag),
    component: createTag(tag),
  })))
}

export {createTagDecorator}
