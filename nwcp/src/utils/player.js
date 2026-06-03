const NAME_KEY = 'nerdio-wcp-name'
const SUPPORTED_TEAM_KEY = 'nerdio-wcp-supported-team'
const PLAYER_ID_KEY = 'nerdio-wcp-player-id'

export function normalizeName(name) {
  return name.trim().replace(/\s+/g, ' ')
}

export function isValidName(name) {
  const normalized = normalizeName(name)
  return normalized.length >= 2 && normalized.length <= 80
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

export function clearPlayer() {
  localStorage.removeItem(NAME_KEY)
  localStorage.removeItem(SUPPORTED_TEAM_KEY)
  localStorage.removeItem(PLAYER_ID_KEY)
}
