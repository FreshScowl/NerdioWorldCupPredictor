using '../main.bicep'

param appName = 'nerdio-worldcup-dev'
param location = 'eastus'
param adminKey = readEnvironmentVariable('NWCP_ADMIN_KEY')
