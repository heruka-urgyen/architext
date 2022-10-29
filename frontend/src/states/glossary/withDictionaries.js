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
  set: ({get, set}, [dictionary, selected]) => {
    set(glossaryAtom, atom => {
      const {dictionaries} = atom
      const glossary = get(withGlossary)

      if (dictionaries.length === 0) {
        return {
          ...atom,
          dictionaries: glossary.map(x => ({
            ...x,
            selected: x.dictionary === dictionary ? selected : true,
          })),
        }
      }

      return {
        ...atom,
        dictionaries: atom.dictionaries.map(d =>
          d.dictionary === dictionary ? {...d, selected} : d,
        ),
      }
    })
  },
})
