const { app } = require('@azure/functions')
const { getPredictionsDocument, getResults } = require('../lib/storage')
const { normalizeEmail } = require('../lib/validation')

app.http('predictionsGet', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'predictions/{email}',
  handler: async (request) => {
    try {
      const email = normalizeEmail(decodeURIComponent(request.params.email || ''))

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
      return { status: 500, jsonBody: { error: err.message } }
    }
  },
})
