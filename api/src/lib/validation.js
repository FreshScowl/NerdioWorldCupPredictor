const ALLOWED_DOMAIN = 'getnerdio.com'
const { FIXTURES } = require('../../fixtures')

const FIXTURE_IDS = new Set(FIXTURES.map((fixture) => fixture.id))

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase()
}

function isAllowedEmail(email) {
  const normalized = normalizeEmail(email)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return false
  return normalized.endsWith(`@${ALLOWED_DOMAIN}`)
}

function normalizeName(name) {
  return (name || '').trim().replace(/\s+/g, ' ')
}

function isValidName(name) {
  const normalized = normalizeName(name)
  return normalized.length >= 2 && normalized.length <= 80
}

function normalizeResults(results) {
  const normalized = {}

  if (!results || typeof results !== 'object') return normalized

  for (const [fixtureId, score] of Object.entries(results)) {
    if (
      !score ||
      score.home === '' ||
      score.home == null ||
      score.away === '' ||
      score.away == null
    ) {
      continue
    }

    const home = Number(score.home)
    const away = Number(score.away)

    if (Number.isNaN(home) || Number.isNaN(away) || home < 0 || away < 0) continue

    normalized[fixtureId] = { home, away }
  }

  return normalized
}

function normalizePredictions(predictions) {
  const normalized = {}

  if (!predictions || typeof predictions !== 'object') return normalized

  for (const [fixtureId, score] of Object.entries(predictions)) {
    if (!FIXTURE_IDS.has(fixtureId)) continue
    if (!score || typeof score !== 'object') continue

    const homeRaw = score.home
    const awayRaw = score.away

    if (homeRaw === '' || homeRaw == null || awayRaw === '' || awayRaw == null) {
      continue
    }

    const home = Number(homeRaw)
    const away = Number(awayRaw)

    if (
      !Number.isInteger(home) ||
      !Number.isInteger(away) ||
      home < 0 ||
      away < 0 ||
      home > 99 ||
      away > 99
    ) {
      continue
    }

    normalized[fixtureId] = { home, away }
  }

  return normalized
}

module.exports = {
  ALLOWED_DOMAIN,
  normalizeEmail,
  isAllowedEmail,
  normalizeName,
  isValidName,
  normalizeResults,
  normalizePredictions,
}
