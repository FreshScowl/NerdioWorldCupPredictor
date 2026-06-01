const { registerHttp } = require('../lib/registerHttp')
const { assertPredictionsOpen } = require('../lib/deadline')
const { upsertPredictions } = require('../lib/storage')
const { isAllowedEmail, normalizeEmail, normalizePredictions } = require('../lib/validation')
const { internalError } = require('../lib/errors')

registerHttp('predictionsPost', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'predictions',
  handler: async (request) => {
    try {
      assertPredictionsOpen()

      const body = await request.json()
      const email = normalizeEmail(body.email)

      if (!email) {
        return { status: 400, jsonBody: { error: 'Email is required' } }
      }

      if (!isAllowedEmail(email)) {
        return {
          status: 400,
          jsonBody: { error: 'Email must be a valid @getnerdio.com address.' },
        }
      }

      const doc = await upsertPredictions(email, normalizePredictions(body.predictions))
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
