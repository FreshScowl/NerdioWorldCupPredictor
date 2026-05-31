@description('Azure region for App Service resources')
param location string

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

@description('Azure Functions base URL for /api proxy (no trailing slash)')
param apiBaseUrl string = ''

var appName = 'app-nerdio-worldcup-dev'
var planResourceGroup = 'RG-NERDIO-ULB-01'

resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' existing = {
  name: 'plan-nerdio-gle-dev'
  scope: resourceGroup(planResourceGroup)
}

resource appService 'Microsoft.Web/sites@2022-09-01' = {
  name: appName
  location: location
  tags: tags
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|22-lts'
      appCommandLine: 'npm start'
      alwaysOn: true
      appSettings: [
        {
          name: 'COSMOS_CONNECTION_STRING'
          value: cosmosConnectionString
        }
        {
          name: 'COSMOS_DB_NAME'
          value: cosmosDbName
        }
        {
          name: 'ADMIN_KEY'
          value: adminKey
        }
        {
          name: 'API_BASE_URL'
          value: apiBaseUrl
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~22'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'false'
        }
      ]
    }
  }
}

output defaultHostname string = appService.properties.defaultHostName
output appServiceName string = appService.name
