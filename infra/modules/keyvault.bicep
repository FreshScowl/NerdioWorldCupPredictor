@description('Key Vault name (globally unique, 3-24 characters)')
param vaultName string

@description('Azure region for Key Vault')
param location string

@description('Cosmos DB connection string to store as a secret')
@secure()
param cosmosConnectionString string

@description('Admin key for the API results endpoint')
@secure()
param adminKey string

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: vaultName
  location: location
  properties: {
    tenantId: subscription().tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    enableRbacAuthorization: true
    enabledForTemplateDeployment: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 7
  }
}

resource cosmosConnectionSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'CosmosConnectionString'
  properties: {
    value: cosmosConnectionString
  }
}

resource adminKeySecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'AdminKey'
  properties: {
    value: adminKey
  }
}

output vaultName string = keyVault.name
output vaultUri string = keyVault.properties.vaultUri
output cosmosSecretUri string = cosmosConnectionSecret.properties.secretUri
output adminSecretUri string = adminKeySecret.properties.secretUri
