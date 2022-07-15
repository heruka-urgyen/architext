/**
 * @jest-environment jsdom
 */

import {render} from "@testing-library/react"
import "@testing-library/jest-dom"

import {createTagDecorator} from "../decorators"

describe("decorators", () => {
  test("finds tags in text", () => {
    const tags = [
      {tag: "bo", color: "#800000"},
      {tag: "en", color: "#0000ff"},
    ]

    const {_decorators} = createTagDecorator(tags)
    const callback = jest.fn()

    _decorators.forEach(({strategy}, i) => {
      const {tag} = tags[i]
      strategy({getText: _ => `<${tag}>`}, callback)
      strategy({getText: _ => `text<${tag}>`}, callback)
      strategy({getText: _ => `<${tag}>text`}, callback)
      strategy({getText: _ => `text<${tag}>text`}, callback)
      strategy({getText: _ => `<${tag}></${tag}>`}, callback)
      strategy({getText: _ => `text<${tag}></${tag}>`}, callback)
      strategy({getText: _ => `<${tag}></${tag}>text`}, callback)
      strategy({getText: _ => `text<${tag}></${tag}>text`}, callback)
      strategy({getText: _ => `<${tag}>text</${tag}>`}, callback)
      strategy({getText: _ => `<${tag}>text</${tag}>text`}, callback)
      strategy({getText: _ => `<text${tag}>text</${tag}>`}, callback)
      strategy({getText: _ => `<text${tag}>text</${tag}>text>`}, callback)
    })

    expect(callback).toHaveBeenCalledTimes(tags.length * 18)
  })

  test("creates decorator element", () => {
    const tags = [
      {tag: "bo", color: "#800000"},
      {tag: "en", color: "#0000ff"},
    ]

    const getTag = tag => `tag tag__${tag}`
    const {_decorators} = createTagDecorator(tags)

    _decorators.forEach(({component}, i) => {
      const Component = component
      const decoratorElement = render(<Component />).container.children[0]

      expect(decoratorElement).toHaveStyle({color: tags[i].color})
      expect(decoratorElement).toHaveClass(getTag(tags[i].tag))
    })
  })
})
