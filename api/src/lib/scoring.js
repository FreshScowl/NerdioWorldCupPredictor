const { FIXTURES } = require('../../fixtures')

function getOutcome(home, away) {
  if (home > away) return 'home'
  if (home < away) return 'away'
  return 'draw'
}

function scorePrediction(predicted, actual) {
  if (!actual || actual.home == null || actual.away == null) return null

  const { home: pHome, away: pAway } = predicted
  const { home: aHome, away: aAway } = actual

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

function calculatePlayerStats(email, predictions, results, name, supportedTeam) {
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
      actual ? { home: Number(actual.home), away: Number(actual.away) } : null
    )

    if (points === null) continue

    totalPoints += points
    if (points === 3) exactScores++
    else if (points === 1) correctResults++
    else wrong++
  }

  return {
    email,
    name: name || email.split('@')[0],
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
