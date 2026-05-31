targetScope = 'resourceGroup'

@description('Application name prefix for resources')
param appName string

@description('Azure region for regional resources (Cosmos DB, Key Vault)')
param location string = resourceGroup().location

@description('Admin key for POST /api/results')
@secure()
param adminKey string

var cosmosAccountName = toLower(replace('${appName}-cosmos', '-', ''))
var keyVaultName = take('${replace(appName, '-', '')}kv${uniqueString(resourceGroup().id)}', 24)

var tags = {
  Application: appName
  Environment: 'dev'
}

module cosmos 'modules/cosmos.bicep' = {
  name: 'cosmosDeploy'
  params: {
    accountName: cosmosAccountName
    location: location
  }
}

module keyVault 'modules/keyvault.bicep' = {
  name: 'keyVaultDeploy'
  params: {
    vaultName: keyVaultName
    location: location
    cosmosConnectionString: cosmos.outputs.connectionString
    adminKey: adminKey
  }
}

module staticWebApp 'modules/staticwebapp.bicep' = {
  name: 'staticWebAppDeploy'
  params: {
    tags: tags
    cosmosDbName: cosmos.outputs.databaseName
    cosmosConnectionString: cosmos.outputs.connectionString
    adminKey: adminKey
  }
}

output staticWebAppHostname string = staticWebApp.outputs.defaultHostname
output cosmosDbEndpoint string = cosmos.outputs.endpoint
output keyVaultName string = keyVault.outputs.vaultName
