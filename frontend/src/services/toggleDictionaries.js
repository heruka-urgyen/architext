import {dictionarySelectorEndpoint} from "./endpoints"

export const selectDictionaries = args =>
  fetch(`${dictionarySelectorEndpoint}`, {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(args),
  }).then(x => x.json())
