const { app } = require('@azure/functions')
const {
  deletePlayer,
  getAllPredictions,
  retirePlayer,
  verifyAdminKey,
} = require('../lib/storage')
const { isPredictionComplete } = require('../lib/scoring')
const { normalizeEmail } = require('../lib/validation')

function summarizePlayer(doc) {
  const predictions = doc.predictions || {}
  const fixturesPredicted = Object.values(predictions).filter(isPredictionComplete).length

  return {
    email: doc.email,
    name: doc.name || doc.email.split('@')[0],
    retired: !!doc.retired,
    retiredAt: doc.retiredAt || null,
    createdAt: doc.createdAt || null,
    fixturesPredicted,
  }
}

app.http('adminPlayersList', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'admin/players',
  handler: async (request) => {
    if (!verifyAdminKey(request)) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } }
    }

    try {
      const players = (await getAllPredictions())
        .map(summarizePlayer)
        .sort((a, b) => a.name.localeCompare(b.name))

      return { jsonBody: players }
    } catch (err) {
      return { status: 500, jsonBody: { error: err.message } }
    }
  },
})

app.http('adminPlayerRetire', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'admin/players/{email}/retire',
  handler: async (request) => {
    if (!verifyAdminKey(request)) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } }
    }

    try {
      const email = normalizeEmail(decodeURIComponent(request.params.email || ''))
      if (!email) {
        return { status: 400, jsonBody: { error: 'Email is required' } }
      }

      const doc = await retirePlayer(email)
      return { jsonBody: summarizePlayer(doc) }
    } catch (err) {
      if (err.code === 404) return { status: 404, jsonBody: { error: err.message } }
      if (err.code === 400) return { status: 400, jsonBody: { error: err.message } }
      return { status: 500, jsonBody: { error: err.message } }
    }
  },
})

app.http('adminPlayerDelete', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'admin/players/{email}',
  handler: async (request) => {
    if (!verifyAdminKey(request)) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } }
    }

    try {
      const email = normalizeEmail(decodeURIComponent(request.params.email || ''))
      if (!email) {
        return { status: 400, jsonBody: { error: 'Email is required' } }
      }

      const result = await deletePlayer(email)
      return { jsonBody: result }
    } catch (err) {
      if (err.code === 404) return { status: 404, jsonBody: { error: err.message } }
      return { status: 500, jsonBody: { error: err.message } }
    }
  },
})
