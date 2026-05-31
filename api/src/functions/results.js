const { app } = require('@azure/functions')
const { getResults, upsertResults, verifyAdminKey } = require('../lib/storage')
const { normalizeResults } = require('../lib/validation')

app.http('results', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  route: 'results',
  handler: async (request) => {
    try {
      if (request.method === 'GET') {
        const results = await getResults()
        return { jsonBody: { results } }
      }

      if (!verifyAdminKey(request)) {
        return { status: 401, jsonBody: { error: 'Unauthorized' } }
      }

      const body = await request.json()
      const results = normalizeResults(body.results || {})
      await upsertResults(results)
      return { jsonBody: { success: true, results } }
    } catch (err) {
      return { status: 500, jsonBody: { error: err.message } }
    }
  },
})
