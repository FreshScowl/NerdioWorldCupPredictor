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

function resolveSupportedTeam(value) {
  const normalized = normalizeSupportedTeam(value)
  if (!normalized) return null
  if (TEAM_SET.has(normalized)) return normalized
  return null
}

module.exports = {
  WORLD_CUP_TEAMS,
  normalizeSupportedTeam,
  isValidSupportedTeam,
  resolveSupportedTeam,
}
