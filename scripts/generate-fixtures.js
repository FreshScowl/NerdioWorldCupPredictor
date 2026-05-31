const fs = require('fs')
const path = require('path')

const MATCHES = {
  A: [
    ['South Africa', 'Mexico'],
    ['Czech Republic', 'Korea Republic'],
    ['South Africa', 'Czech Republic'],
    ['Korea Republic', 'Mexico'],
    ['Korea Republic', 'South Africa'],
    ['Mexico', 'Czech Republic'],
  ],
  B: [
    ['Bosnia and Herzegovina', 'Canada'],
    ['Switzerland', 'Qatar'],
    ['Bosnia and Herzegovina', 'Switzerland'],
    ['Qatar', 'Canada'],
    ['Canada', 'Switzerland'],
    ['Qatar', 'Bosnia and Herzegovina'],
  ],
  C: [
    ['Morocco', 'Brazil'],
    ['Scotland', 'Haiti'],
    ['Morocco', 'Scotland'],
    ['Haiti', 'Brazil'],
    ['Brazil', 'Scotland'],
    ['Haiti', 'Morocco'],
  ],
  D: [
    ['Paraguay', 'USA'],
    ['Turkey', 'Australia'],
    ['Australia', 'USA'],
    ['Paraguay', 'Turkey'],
    ['USA', 'Turkey'],
    ['Australia', 'Paraguay'],
  ],
  E: [
    ['Curaçao', 'Germany'],
    ['Ecuador', 'Ivory Coast'],
    ['Ivory Coast', 'Germany'],
    ['Curaçao', 'Ecuador'],
    ['Germany', 'Ecuador'],
    ['Ivory Coast', 'Curaçao'],
  ],
  F: [
    ['Japan', 'Netherlands'],
    ['Tunisia', 'Sweden'],
    ['Sweden', 'Netherlands'],
    ['Japan', 'Tunisia'],
    ['Netherlands', 'Tunisia'],
    ['Sweden', 'Japan'],
  ],
  G: [
    ['Egypt', 'Belgium'],
    ['New Zealand', 'Iran'],
    ['Iran', 'Belgium'],
    ['Egypt', 'New Zealand'],
    ['Belgium', 'New Zealand'],
    ['Iran', 'Egypt'],
  ],
  H: [
    ['Cabo Verde', 'Spain'],
    ['Uruguay', 'Saudi Arabia'],
    ['Saudi Arabia', 'Spain'],
    ['Cabo Verde', 'Uruguay'],
    ['Spain', 'Uruguay'],
    ['Saudi Arabia', 'Cabo Verde'],
  ],
  I: [
    ['Senegal', 'France'],
    ['Norway', 'Iraq'],
    ['Iraq', 'France'],
    ['Senegal', 'Norway'],
    ['France', 'Norway'],
    ['Iraq', 'Senegal'],
  ],
  J: [
    ['Algeria', 'Argentina'],
    ['Jordan', 'Austria'],
    ['Austria', 'Argentina'],
    ['Algeria', 'Jordan'],
    ['Austria', 'Algeria'],
    ['Argentina', 'Jordan'],
  ],
  K: [
    ['DR Congo', 'Portugal'],
    ['Colombia', 'Uzbekistan'],
    ['Uzbekistan', 'Portugal'],
    ['DR Congo', 'Colombia'],
    ['Portugal', 'Colombia'],
    ['Uzbekistan', 'DR Congo'],
  ],
  L: [
    ['Croatia', 'England'],
    ['Panama', 'Ghana'],
    ['Ghana', 'England'],
    ['Croatia', 'Panama'],
    ['Ghana', 'Croatia'],
    ['England', 'Panama'],
  ],
}

const GROUP_TEAMS = {
  A: 'Mexico, South Africa, Korea Republic, Czech Republic',
  B: 'Canada, Bosnia and Herzegovina, Qatar, Switzerland',
  C: 'Brazil, Morocco, Haiti, Scotland',
  D: 'USA, Paraguay, Australia, Turkey',
  E: 'Germany, Curaçao, Ivory Coast, Ecuador',
  F: 'Netherlands, Japan, Sweden, Tunisia',
  G: 'Belgium, Egypt, Iran, New Zealand',
  H: 'Spain, Cabo Verde, Saudi Arabia, Uruguay',
  I: 'France, Senegal, Iraq, Norway',
  J: 'Argentina, Algeria, Austria, Jordan',
  K: 'Portugal, DR Congo, Uzbekistan, Colombia',
  L: 'England, Croatia, Ghana, Panama',
}

const fixtures = []
for (const [group, pairs] of Object.entries(MATCHES)) {
  pairs.forEach(([home, away], i) => {
    fixtures.push({ id: `${group}-${i + 1}`, group, home, away })
  })
}

function formatFixture(f) {
  return `  { id: '${f.id}', group: '${f.group}', home: '${f.home}', away: '${f.away}' },`
}

let currentGroup = ''
const fixtureLines = fixtures.map((f) => {
  const lines = []
  if (f.group !== currentGroup) {
    currentGroup = f.group
    lines.push('', `  // Group ${currentGroup} — ${GROUP_TEAMS[currentGroup]}`)
  }
  lines.push(formatFixture(f))
  return lines.join('\n')
})

const header = `/**
 * 2026 FIFA World Cup group stage fixtures (official draw, December 2025).
 * 12 groups (A–L), 4 teams each, 6 matches per group = 72 fixtures.
 * Play-off placeholders (Czech Republic, Bosnia and Herzegovina, Turkey, Sweden, Iraq, DR Congo)
 * reflect the published schedule; final teams confirmed in March 2026.
 */`

const frontendBody = `${header}
export const FIXTURES = [
${fixtureLines.join('\n')}
]

export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export const TOTAL_FIXTURES = FIXTURES.length

export function fixturesByGroup() {
  return GROUPS.reduce((acc, group) => {
    acc[group] = FIXTURES.filter((f) => f.group === group)
    return acc
  }, {})
}
`

const apiBody = `${header}
const FIXTURES = [
${fixtureLines.join('\n')}
]

module.exports = { FIXTURES, TOTAL_FIXTURES: FIXTURES.length }
`

fs.writeFileSync(path.join(__dirname, '..', 'frontend', 'src', 'fixtures.js'), frontendBody)
fs.writeFileSync(path.join(__dirname, '..', 'api', 'fixtures.js'), apiBody)
console.log(`Wrote ${fixtures.length} fixtures`)
