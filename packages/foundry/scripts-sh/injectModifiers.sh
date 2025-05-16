#! /bin/bash

node rulesSDK.mjs injectModifiers \
  policies/other/policy1-erc20.json \
  contracts/RulesEngineIntegrationERC20.sol \
  contracts/GemToken.sol

node rulesSDK.mjs injectModifiers \
  policies/other/policy2-erc721.json \
  contracts/RulesEngineIntegrationERC721.sol \
  contracts/GemNFT.sol

