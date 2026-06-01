const EMAIL_KEY = 'nerdio-wcp-email'
const NAME_KEY = 'nerdio-wcp-name'
const SUPPORTED_TEAM_KEY = 'nerdio-wcp-supported-team'
const PLAYER_ID_KEY = 'nerdio-wcp-player-id'
const ALLOWED_DOMAIN = 'getnerdio.com'

export function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

export function normalizeName(name) {
  return name.trim().replace(/\s+/g, ' ')
}

export function isValidEmail(email) {
  const normalized = normalizeEmail(email)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return false
  return normalized.endsWith(`@${ALLOWED_DOMAIN}`)
}

export function isValidName(name) {
  const normalized = normalizeName(name)
  return normalized.length >= 2 && normalized.length <= 80
}

export function getLocalPart(email) {
  return email.split('@')[0]
}

export function loadEmail() {
  const stored = localStorage.getItem(EMAIL_KEY)
  return stored ? normalizeEmail(stored) : null
}

export function saveEmail(email) {
  const normalized = normalizeEmail(email)
  localStorage.setItem(EMAIL_KEY, normalized)
  return normalized
}

export function loadName() {
  return localStorage.getItem(NAME_KEY) || null
}

export function saveName(name) {
  const normalized = normalizeName(name)
  localStorage.setItem(NAME_KEY, normalized)
  return normalized
}

export function loadSupportedTeam() {
  return localStorage.getItem(SUPPORTED_TEAM_KEY) || null
}

export function saveSupportedTeam(supportedTeam) {
  if (!supportedTeam) {
    localStorage.removeItem(SUPPORTED_TEAM_KEY)
    return null
  }

  localStorage.setItem(SUPPORTED_TEAM_KEY, supportedTeam)
  return supportedTeam
}

export function loadPlayerId() {
  return localStorage.getItem(PLAYER_ID_KEY) || null
}

export function savePlayerId(playerId) {
  if (!playerId) {
    localStorage.removeItem(PLAYER_ID_KEY)
    return null
  }

  localStorage.setItem(PLAYER_ID_KEY, playerId)
  return playerId
}

export function clearEmail() {
  localStorage.removeItem(EMAIL_KEY)
  localStorage.removeItem(NAME_KEY)
  localStorage.removeItem(SUPPORTED_TEAM_KEY)
  localStorage.removeItem(PLAYER_ID_KEY)
}
