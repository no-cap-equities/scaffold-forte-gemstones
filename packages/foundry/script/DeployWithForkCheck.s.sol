// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DeployHelpers.s.sol";
import {GEMToken} from "../contracts/GemToken.sol";
import {GemNFT} from "../contracts/GemNFT.sol";

/**
 * @notice Deploy script that handles both local fork and actual deployment scenarios
 * @dev This script:
 *      - Uses existing Base Sepolia addresses when running on a fork
 *      - Only deploys new contracts when addresses don't exist
 *      - Always exports ABIs for frontend integration
 * Example:
 * yarn deploy --file DeployWithForkCheck.s.sol
 */
contract DeployWithForkCheck is ScaffoldETHDeploy {
    // Rules Engine address
    address constant RULES_ENGINE_ADDRESS = 0x4E448907B4B8d5949D4A6C67f34419dBb29690bD;
    
    // Known deployed addresses on Base Sepolia
    address constant BASE_SEPOLIA_TOKEN = 0x54389aB48730e453aA1B7e6D315337DC9A768222;
    address constant BASE_SEPOLIA_NFT = 0x415B6B8EAE5D54ABE0eC11A7DD7e74d13a259445;

    function run() external ScaffoldEthDeployerRunner {
        bool isLocalChain = block.chainid == 31337;
        
        GEMToken token;
        GemNFT nft;
        
        // Check if we're on a local chain (Anvil fork)
        if (isLocalChain) {
            console.log("Running on local chain (likely a fork)");
            
            // First, check if the contracts exist at the Base Sepolia addresses
            uint256 tokenCodeSize;
            uint256 nftCodeSize;
            
            assembly {
                tokenCodeSize := extcodesize(BASE_SEPOLIA_TOKEN)
                nftCodeSize := extcodesize(BASE_SEPOLIA_NFT)
            }
            
            if (tokenCodeSize > 0 && nftCodeSize > 0) {
                console.log("Found existing contracts from fork:");
                console.log("- GEMToken at:", BASE_SEPOLIA_TOKEN);
                console.log("- GemNFT at:", BASE_SEPOLIA_NFT);
                
                token = GEMToken(BASE_SEPOLIA_TOKEN);
                nft = GemNFT(BASE_SEPOLIA_NFT);
            } else {
                console.log("No forked contracts found, deploying new ones...");
                token = new GEMToken();
                nft = new GemNFT();
                
                token.setRulesEngineAddress(RULES_ENGINE_ADDRESS);
                nft.setRulesEngineAddress(RULES_ENGINE_ADDRESS);
                
                console.log("Deployed new contracts:");
                console.log("- GEMToken at:", address(token));
                console.log("- GemNFT at:", address(nft));
            }
        } else {
            // On real networks, check if contracts are already deployed
            address existingTokenAddress = vm.envOr("EXISTING_TOKEN_ADDRESS", address(0));
            address existingNFTAddress = vm.envOr("EXISTING_NFT_ADDRESS", address(0));
            
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
                    console.log("Invalid token address, deploying new GEMToken...");
                    token = new GEMToken();
                    token.setRulesEngineAddress(RULES_ENGINE_ADDRESS);
                    console.log("GEMToken deployed at:", address(token));
                }
            } else {
                console.log("Deploying new GEMToken...");
                token = new GEMToken();
                token.setRulesEngineAddress(RULES_ENGINE_ADDRESS);
                console.log("GEMToken deployed at:", address(token));
            }
            
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
                    console.log("Invalid NFT address, deploying new GemNFT...");
                    nft = new GemNFT();
                    nft.setRulesEngineAddress(RULES_ENGINE_ADDRESS);
                    console.log("GemNFT deployed at:", address(nft));
                }
            } else {
                console.log("Deploying new GemNFT...");
                nft = new GemNFT();
                nft.setRulesEngineAddress(RULES_ENGINE_ADDRESS);
                console.log("GemNFT deployed at:", address(nft));
            }
        }
        
        // Always add to deployments for ABI export
        deployments.push(Deployment({name: "GEMToken", addr: address(token)}));
        deployments.push(Deployment({name: "GemNFT", addr: address(nft)}));
        
        console.log("\nDeployment complete!");
        console.log("GEMToken:", address(token));
        console.log("GemNFT:", address(nft));
    }
}