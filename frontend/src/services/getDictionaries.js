import {dictionaryEndpoint} from "./endpoints"

export const getDictionaries = _ =>
  fetch(`${dictionaryEndpoint}`, {
    method: "get",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
  }).then(x => x.json())
