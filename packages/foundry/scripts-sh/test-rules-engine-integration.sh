#!/bin/bash

# Script to verify that GemToken and GemNFT have the correct rules engine address set

# The expected rules engine address
EXPECTED_RULES_ENGINE="0x4E448907B4B8d5949D4A6C67f34419dBb29690bD"

# Navigate to the project root
cd "$(dirname "$0")/../.."

# Load the deployment addresses
DEPLOYMENTS_FILE="packages/foundry/deployments/84532.json"

if [ ! -f "$DEPLOYMENTS_FILE" ]; then
  echo "Error: Deployment file not found at $DEPLOYMENTS_FILE"
  echo "Please deploy the contracts to Base Sepolia first."
  exit 1
fi

# Extract contract addresses
GEM_TOKEN_ADDR=$(grep -o '"GEMToken":"[^"]*"' "$DEPLOYMENTS_FILE" | cut -d'"' -f4)
GEM_NFT_ADDR=$(grep -o '"GemNFT":"[^"]*"' "$DEPLOYMENTS_FILE" | cut -d'"' -f4)

if [ -z "$GEM_TOKEN_ADDR" ] || [ -z "$GEM_NFT_ADDR" ]; then
  echo "Error: Could not find deployed contract addresses in $DEPLOYMENTS_FILE"
  exit 1
fi

echo "Found deployed contracts:"
echo "- GEMToken: $GEM_TOKEN_ADDR"
echo "- GemNFT: $GEM_NFT_ADDR"
echo ""

# Check GEMToken's rules engine address
echo "Checking GEMToken's rules engine address..."
TOKEN_RULES_ENGINE=$(cast call --rpc-url https://sepolia.base.org "$GEM_TOKEN_ADDR" "rulesEngineAddress()(address)")

echo "- Current rules engine: $TOKEN_RULES_ENGINE"
echo "- Expected rules engine: $EXPECTED_RULES_ENGINE"

if [ "$TOKEN_RULES_ENGINE" == "$EXPECTED_RULES_ENGINE" ]; then
  echo "✅ GEMToken has the correct rules engine address"
else
  echo "❌ GEMToken has the wrong rules engine address"
fi

echo ""

# Check GemNFT's rules engine address
echo "Checking GemNFT's rules engine address..."
NFT_RULES_ENGINE=$(cast call --rpc-url https://sepolia.base.org "$GEM_NFT_ADDR" "rulesEngineAddress()(address)")

echo "- Current rules engine: $NFT_RULES_ENGINE"
echo "- Expected rules engine: $EXPECTED_RULES_ENGINE"

if [ "$NFT_RULES_ENGINE" == "$EXPECTED_RULES_ENGINE" ]; then
  echo "✅ GemNFT has the correct rules engine address"
else
  echo "❌ GemNFT has the wrong rules engine address"
fi 