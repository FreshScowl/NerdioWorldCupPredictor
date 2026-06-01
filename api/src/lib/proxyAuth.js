function assertProxyAuth(request) {
  const expected = process.env.API_PROXY_KEY
  if (!expected) return null

  const provided = request.headers.get('x-api-proxy-key')
  if (provided !== expected) {
    return { status: 403, jsonBody: { error: 'Forbidden' } }
  }

  return null
}

module.exports = { assertProxyAuth }
