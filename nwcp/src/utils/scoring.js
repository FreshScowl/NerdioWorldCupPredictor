export function scorePrediction(predicted, actual) {
  if (!actual || actual.home == null || actual.away == null) return null

  const pHome = Number(predicted.home)
  const pAway = Number(predicted.away)
  const aHome = Number(actual.home)
  const aAway = Number(actual.away)

  if (pHome === aHome && pAway === aAway) return 3

  const predOutcome =
    pHome > pAway ? 'home' : pHome < pAway ? 'away' : 'draw'
  const actualOutcome =
    aHome > aAway ? 'home' : aHome < aAway ? 'away' : 'draw'

  if (predOutcome === actualOutcome) return 1
  return 0
}

export function isPredictionComplete(prediction) {
  return (
    prediction &&
    prediction.home !== '' &&
    prediction.home != null &&
    prediction.away !== '' &&
    prediction.away != null
  )
}
