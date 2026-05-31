const { app } = require('@azure/functions')
const { getPredictionsDocument, getResults } = require('../lib/storage')

app.http('predictionsGet', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'predictions/{email}',
  handler: async (request) => {
    try {
      const email = decodeURIComponent(request.params.email || '')
        .toLowerCase()
        .trim()

      if (!email) {
        return { status: 400, jsonBody: { error: 'Email is required' } }
      }

      const [doc, results] = await Promise.all([
        getPredictionsDocument(email),
        getResults(),
      ])

      if (!doc) {
        return {
          jsonBody: {
            id: email,
            email,
            predictions: {},
            results,
          },
        }
      }

      return { jsonBody: { ...doc, results } }
    } catch (err) {
      return { status: 500, jsonBody: { error: err.message } }
    }
  },
})
