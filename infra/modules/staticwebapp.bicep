@description('Static Web App name')
param name string

@description('Static Web Apps region (eastus2 supports Free tier)')
param location string = 'eastus2'

@description('GitHub repository URL')
param repositoryUrl string

@description('GitHub personal access token with repo scope')
@secure()
param repositoryToken string

@description('Cosmos DB database name')
param cosmosDbName string

@description('Key Vault secret URI for CosmosConnectionString')
param cosmosSecretUri string

@description('Key Vault secret URI for AdminKey')
param adminSecretUri string

resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: name
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    repositoryUrl: repositoryUrl
    branch: 'main'
    provider: 'GitHub'
    repositoryToken: repositoryToken
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    buildProperties: {
      appLocation: '/frontend'
      apiLocation: '/api'
      outputLocation: 'dist'
      skipGithubActionWorkflowGeneration: true
    }
  }
}

resource appSettings 'Microsoft.Web/staticSites/config@2023-12-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    COSMOS_CONNECTION_STRING: '@Microsoft.KeyVault(SecretUri=${cosmosSecretUri})'
    COSMOS_DB_NAME: cosmosDbName
    ADMIN_KEY: '@Microsoft.KeyVault(SecretUri=${adminSecretUri})'
  }
}

output defaultHostname string = staticWebApp.properties.defaultHostname
output principalId string = staticWebApp.identity.principalId
output staticWebAppId string = staticWebApp.id
