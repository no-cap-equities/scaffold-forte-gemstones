// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DeployHelpers.s.sol";
import {GEMToken} from "../contracts/GemToken.sol";
import {GemNFT} from "../contracts/GemNFT.sol";

/**
 * @notice Deploy script that reads existing contract addresses from environment
 * @dev Set EXISTING_TOKEN_ADDRESS and EXISTING_NFT_ADDRESS in .env to skip deployment
 * Example:
 * yarn deploy --file DeployBaseSepoliaGemsEnv.s.sol --network base-sepolia
 */
contract DeployBaseSepoliaGemsEnv is ScaffoldETHDeploy {
    // Rules Engine address to set for both contracts
    address constant RULES_ENGINE_ADDRESS = 0x4E448907B4B8d5949D4A6C67f34419dBb29690bD;

    function run() external ScaffoldEthDeployerRunner {
        // Read existing addresses from environment variables
        address existingTokenAddress = vm.envOr("EXISTING_TOKEN_ADDRESS", address(0));
        address existingNFTAddress = vm.envOr("EXISTING_NFT_ADDRESS", address(0));
        
        GEMToken token;
        GemNFT nft;
        
        // Deploy or use existing GEMToken
        if (existingTokenAddress != address(0)) {
            uint256 codeSize;
            assembly {
                codeSize := extcodesize(existingTokenAddress)
            }
            
            if (codeSize > 0) {
                console.log("GEMToken already deployed at:", existingTokenAddress);
                token = GEMToken(existingTokenAddress);
            } else {
                console.log("Invalid GEMToken address, deploying new one...");
                token = new GEMToken();
                token.setRulesEngineAddress(RULES_ENGINE_ADDRESS);
                console.log("GEMToken deployed at:", address(token));
            }
        } else {
            console.log("Deploying new GEMToken (no existing address)...");
            token = new GEMToken();
            token.setRulesEngineAddress(RULES_ENGINE_ADDRESS);
            console.log("GEMToken deployed at:", address(token));
            console.log("GEMToken Rules Engine set to:", RULES_ENGINE_ADDRESS);
        }
        
        // Always add to deployments for ABI export
        deployments.push(Deployment({name: "GEMToken", addr: address(token)}));
        
        // Deploy or use existing GemNFT
        if (existingNFTAddress != address(0)) {
            uint256 codeSize;
            assembly {
                codeSize := extcodesize(existingNFTAddress)
            }
            
            if (codeSize > 0) {
                console.log("GemNFT already deployed at:", existingNFTAddress);
                nft = GemNFT(existingNFTAddress);
            } else {
                console.log("Invalid GemNFT address, deploying new one...");
                nft = new GemNFT();
                nft.setRulesEngineAddress(RULES_ENGINE_ADDRESS);
                console.log("GemNFT deployed at:", address(nft));
            }
        } else {
            console.log("Deploying new GemNFT (no existing address)...");
            nft = new GemNFT();
            nft.setRulesEngineAddress(RULES_ENGINE_ADDRESS);
            console.log("GemNFT deployed at:", address(nft));
            console.log("GemNFT Rules Engine set to:", RULES_ENGINE_ADDRESS);
        }
        
        // Always add to deployments for ABI export
        deployments.push(Deployment({name: "GemNFT", addr: address(nft)}));
    }
}