const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

function apiUrl(path) {
  return `${baseUrl}${path}`
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`)
  }
  return data
}

export async function getPredictions(playerId) {
  const response = await fetch(
    apiUrl(`/api/predictions/${encodeURIComponent(playerId)}`)
  )
  return parseResponse(response)
}

export async function getPredictionsByPlayerId(playerId) {
  const response = await fetch(
    apiUrl(`/api/predictions/player/${encodeURIComponent(playerId)}`)
  )
  return parseResponse(response)
}

export async function savePredictions(playerId, predictions) {
  const response = await fetch(apiUrl('/api/predictions'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId, predictions }),
  })
  return parseResponse(response)
}

export async function getLeaderboard() {
  const response = await fetch(apiUrl('/api/leaderboard'))
  return parseResponse(response)
}

export async function registerPlayer(name, supportedTeam = null) {
  const response = await fetch(apiUrl('/api/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, supportedTeam }),
  })
  return parseResponse(response)
}

export async function verifyAdmin(adminKey) {
  const response = await fetch(apiUrl('/api/manage/verify'), {
    headers: { 'x-admin-key': adminKey },
  })
  return parseResponse(response)
}

export async function getResults() {
  const response = await fetch(apiUrl('/api/results'))
  return parseResponse(response)
}

export async function saveResults(adminKey, results) {
  const response = await fetch(apiUrl('/api/results'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify({ results }),
  })
  return parseResponse(response)
}

function adminHeaders(adminKey) {
  return { 'x-admin-key': adminKey }
}

export async function getAdminPlayers(adminKey) {
  const response = await fetch(apiUrl('/api/manage/players'), {
    headers: adminHeaders(adminKey),
  })
  return parseResponse(response)
}

export async function retireAdminPlayer(adminKey, playerId) {
  const response = await fetch(
    apiUrl(`/api/manage/players/${encodeURIComponent(playerId)}/retire`),
    {
      method: 'POST',
      headers: adminHeaders(adminKey),
    }
  )
  return parseResponse(response)
}

export async function deleteAdminPlayer(adminKey, playerId) {
  const response = await fetch(
    apiUrl(`/api/manage/players/${encodeURIComponent(playerId)}`),
    {
      method: 'DELETE',
      headers: adminHeaders(adminKey),
    }
  )
  return parseResponse(response)
}
