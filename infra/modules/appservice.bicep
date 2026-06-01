@description('Azure region for App Service resources')
param location string

@description('Resource tags')
param tags object = {}

@description('Azure Functions base URL for /api proxy (no trailing slash)')
param apiBaseUrl string = ''

@description('Key Vault secret URI for API proxy key')
param apiProxySecretUri string

var appName = 'nerdio-worldcup'
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
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    keyVaultReferenceIdentity: 'SystemAssigned'
    siteConfig: {
      linuxFxVersion: 'NODE|22-lts'
      appCommandLine: 'node server.js'
      alwaysOn: true
      appSettings: [
        {
          name: 'API_BASE_URL'
          value: apiBaseUrl
        }
        {
          name: 'API_PROXY_KEY'
          value: '@Microsoft.KeyVault(SecretUri=${apiProxySecretUri})'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~22'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'false'
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
      ]
    }
  }
}

output defaultHostname string = appService.properties.defaultHostName
output appServiceName string = appService.name
output principalId string = appService.identity.principalId
