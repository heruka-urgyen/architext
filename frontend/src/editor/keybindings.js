import {getDefaultKeyBinding, KeyBindingUtil} from "draft-js"

const {hasCommandModifier} = KeyBindingUtil

export const keybindings = e => {
  if (e.keyCode === 13) {
    if (hasCommandModifier(e)) {
      return "add-language-block"
    }

    return "add-block"
  }

  return getDefaultKeyBinding(e)
}
