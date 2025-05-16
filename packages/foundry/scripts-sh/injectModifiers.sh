#! /bin/bash

npx tsx rulesSDK.ts injectModifiers \
  policies/other/policy1-erc20.json \
  src/contracts/RulesEngineIntegration.sol \
  src/contracts/GemToken.sol

