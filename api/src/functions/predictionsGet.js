const { registerHttp } = require('../lib/registerHttp')
const { getPlayerDocument, getResults } = require('../lib/storage')
const { internalError } = require('../lib/errors')

registerHttp('predictionsGet', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'predictions/{playerId}',
  handler: async (request) => {
    try {
      const playerId = decodeURIComponent(request.params.playerId || '').trim()

      if (!playerId) {
        return { status: 400, jsonBody: { error: 'Player id is required' } }
      }

      const [doc, results] = await Promise.all([
        getPlayerDocument(playerId),
        getResults(),
      ])

      if (!doc) {
        return {
          jsonBody: {
            id: playerId,
            playerId,
            name: null,
            registered: false,
            predictions: {},
            results,
          },
        }
      }

      return {
        jsonBody: {
          ...doc,
          registered: true,
          results,
        },
      }
    } catch (err) {
      return internalError(err, 'predictionsGet')
    }
  },
})
