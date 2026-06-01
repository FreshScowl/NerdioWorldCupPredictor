const { app } = require('@azure/functions')
const { assertProxyAuth } = require('./proxyAuth')

function registerHttp(name, options) {
  const { handler, ...config } = options

  app.http(name, {
    ...config,
    handler: async (request, context) => {
      const denied = assertProxyAuth(request)
      if (denied) return denied
      return handler(request, context)
    },
  })
}

module.exports = { registerHttp }
