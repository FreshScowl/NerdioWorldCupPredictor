const { app } = require('@azure/functions')
const { FIXTURES } = require('../../fixtures')

app.http('fixtures', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'fixtures',
  handler: async () => {
    return { jsonBody: FIXTURES }
  },
})
