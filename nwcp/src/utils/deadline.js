/** Predictions lock at 00:00 UK time on 13 June 2026 (last day to submit is 12 June). */
export const PREDICTIONS_DEADLINE = new Date('2026-06-13T00:00:00+01:00')

export function arePredictionsOpen(now = new Date()) {
  return now < PREDICTIONS_DEADLINE
}

export function predictionsClosedMessage() {
  return 'Predictions closed on 13 June 2026. Entries were accepted until 12 June.'
}

/** Short label for the submission deadline, shown as a header on the predict/leaderboard pages. */
export function predictionsDeadlineLabel() {
  return 'Last day to submit: 12 June 2026'
}
