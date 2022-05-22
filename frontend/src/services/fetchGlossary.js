import {glossaryEndpoint} from "./endpoints"

export const fetchGlossary = (text, setState) => {
  fetch(glossaryEndpoint, {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(text)
  })
  .then(x => x.json())
  .then((res) => {
    const {glossary} = res

    setState(s => ({...s, glossary}))
  })
}

