const ALLOWED_DOMAIN = 'getnerdio.com'

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

module.exports = {
  ALLOWED_DOMAIN,
  normalizeEmail,
  isAllowedEmail,
  normalizeName,
  isValidName,
  normalizeResults,
}
