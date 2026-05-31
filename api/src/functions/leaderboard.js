const { app } = require('@azure/functions')
const { getAllPredictions, getResults } = require('../lib/storage')
const { calculatePlayerStats } = require('../lib/scoring')

app.http('leaderboard', {
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
          calculatePlayerStats(doc.email, doc.predictions, results, doc.name)
        )

      players.sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints
        if (b.exactScores !== a.exactScores) return b.exactScores - a.exactScores
        return b.fixturesPredicted - a.fixturesPredicted
      })

      return { jsonBody: players }
    } catch (err) {
      return { status: 500, jsonBody: { error: err.message } }
    }
  },
})
