targetScope = 'resourceGroup'

@description('Application name prefix for resources')
param appName string

@description('Azure region for regional resources (Cosmos DB, Key Vault)')
param location string = resourceGroup().location

@description('GitHub repository URL (https://github.com/ORG/REPO)')
param repositoryUrl string

@description('GitHub personal access token with repo scope')
@secure()
param repositoryToken string

@description('Admin key for POST /api/results')
@secure()
param adminKey string

var cosmosAccountName = toLower(replace('${appName}-cosmos', '-', ''))
var keyVaultName = take('${replace(appName, '-', '')}kv${uniqueString(resourceGroup().id)}', 24)
var staticWebAppLocation = 'eastus2'

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
    name: appName
    location: staticWebAppLocation
    repositoryUrl: repositoryUrl
    repositoryToken: repositoryToken
    cosmosDbName: cosmos.outputs.databaseName
    cosmosSecretUri: keyVault.outputs.cosmosSecretUri
    adminSecretUri: keyVault.outputs.adminSecretUri
  }
}

module keyVaultAccess 'modules/keyvault-access.bicep' = {
  name: 'keyVaultAccessDeploy'
  params: {
    vaultName: keyVault.outputs.vaultName
    principalId: staticWebApp.outputs.principalId
  }
}

output staticWebAppHostname string = staticWebApp.outputs.defaultHostname
output cosmosDbEndpoint string = cosmos.outputs.endpoint
output keyVaultName string = keyVault.outputs.vaultName
