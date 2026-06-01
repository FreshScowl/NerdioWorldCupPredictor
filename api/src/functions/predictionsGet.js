const { registerHttp } = require('../lib/registerHttp')
const { getPredictionsDocument, getResults } = require('../lib/storage')
const { normalizeEmail } = require('../lib/validation')
const { internalError } = require('../lib/errors')

registerHttp('predictionsGet', {
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
      return internalError(err, 'predictionsGet')
    }
  },
})
