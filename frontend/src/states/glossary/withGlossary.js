import {selector} from "recoil"

import glossaryAtom from "./atom"

export default selector({
  key: "withGlossary",
  get: ({get}) => get(glossaryAtom).glossary,
  set: ({set}, glossary = []) => {
    set(glossaryAtom, atom => ({...atom, glossary}))
  },
})

