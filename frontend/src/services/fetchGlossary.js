import {glossaryEndpoint} from "./endpoints"

export const fetchGlossary = text => (
  fetch(glossaryEndpoint, {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(text),
  })
    .then(x => x.json())
    .then(({glossary}) => glossary)
)
