const { app } = require('@azure/functions')
const { upsertPredictions } = require('../lib/storage')
const { isAllowedEmail, normalizeEmail } = require('../lib/validation')

app.http('predictionsPost', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'predictions',
  handler: async (request) => {
    try {
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

      const doc = await upsertPredictions(email, body.predictions || {})
      return { jsonBody: doc }
    } catch (err) {
      if (err.code === 404) {
        return { status: 404, jsonBody: { error: err.message } }
      }
      return { status: 500, jsonBody: { error: err.message } }
    }
  },
})
