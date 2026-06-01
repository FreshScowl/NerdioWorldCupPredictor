const { registerHttp } = require('../lib/registerHttp')
const { verifyAdminKey } = require('../lib/storage')

registerHttp('adminVerify', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'manage/verify',
  handler: async (request) => {
    if (!verifyAdminKey(request)) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } }
    }

    return { jsonBody: { ok: true } }
  },
})
