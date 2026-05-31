const { FIXTURES } = require('../../fixtures')

const WORLD_CUP_TEAMS = [
  ...new Set(FIXTURES.flatMap((fixture) => [fixture.home, fixture.away])),
].sort((a, b) => a.localeCompare(b))

const TEAM_SET = new Set(WORLD_CUP_TEAMS)

function normalizeSupportedTeam(team) {
  if (team == null || team === '') return null
  return String(team).trim()
}

function isValidSupportedTeam(team) {
  const normalized = normalizeSupportedTeam(team)
  if (normalized === null) return true
  return TEAM_SET.has(normalized)
}

module.exports = {
  WORLD_CUP_TEAMS,
  normalizeSupportedTeam,
  isValidSupportedTeam,
}
