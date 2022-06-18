import {selector} from "recoil"

import glossaryAtom from "./atom"
import withLineUnderCursor from "./withLineUnderCursor"
import {fetchGlossary} from "../../services/fetchGlossary"

export default selector({
  key: "withGlossary",
  get: async ({get}) => {
    const {glossary} = get(glossaryAtom)
    const currentLine = get(withLineUnderCursor)

    if (currentLine != "") {
      const res = await fetchGlossary({text: currentLine})
      return res
    }

    return glossary
  },
  // set: ({set}, glossary = []) => {
  //   set(glossaryAtom, atom => ({...atom, glossary}))
  // },
})

