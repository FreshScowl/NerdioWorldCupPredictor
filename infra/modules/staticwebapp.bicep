@description('Static Web App name')
param name string

@description('Resource tags')
param tags object = {}

@description('Cosmos DB database name')
param cosmosDbName string

@description('Cosmos DB connection string')
@secure()
param cosmosConnectionString string

@description('Admin key for POST /api/results')
@secure()
param adminKey string

// Static Web Apps Free tier is only available in eastus2
var staticWebAppLocation = 'eastus2'

resource staticWebApp 'Microsoft.Web/staticSites@2022-03-01' = {
  name: name
  location: staticWebAppLocation
  tags: tags
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {}
}

resource appSettings 'Microsoft.Web/staticSites/config@2022-03-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    COSMOS_CONNECTION_STRING: cosmosConnectionString
    COSMOS_DB_NAME: cosmosDbName
    ADMIN_KEY: adminKey
  }
}

output defaultHostname string = staticWebApp.properties.defaultHostname
