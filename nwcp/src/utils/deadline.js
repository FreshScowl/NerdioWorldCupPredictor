/** Predictions lock at 00:00 UK time on 11 June 2026 (last day to submit is 10 June). */
export const PREDICTIONS_DEADLINE = new Date('2026-06-11T00:00:00+01:00')

export function arePredictionsOpen(now = new Date()) {
  return now < PREDICTIONS_DEADLINE
}

export function predictionsClosedMessage() {
  return 'Predictions closed on 11 June 2026. Entries were accepted until 10 June.'
}

/** Short label for the submission deadline, shown as a header on the predict/leaderboard pages. */
export function predictionsDeadlineLabel() {
  return 'Predictions lock 11 June 2026 (first kick-off)'
}
