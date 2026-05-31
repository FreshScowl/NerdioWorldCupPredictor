targetScope = 'resourceGroup'

@description('Application name prefix for resources')
param appName string

@description('Azure region for App Service and Function App resources')
param location string = resourceGroup().location

@description('Admin key for POST /api/results')
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

var tags = {
  Application: appName
  Environment: 'dev'
}

resource existingCosmos 'Microsoft.DocumentDB/databaseAccounts@2023-11-15' existing = {
  name: cosmosAccountName
  scope: resourceGroup(cosmosResourceGroup)
}

var cosmosConnectionString = existingCosmos.listConnectionStrings().connectionStrings[0].connectionString

module functionApp 'modules/functionapp.bicep' = {
  name: 'functionAppDeploy'
  scope: resourceGroup(appServiceResourceGroup)
  params: {
    location: location
    tags: tags
    cosmosDbName: cosmosDbName
    cosmosConnectionString: cosmosConnectionString
    adminKey: adminKey
  }
}

module appService 'modules/appservice.bicep' = {
  name: 'appServiceDeploy'
  scope: resourceGroup(appServiceResourceGroup)
  params: {
    location: location
    tags: tags
    cosmosDbName: cosmosDbName
    cosmosConnectionString: cosmosConnectionString
    adminKey: adminKey
    apiBaseUrl: empty(apiBaseUrl) ? functionApp.outputs.apiBaseUrl : apiBaseUrl
  }
}

output appServiceHostname string = appService.outputs.defaultHostname
output appServiceName string = appService.outputs.appServiceName
output functionAppHostname string = functionApp.outputs.defaultHostname
output functionAppName string = functionApp.outputs.functionAppName
output apiBaseUrl string = functionApp.outputs.apiBaseUrl
output cosmosDbEndpoint string = existingCosmos.properties.documentEndpoint
