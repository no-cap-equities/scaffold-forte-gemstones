// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DeployHelpers.s.sol";
import {GEMToken} from "../contracts/GemToken.sol";
import {GemNFT} from "../contracts/GemNFT.sol";

/**
 * @notice Deploy script with checks for existing contracts on Base Sepolia
 * @dev This version checks existing deployments from deployment files
 * Example:
 * yarn deploy --file DeployBaseSepoliaGemsWithCheck.s.sol --network base-sepolia
 */
contract DeployBaseSepoliaGemsWithCheck is ScaffoldETHDeploy {
    // Rules Engine address to set for both contracts
    address constant RULES_ENGINE_ADDRESS = 0x4E448907B4B8d5949D4A6C67f34419dBb29690bD;

    function run() external ScaffoldEthDeployerRunner {
        // Read existing deployments from the deployment file
        string memory deploymentPath = string.concat(
            "./deployments/",
            vm.toString(block.chainid),
            ".json"
        );
        
        address existingTokenAddress;
        address existingNFTAddress;
        
        try vm.readFile(deploymentPath) returns (string memory deploymentContent) {
            // Try to parse existing deployments
            try vm.parseJson(deploymentContent) returns (bytes memory parsedContent) {
                // Try to get GEMToken address
                try vm.parseJsonAddress(deploymentContent, ".GEMToken") returns (address tokenAddr) {
                    existingTokenAddress = tokenAddr;
                } catch {}
                
                // Try to get GemNFT address
                try vm.parseJsonAddress(deploymentContent, ".GemNFT") returns (address nftAddr) {
                    existingNFTAddress = nftAddr;
                } catch {}
            } catch {}
        } catch {
            console.log("No existing deployment file found");
        }
        
        GEMToken token;
        GemNFT nft;
        
        // Deploy or use existing GEMToken
        if (existingTokenAddress != address(0) && existingTokenAddress.code.length > 0) {
            console.log("GEMToken already deployed at:", existingTokenAddress);
            token = GEMToken(existingTokenAddress);
            deployments.push(Deployment({name: "GEMToken", addr: existingTokenAddress}));
        } else {
            console.log("Deploying new GEMToken...");
            token = new GEMToken();
            deployments.push(Deployment({name: "GEMToken", addr: address(token)}));
            
            // Set Rules Engine address for the token
            token.setRulesEngineAddress(RULES_ENGINE_ADDRESS);
            console.log("GEMToken deployed at:", address(token));
            console.log("GEMToken Rules Engine set to:", RULES_ENGINE_ADDRESS);
        }
        
        // Deploy or use existing GemNFT
        if (existingNFTAddress != address(0) && existingNFTAddress.code.length > 0) {
            console.log("GemNFT already deployed at:", existingNFTAddress);
            nft = GemNFT(existingNFTAddress);
            deployments.push(Deployment({name: "GemNFT", addr: existingNFTAddress}));
        } else {
            console.log("Deploying new GemNFT...");
            nft = new GemNFT();
            deployments.push(Deployment({name: "GemNFT", addr: address(nft)}));
            
            // Set Rules Engine address for the NFT
            nft.setRulesEngineAddress(RULES_ENGINE_ADDRESS);
            console.log("GemNFT deployed at:", address(nft));
            console.log("GemNFT Rules Engine set to:", RULES_ENGINE_ADDRESS);
        }
    }
}