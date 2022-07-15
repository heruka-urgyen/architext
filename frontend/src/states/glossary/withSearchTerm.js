import {selectorFamily} from "recoil"

import {fetchTerm} from "../../services/fetchTerm"

export default selectorFamily({
  key: "withSearchTerm",
  get: term => async () => {
    if (term != null) {
      return fetchTerm(term)
    }

    return {term: "", definitions: []}
  },
})
