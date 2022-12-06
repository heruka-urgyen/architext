import {selector} from "recoil"

import glossaryAtom from "./atom"
import {getDictionaries} from "../../services/getDictionaries"

export default selector({
  key: "withDictionaries",
  get: async ({get}) => {
    const {dictionaries = []} = get(glossaryAtom)

    if (dictionaries.length === 0) {
      const res = await getDictionaries()

      return res.dictionaries
    }

    return dictionaries
  },
  set: ({set}, {dictionaries}) => {
    set(glossaryAtom, atom => ({...atom, dictionaries}))
  },
})
