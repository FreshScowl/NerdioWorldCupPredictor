function internalError(err, context = 'Internal error') {
  console.error(context, err)
  return { status: 500, jsonBody: { error: 'Internal server error' } }
}

module.exports = { internalError }
