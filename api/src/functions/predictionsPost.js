const { app } = require('@azure/functions')
const { upsertPredictions } = require('../lib/storage')

app.http('predictionsPost', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'predictions',
  handler: async (request) => {
    try {
      const body = await request.json()
      const email = (body.email || '').toLowerCase().trim()

      if (!email) {
        return { status: 400, jsonBody: { error: 'Email is required' } }
      }

      const doc = await upsertPredictions(email, body.predictions || {})
      return { jsonBody: doc }
    } catch (err) {
      return { status: 500, jsonBody: { error: err.message } }
    }
  },
})
