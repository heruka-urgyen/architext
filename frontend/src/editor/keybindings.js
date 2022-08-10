import {getDefaultKeyBinding, KeyBindingUtil} from "draft-js"

const {hasCommandModifier} = KeyBindingUtil

const keybindings = e => {
  if (e.keyCode === 13) {
    if (hasCommandModifier(e)) {
      return "add-language-block"
    }

    return "add-block"
  }

  return getDefaultKeyBinding(e)
}

export {keybindings}
