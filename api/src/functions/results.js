const { app } = require('@azure/functions')
const { getResults, upsertResults, verifyAdminKey } = require('../lib/storage')

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
      await upsertResults(body.results || {})
      return { jsonBody: { success: true } }
    } catch (err) {
      return { status: 500, jsonBody: { error: err.message } }
    }
  },
})
