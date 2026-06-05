export function hasScore(value) {
  return (
    value &&
    value.home !== '' &&
    value.away !== '' &&
    value.home != null &&
    value.away != null
  )
}

export function scorePrediction(predicted, actual) {
  if (!hasScore(actual)) return null

  const pHome = Number(predicted.home)
  const pAway = Number(predicted.away)
  const aHome = Number(actual.home)
  const aAway = Number(actual.away)

  if (Number.isNaN(aHome) || Number.isNaN(aAway)) return null

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
