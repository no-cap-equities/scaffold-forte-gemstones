#! /bin/bash

node rulesSDK.mjs injectModifiers \
  policies/other/policy1-erc20.json \
  contracts/RulesEngineIntegration.sol \
  contracts/GemToken.sol

