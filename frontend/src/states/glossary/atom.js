import {atom} from "recoil"

export default atom({
  key: "glossaryAtom",
  default: {
    lineUnderCursor: "",
    glossary: [],
  },
});
