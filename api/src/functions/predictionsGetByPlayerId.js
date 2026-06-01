const { registerHttp } = require('../lib/registerHttp')
const { getPredictionsByPlayerId, getResults } = require('../lib/storage')
const { internalError } = require('../lib/errors')

registerHttp('predictionsGetByPlayerId', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'predictions/player/{playerId}',
  handler: async (request) => {
    try {
      const playerId = (request.params.playerId || '').trim()

      if (!playerId) {
        return { status: 400, jsonBody: { error: 'Player id is required' } }
      }

      const [doc, results] = await Promise.all([
        getPredictionsByPlayerId(playerId),
        getResults(),
      ])

      if (!doc || doc.retired) {
        return { status: 404, jsonBody: { error: 'Player not found' } }
      }

      return {
        jsonBody: {
          playerId: doc.playerId,
          name: doc.name,
          supportedTeam: doc.supportedTeam || null,
          predictions: doc.predictions || {},
          results,
        },
      }
    } catch (err) {
      return internalError(err, 'predictionsGetByPlayerId')
    }
  },
})
