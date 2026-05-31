import { FIXTURES } from '../fixtures'
import { teamFlag } from './flags'

export const WORLD_CUP_TEAMS = [
  ...new Set(FIXTURES.flatMap((fixture) => [fixture.home, fixture.away])),
].sort((a, b) => a.localeCompare(b))

export function formatTeamOption(team) {
  return `${teamFlag(team)} ${team}`
}
