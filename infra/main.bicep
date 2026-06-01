targetScope = 'resourceGroup'

@description('Application name prefix for resources')
param appName string

@description('Azure region for App Service and Function App resources')
param location string = resourceGroup().location

@description('Admin key for POST /api/results — pass at deploy time, not stored in git')
@secure()
param adminKey string

@description('Azure Functions base URL for App Service /api proxy (optional override)')
param apiBaseUrl string = ''

@description('Resource group containing the existing Cosmos DB account')
param cosmosResourceGroup string = 'RG-NERDIOWCP'

@description('Existing Cosmos DB account name')
param cosmosAccountName string = 'nerdioworldcupdevcosmos'

var appServiceResourceGroup = 'RG-NERDIO-ULB-01'
var cosmosDbName = 'worldcup-predictor'
var keyVaultName = 'kvnerdiowcpdev'

var tags = {
  Application: appName
  Environment: 'dev'
}

var apiProxyKey = uniqueString(subscription().subscriptionId, resourceGroup().id, appName, 'nwcp-api-proxy-v2')

resource existingCosmos 'Microsoft.DocumentDB/databaseAccounts@2023-11-15' existing = {
  name: cosmosAccountName
  scope: resourceGroup(cosmosResourceGroup)
}

var cosmosConnectionString = existingCosmos.listConnectionStrings().connectionStrings[0].connectionString

module keyVault 'modules/keyvault.bicep' = {
  name: 'keyVaultDeploy'
  scope: resourceGroup(cosmosResourceGroup)
  params: {
    vaultName: keyVaultName
    location: location
    cosmosConnectionString: cosmosConnectionString
    adminKey: adminKey
    apiProxyKey: apiProxyKey
  }
}

module functionApp 'modules/functionapp.bicep' = {
  name: 'functionAppDeploy'
  scope: resourceGroup(appServiceResourceGroup)
  params: {
    location: location
    tags: tags
    cosmosDbName: cosmosDbName
    cosmosSecretUri: keyVault.outputs.cosmosSecretUri
    adminSecretUri: keyVault.outputs.adminSecretUri
    apiProxySecretUri: keyVault.outputs.apiProxySecretUri
  }
}

module appService 'modules/appservice.bicep' = {
  name: 'appServiceDeploy'
  scope: resourceGroup(appServiceResourceGroup)
  params: {
    location: location
    tags: tags
    apiBaseUrl: empty(apiBaseUrl) ? functionApp.outputs.apiBaseUrl : apiBaseUrl
    apiProxySecretUri: keyVault.outputs.apiProxySecretUri
  }
}

module functionKeyVaultAccess 'modules/keyvault-access.bicep' = {
  name: 'functionKeyVaultAccess'
  scope: resourceGroup(cosmosResourceGroup)
  params: {
    vaultName: keyVault.outputs.vaultName
    principalId: functionApp.outputs.principalId
  }
}

module appKeyVaultAccess 'modules/keyvault-access.bicep' = {
  name: 'appKeyVaultAccess'
  scope: resourceGroup(cosmosResourceGroup)
  params: {
    vaultName: keyVault.outputs.vaultName
    principalId: appService.outputs.principalId
  }
}

output appServiceHostname string = appService.outputs.defaultHostname
output appServiceName string = appService.outputs.appServiceName
output functionAppHostname string = functionApp.outputs.defaultHostname
output functionAppName string = functionApp.outputs.functionAppName
output apiBaseUrl string = functionApp.outputs.apiBaseUrl
output keyVaultName string = keyVault.outputs.vaultName
output cosmosDbEndpoint string = existingCosmos.properties.documentEndpoint
