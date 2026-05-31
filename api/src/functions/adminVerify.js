const { app } = require('@azure/functions')
const { verifyAdminKey } = require('../lib/storage')

app.http('adminVerify', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'admin/verify',
  handler: async (request) => {
    if (!verifyAdminKey(request)) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } }
    }

    return { jsonBody: { ok: true } }
  },
})
