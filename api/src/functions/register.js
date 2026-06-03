const { registerHttp } = require('../lib/registerHttp')
const { createPlayer } = require('../lib/storage')
const { isValidSupportedTeam, normalizeSupportedTeam } = require('../lib/teams')
const { isValidName, normalizeName } = require('../lib/validation')
const { internalError } = require('../lib/errors')

registerHttp('register', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'register',
  handler: async (request) => {
    try {
      const body = await request.json()
      const name = normalizeName(body.name)
      const supportedTeam = normalizeSupportedTeam(body.supportedTeam)

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

      const doc = await createPlayer(name, supportedTeam)
      return { status: 201, jsonBody: doc }
    } catch (err) {
      return internalError(err, 'register')
    }
  },
})
