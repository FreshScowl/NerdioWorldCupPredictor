const { FIXTURES } = require('../../fixtures')

function getOutcome(home, away) {
  if (home > away) return 'home'
  if (home < away) return 'away'
  return 'draw'
}

function hasScore(value) {
  return value && value.home !== '' && value.away !== '' && value.home != null && value.away != null
}

function scorePrediction(predicted, actual) {
  if (!hasScore(actual)) return null

  const aHome = Number(actual.home)
  const aAway = Number(actual.away)
  if (Number.isNaN(aHome) || Number.isNaN(aAway)) return null

  const { home: pHome, away: pAway } = predicted

  if (pHome === aHome && pAway === aAway) return 3
  if (getOutcome(pHome, pAway) === getOutcome(aHome, aAway)) return 1
  return 0
}

function isPredictionComplete(prediction) {
  return (
    prediction &&
    prediction.home != null &&
    prediction.away != null &&
    prediction.home !== '' &&
    prediction.away !== ''
  )
}

function calculatePlayerStats(predictions, results, name, supportedTeam, playerId = null) {
  let totalPoints = 0
  let exactScores = 0
  let correctResults = 0
  let wrong = 0
  let fixturesPredicted = 0

  for (const fixture of FIXTURES) {
    const prediction = predictions?.[fixture.id]
    if (!isPredictionComplete(prediction)) continue

    fixturesPredicted++
    const actual = results?.[fixture.id]
    const points = scorePrediction(
      { home: Number(prediction.home), away: Number(prediction.away) },
      actual || null
    )

    if (points === null) continue

    totalPoints += points
    if (points === 3) exactScores++
    else if (points === 1) correctResults++
    else wrong++
  }

  return {
    playerId: playerId || null,
    name: name || 'Player',
    supportedTeam: supportedTeam || null,
    totalPoints,
    exactScores,
    correctResults,
    wrong,
    fixturesPredicted,
  }
}

module.exports = {
  getOutcome,
  scorePrediction,
  isPredictionComplete,
  calculatePlayerStats,
}
