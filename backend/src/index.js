import Fastify from "fastify"
import cors from "@fastify/cors"
import http from "http"
import fs from "fs"

const fastify = Fastify({
  logger: true
})

await fastify.register(cors, {
  origin: "http://localhost:1234",
  methods: ["GET", "POST"]
})

const botokServiceOptions = {
  hostname: "127.0.0.1",
  port: 8000,
}

const sendBotokServiceRequest = (requestOptions, data) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
      ...botokServiceOptions,
      ...requestOptions,
    }

    const botokServiceRequest = http.request(options, res => {
      let response = ""
      res.on("data", chunk => {
        response += chunk
      })

      res.on("end", () => {
        resolve(JSON.parse(response))
      })
    })

    botokServiceRequest.on("error", e => {
      reject(`problem with request: ${e.message}`)
    })

    botokServiceRequest.write(data)
    botokServiceRequest.end()
  })
}

let dictionaryStore = new Map()

const initializeDictionaryStore = async () => {
  const dir = await fs.promises.readdir("../dictionary/")

  await Promise.all(dir.map(async filename => {
    const raw = await fs.promises.readFile(`../dictionary/${filename}`, {encoding: "utf8"})
    const content = raw.split("\n").reduce((acc, line) => {
      const [term, ...definitions] = line.split("|")
      const existingDefinitions = acc.get(term) || []

      acc.set(term, existingDefinitions.concat(definitions))

      return acc
    }, new Map())

    return dictionaryStore.set(
      filename, {
        filename,
        content,
        enabled: true,
      },
    )
  }))
}

function splitDefinition(definition, dictionaryName) {
  const defTokens = /[a-zA-Z]/

  return definition
    .replaceAll(/(\d\.)/g, (_, x) => ` ${x} `)
    .replaceAll(/\.\s\.\s\./g, '...')
    .replaceAll(/\(/g, ' (')
    .replaceAll(/\]/g, '] ')
    .replaceAll(/\,/g, ', ')
    .replaceAll(/\=/g, '= ')
    .replaceAll(/\//g, '/ ')
    .split(/\s/)
    .map(word => {
      return word
        .replaceAll(/\/\s?/g, " / ")
        .replaceAll(/\./g, " . ")
        .replaceAll(/\,/g, " , ")
        .replaceAll(/\;/g, " ; ")
        .replaceAll(/\[/g, " [ ")
        .replaceAll(/\]/g, " ] ")
        .replaceAll(/\(/g, " ( ")
        .replaceAll(/\)/g, " ) ")
        .replaceAll(/\{/g, " { ")
        .replaceAll(/\}/g, " } ")
        .replaceAll(/</g, " < ")
        .replaceAll(/>/g, " > ")
        .split(/\s/)
        .filter(x => x !== "")
        .map(token => {
          if (defTokens.test(token)) {
            return {token, type: "definition"}
          }

          return {token, type: "none"}
        })
    })
}

function getDefinitions(dictionary, terms) {
  return terms.reduce((acc, term) => {
    const definitions = dictionary.content.get(term)

    if (definitions != null) {
      acc.push([term, definitions.map(definition => splitDefinition(definition, dictionary.filename))])
    }

    return acc
  }, [])
}

function findInSelectedDictionaries(terms) {
  const result = []

  for (let d of dictionaryStore.values()) {
    if (d.enabled) {
      result.push({
        dictionary: d.filename,
        definitions: getDefinitions(d, terms),
      })
    }
  }

  return result
}

fastify.route({
  method: "POST",
  url: "/api/glossary",
  schema: {
    body: {
      text: {type: "string"},
    },
    response: {
      200: {
        type: "object",
        properties: {
          glossary: { type: "array" }
        }
      }
    }
  },
  handler: async (request, reply) => {
    const options = {
      path: "/api/wylie_word_list",
      method: "POST",
    }

    const {wylieWordList} = await sendBotokServiceRequest(options, JSON.stringify(request.body))
    const wwl = new Set(wylieWordList)
    const result = findInSelectedDictionaries([...wwl.values()])

    reply.send({glossary: result})
  }
})

fastify.route({
  method: "GET",
  url: "/api/dictionaries",
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          dictionaries: {type: "object"},
        }
      }
    }
  },
  handler: async (request, reply) => {
    let res = []
    for (let d of dictionaryStore.values()) {
      res.push({name: d.filename, selected: d.enabled})
    }

    reply.send(JSON.stringify({dictionaries: res}))
  }
})

fastify.route({
  method: "POST",
  url: "/api/toggle_dictionaries",
  schema: {
    body: {
      name: {type: "string"},
      enabled: {type: "boolean"},
    },
    response: {
      200: {
        type: "object",
        properties: {
          name: {type: "string"},
          enabled: {type: "boolean"},
        }
      }
    }
  },
  handler: async (request, reply) => {
    const {name, selected} = request.body

    dictionaryStore = dictionaryStore.set(name, {...dictionaryStore.get(name), enabled: selected})

    let res = []
    for (let d of dictionaryStore.values()) {
      res.push({name: d.filename, selected: d.enabled})
    }

    reply.send(JSON.stringify({dictionaries: res}))
  }
})

fastify.route({
  method: "GET",
  url: "/api/term/:term",
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          term: {type: "string"},
          results: {type: "array"},
        }
      }
    }
  },
  handler: async (request, reply) => {
    const {params: {term}} = request
    const results = findInSelectedDictionaries([term])

    reply.send({
      term,
      results,
    })
  }
})

fastify.listen({ port: 3000 }, async (err) => {
  await initializeDictionaryStore()

  if (err) {
    throw err
  }
})
