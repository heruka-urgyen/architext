import {selector} from "recoil"

import glossaryAtom from "./atom"
import withGlossary from "./withGlossary"

export default selector({
  key: "withDictionaries",
  get: ({get}) => {
    const {dictionaries} = get(glossaryAtom)
    const glossary = get(withGlossary)

    if (dictionaries.length === 0) {
      return glossary.map(({dictionary}) => ({
        dictionary,
        selected: true,
      }))
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
