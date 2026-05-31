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

export async function getPredictions(email) {
  const response = await fetch(
    apiUrl(`/api/predictions/${encodeURIComponent(email)}`)
  )
  return parseResponse(response)
}

export async function savePredictions(email, predictions) {
  const response = await fetch(apiUrl('/api/predictions'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, predictions }),
  })
  return parseResponse(response)
}

export async function getLeaderboard() {
  const response = await fetch(apiUrl('/api/leaderboard'))
  return parseResponse(response)
}

export async function registerPlayer(email, name, supportedTeam = null) {
  const response = await fetch(apiUrl('/api/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, supportedTeam }),
  })
  return parseResponse(response)
}

export async function verifyAdmin(adminKey) {
  const response = await fetch(apiUrl('/api/admin/verify'), {
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
  const response = await fetch(apiUrl('/api/admin/players'), {
    headers: adminHeaders(adminKey),
  })
  return parseResponse(response)
}

export async function retireAdminPlayer(adminKey, email) {
  const response = await fetch(
    apiUrl(`/api/admin/players/${encodeURIComponent(email)}/retire`),
    {
      method: 'POST',
      headers: adminHeaders(adminKey),
    }
  )
  return parseResponse(response)
}

export async function deleteAdminPlayer(adminKey, email) {
  const response = await fetch(
    apiUrl(`/api/admin/players/${encodeURIComponent(email)}`),
    {
      method: 'DELETE',
      headers: adminHeaders(adminKey),
    }
  )
  return parseResponse(response)
}
