import {termEndpoint} from "./endpoints"

export const fetchTerm = term => (
  fetch(`${termEndpoint}/${term}`, {
    method: "get",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
  })
  .then(x => x.json())
)
