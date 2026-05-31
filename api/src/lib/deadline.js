/** Predictions lock at 00:00 UK time on 11 June 2026 (last day to submit is 10 June). */
const PREDICTIONS_DEADLINE = new Date('2026-06-11T00:00:00+01:00')

function arePredictionsOpen(now = new Date()) {
  return now < PREDICTIONS_DEADLINE
}

function predictionsClosedMessage() {
  return 'Predictions closed on 11 June 2026. Entries were accepted until 10 June.'
}

function assertPredictionsOpen() {
  if (!arePredictionsOpen()) {
    const err = new Error(predictionsClosedMessage())
    err.code = 403
    throw err
  }
}

module.exports = {
  PREDICTIONS_DEADLINE,
  arePredictionsOpen,
  predictionsClosedMessage,
  assertPredictionsOpen,
}
