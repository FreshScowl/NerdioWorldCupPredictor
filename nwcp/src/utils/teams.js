import { FIXTURES, GROUPS } from '../fixtures'
import { teamFlag } from './flags'

export const WORLD_CUP_TEAMS = [
  ...new Set(FIXTURES.flatMap((fixture) => [fixture.home, fixture.away])),
].sort((a, b) => a.localeCompare(b))

export function getTeamsByGroup() {
  return GROUPS.reduce((acc, group) => {
    const teams = new Set()
    FIXTURES.filter((fixture) => fixture.group === group).forEach((fixture) => {
      teams.add(fixture.home)
      teams.add(fixture.away)
    })
    acc[group] = [...teams].sort((a, b) => a.localeCompare(b))
    return acc
  }, {})
}

export function formatTeamOption(team) {
  return team
}
