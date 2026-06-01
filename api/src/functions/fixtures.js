const { registerHttp } = require('../lib/registerHttp')
const { FIXTURES } = require('../../fixtures')

registerHttp('fixtures', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'fixtures',
  handler: async () => {
    return { jsonBody: FIXTURES }
  },
})
