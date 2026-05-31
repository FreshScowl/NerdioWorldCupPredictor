const { CosmosClient } = require('@azure/cosmos')

let cosmosClient = null
let predictionsContainer = null
let resultsContainer = null

function getConfig() {
  const connectionString = process.env.COSMOS_CONNECTION_STRING
  const databaseId = process.env.COSMOS_DB_NAME

  if (!connectionString || !databaseId) {
    throw new Error('COSMOS_CONNECTION_STRING and COSMOS_DB_NAME must be configured')
  }

  return { connectionString, databaseId }
}

async function initCosmos() {
  if (predictionsContainer && resultsContainer) return

  const { connectionString, databaseId } = getConfig()
  cosmosClient = new CosmosClient(connectionString)
  const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseId })

  const { container: predictions } = await database.containers.createIfNotExists({
    id: 'predictions',
    partitionKey: { paths: ['/email'] },
  })
  const { container: results } = await database.containers.createIfNotExists({
    id: 'results',
    partitionKey: { paths: ['/id'] },
  })

  predictionsContainer = predictions
  resultsContainer = results
}

async function getPredictionsDocument(email) {
  await initCosmos()

  try {
    const { resource } = await predictionsContainer.item(email, email).read()
    return resource
  } catch (err) {
    if (err.code === 404) return null
    throw err
  }
}

async function createPlayer(email, name, supportedTeam = null) {
  await initCosmos()

  const existing = await getPredictionsDocument(email)
  if (existing) {
    const err = new Error('An account with this email already exists.')
    err.code = 409
    throw err
  }

  const doc = {
    id: email,
    email,
    name,
    supportedTeam,
    predictions: {},
    createdAt: new Date().toISOString(),
  }

  await predictionsContainer.items.create(doc)
  return doc
}

async function upsertPredictions(email, predictions) {
  await initCosmos()

  const existing = await getPredictionsDocument(email)
  if (!existing) {
    const err = new Error('No account found for this email. Sign up first.')
    err.code = 404
    throw err
  }

  if (existing.retired) {
    const err = new Error('This account has been retired.')
    err.code = 403
    throw err
  }

  const doc = {
    ...existing,
    id: email,
    email,
    predictions,
  }

  await predictionsContainer.items.upsert(doc)
  return doc
}

async function retirePlayer(email) {
  await initCosmos()

  const existing = await getPredictionsDocument(email)
  if (!existing) {
    const err = new Error('Account not found.')
    err.code = 404
    throw err
  }

  if (existing.retired) {
    const err = new Error('Account is already retired.')
    err.code = 400
    throw err
  }

  const doc = {
    ...existing,
    retired: true,
    retiredAt: new Date().toISOString(),
  }

  await predictionsContainer.items.upsert(doc)
  return doc
}

async function deletePlayer(email) {
  await initCosmos()

  try {
    await predictionsContainer.item(email, email).delete()
    return { email, deleted: true }
  } catch (err) {
    if (err.code === 404) {
      const notFound = new Error('Account not found.')
      notFound.code = 404
      throw notFound
    }
    throw err
  }
}

async function getAllPredictions() {
  await initCosmos()
  const { resources } = await predictionsContainer.items.readAll().fetchAll()
  return resources
}

async function getResults() {
  await initCosmos()

  try {
    const { resource } = await resultsContainer.item('group-stage', 'group-stage').read()
    return resource?.results || {}
  } catch (err) {
    if (err.code === 404) return {}
    throw err
  }
}

async function upsertResults(results) {
  await initCosmos()
  const doc = { id: 'group-stage', results }
  await resultsContainer.items.upsert(doc)
  return doc
}

function verifyAdminKey(request) {
  const expected = process.env.ADMIN_KEY
  if (!expected) return false
  const provided = request.headers.get('x-admin-key')
  return provided === expected
}

module.exports = {
  getPredictionsDocument,
  createPlayer,
  upsertPredictions,
  retirePlayer,
  deletePlayer,
  getAllPredictions,
  getResults,
  upsertResults,
  verifyAdminKey,
}
