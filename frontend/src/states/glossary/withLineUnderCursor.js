import {selector} from "recoil"

import glossaryAtom from "./atom"

const getLineUnderCursor = ({get}) => get(glossaryAtom).lineUnderCursor

export default selector({
  key: "withLineUnderCursor",
  get: getLineUnderCursor,
  set: ({get, set}, newLineUnderCursor = "") => {
    if (getLineUnderCursor({get}) !== newLineUnderCursor) {
      set(glossaryAtom, atom => ({...atom, lineUnderCursor: newLineUnderCursor}))
    }
  },
})

