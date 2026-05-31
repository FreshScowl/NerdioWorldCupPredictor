const { app } = require('@azure/functions')
const { createPlayer } = require('../lib/storage')
const { isValidSupportedTeam, normalizeSupportedTeam } = require('../lib/teams')
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
      const supportedTeam = normalizeSupportedTeam(body.supportedTeam)

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

      if (!isValidSupportedTeam(supportedTeam)) {
        return {
          status: 400,
          jsonBody: { error: 'Choose a valid team or leave it blank.' },
        }
      }

      const doc = await createPlayer(email, name, supportedTeam)
      return { status: 201, jsonBody: doc }
    } catch (err) {
      if (err.code === 409) {
        return { status: 409, jsonBody: { error: err.message } }
      }
      return { status: 500, jsonBody: { error: err.message } }
    }
  },
})
