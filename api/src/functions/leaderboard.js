const { registerHttp } = require('../lib/registerHttp')
const { getAllPredictions, getResults } = require('../lib/storage')
const { calculatePlayerStats } = require('../lib/scoring')
const { resolveSupportedTeam } = require('../lib/teams')

const { internalError } = require('../lib/errors')

registerHttp('leaderboard', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'leaderboard',
  handler: async () => {
    try {
      const [allPredictions, results] = await Promise.all([
        getAllPredictions(),
        getResults(),
      ])

      const players = allPredictions
        .filter((doc) => !doc.retired)
        .map((doc) =>
          calculatePlayerStats(
            doc.email,
            doc.predictions,
            results,
            doc.name,
            resolveSupportedTeam(doc.supportedTeam),
            doc.playerId
          )
        )

      players.sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints
        if (b.exactScores !== a.exactScores) return b.exactScores - a.exactScores
        return b.fixturesPredicted - a.fixturesPredicted
      })

      return { jsonBody: players }
    } catch (err) {
      return internalError(err, 'leaderboard')
    }
  },
})
