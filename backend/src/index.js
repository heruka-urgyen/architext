import Fastify from "fastify"

const fastify = Fastify({
  logger: true
})

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    throw err
  }
})
