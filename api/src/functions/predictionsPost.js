const { registerHttp } = require('../lib/registerHttp')
const { assertPredictionsOpen } = require('../lib/deadline')
const { upsertPredictions } = require('../lib/storage')
const { normalizePredictions } = require('../lib/validation')
const { internalError } = require('../lib/errors')

registerHttp('predictionsPost', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'predictions',
  handler: async (request) => {
    try {
      assertPredictionsOpen()

      const body = await request.json()
      const playerId = (body.playerId || '').trim()

      if (!playerId) {
        return { status: 400, jsonBody: { error: 'Player id is required' } }
      }

      const doc = await upsertPredictions(playerId, normalizePredictions(body.predictions))
      return { jsonBody: doc }
    } catch (err) {
      if (err.code === 404) {
        return { status: 404, jsonBody: { error: err.message } }
      }
      if (err.code === 403) {
        return { status: 403, jsonBody: { error: err.message } }
      }
      return internalError(err, 'predictionsPost')
    }
  },
})
