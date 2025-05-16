#!/bin/bash

# Script to deploy GemToken and GemNFT to Base Sepolia

echo "Deploying GemToken and GemNFT to Base Sepolia..."
echo "Setting Rules Engine address to: 0x4E448907B4B8d5949D4A6C67f34419dBb29690bD"

# Navigate to the project root
cd "$(dirname "$0")/../.."

# Build contracts to ensure we have the latest version
echo "Building contracts..."
cd packages/foundry
forge build

# Deploy to Base Sepolia
echo "Deploying to Base Sepolia..."
yarn deploy --file DeployBaseSepoliaGems.s.sol --network baseSepolia

echo "Deployment completed!" 