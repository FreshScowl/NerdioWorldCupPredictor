#!/usr/bin/env bash
set -euo pipefail

# Deploy Nerdio World Cup Predictor infrastructure to Azure.
#
# Prerequisites:
#   - Azure CLI installed (https://learn.microsoft.com/cli/azure/install-azure-cli)
#   - Bicep CLI (included with Azure CLI 2.20+)
#
# Before running:
#   1. Edit infra/params/dev.bicepparam — set repositoryUrl, repositoryToken, and adminKey
#   2. Set RESOURCE_GROUP below to your desired resource group name

RESOURCE_GROUP="nerdio-worldcup-dev-rg"
LOCATION="uksouth"

echo "==> Signing in to Azure (opens browser if needed)"
az login

echo "==> Creating resource group: ${RESOURCE_GROUP} in ${LOCATION}"
az group create \
  --name "${RESOURCE_GROUP}" \
  --location "${LOCATION}"

echo "==> Deploying Bicep template"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
az deployment group create \
  --resource-group "${RESOURCE_GROUP}" \
  --template-file "${SCRIPT_DIR}/main.bicep" \
  --parameters "${SCRIPT_DIR}/params/dev.bicepparam"

echo "==> Deployment complete"
echo "    View outputs: az deployment group show -g ${RESOURCE_GROUP} -n main --query properties.outputs"
