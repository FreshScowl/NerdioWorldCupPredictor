const { app } = require('@azure/functions')
const { createPlayer } = require('../lib/storage')
const { isAllowedEmail, isValidName, normalizeEmail, normalizeName } = require('../lib/validation')

app.http('register', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'register',
  handler: async (request) => {
    try {
      const body = await request.json()
      const email = normalizeEmail(body.email)
      const name = normalizeName(body.name)

      if (!isAllowedEmail(email)) {
        return {
          status: 400,
          jsonBody: { error: 'Email must be a valid @getnerdio.com address.' },
        }
      }

      if (!isValidName(name)) {
        return {
          status: 400,
          jsonBody: { error: 'Enter your name (2–80 characters).' },
        }
      }

      const doc = await createPlayer(email, name)
      return { status: 201, jsonBody: doc }
    } catch (err) {
      if (err.code === 409) {
        return { status: 409, jsonBody: { error: err.message } }
      }
      return { status: 500, jsonBody: { error: err.message } }
    }
  },
})
