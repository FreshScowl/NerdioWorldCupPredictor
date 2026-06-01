@description('Azure region for App Service resources')
param location string

@description('Resource tags')
param tags object = {}

@description('Cosmos DB database name')
param cosmosDbName string

@description('Key Vault secret URI for Cosmos connection string')
param cosmosSecretUri string

@description('Key Vault secret URI for admin key')
param adminSecretUri string

@description('Key Vault secret URI for API proxy key')
param apiProxySecretUri string

var funcName = 'func-nerdio-worldcup-dev'
var storageAccountName = take('nwcpfunc${uniqueString(resourceGroup().id)}', 24)
var planResourceGroup = 'RG-NERDIO-ULB-01'

resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' existing = {
  name: 'plan-nerdio-gle-dev'
  scope: resourceGroup(planResourceGroup)
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageAccountName
  location: location
  tags: tags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
  }
}

resource functionApp 'Microsoft.Web/sites@2022-09-01' = {
  name: funcName
  location: location
  tags: tags
  kind: 'functionapp,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    keyVaultReferenceIdentity: 'SystemAssigned'
    siteConfig: {
      linuxFxVersion: 'Node|20'
      alwaysOn: true
      appSettings: [
        {
          name: 'AzureWebJobsFeatureFlags'
          value: 'EnableWorkerIndexing'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'false'
        }
        {
          name: 'ENABLE_ORYX_BUILD'
          value: 'false'
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTSHARE'
          value: toLower(funcName)
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'COSMOS_CONNECTION_STRING'
          value: '@Microsoft.KeyVault(SecretUri=${cosmosSecretUri})'
        }
        {
          name: 'COSMOS_DB_NAME'
          value: cosmosDbName
        }
        {
          name: 'ADMIN_KEY'
          value: '@Microsoft.KeyVault(SecretUri=${adminSecretUri})'
        }
        {
          name: 'API_PROXY_KEY'
          value: '@Microsoft.KeyVault(SecretUri=${apiProxySecretUri})'
        }
      ]
    }
  }
}

output defaultHostname string = functionApp.properties.defaultHostName
output functionAppName string = functionApp.name
output apiBaseUrl string = 'https://${functionApp.properties.defaultHostName}'
output principalId string = functionApp.identity.principalId
