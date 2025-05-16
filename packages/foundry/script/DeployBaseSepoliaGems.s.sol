// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DeployHelpers.s.sol";
import {GEMToken} from "../contracts/GemToken.sol";
import {GemNFT} from "../contracts/GemNFT.sol";

/**
 * @notice Deploy script for GemToken and GemNFT contracts on Base Sepolia
 * @dev Inherits ScaffoldETHDeploy which:
 *      - Includes forge-std/Script.sol for deployment
 *      - Includes ScaffoldEthDeployerRunner modifier
 *      - Provides `deployer` variable
 * Example:
 * yarn deploy --file DeployBaseSepoliaGems.s.sol --network base-sepolia
 */
contract DeployBaseSepoliaGems is ScaffoldETHDeploy {
    // Rules Engine address to set for both contracts
    address constant RULES_ENGINE_ADDRESS = 0x4E448907B4B8d5949D4A6C67f34419dBb29690bD;

    /**
     * @dev Must use ScaffoldEthDeployerRunner modifier to:
     *      - Setup correct `deployer` account and fund it
     *      - Export contract addresses & ABIs to `nextjs` packages
     */
    function run() external ScaffoldEthDeployerRunner {
        // Check if contracts are already deployed
        // These addresses are from the deployment on Base Sepolia
        address existingTokenAddress = 0x54389aB48730e453aA1B7e6D315337DC9A768222;
        address existingNFTAddress = 0x415B6B8EAE5D54ABE0eC11A7DD7e74d13a259445;
        
        GEMToken token;
        GemNFT nft;
        bool tokenDeployed = false;
        bool nftDeployed = false;
        
        // Check if GEMToken is already deployed
        uint256 tokenSize;
        assembly {
            tokenSize := extcodesize(existingTokenAddress)
        }
        
        if (tokenSize > 0) {
            console.log("GEMToken already deployed at:", existingTokenAddress);
            token = GEMToken(existingTokenAddress);
            tokenDeployed = true;
        } else {
            // Deploy GEMToken
            console.log("Deploying new GEMToken...");
            token = new GEMToken();
            
            // Set Rules Engine address for the token
            token.setRulesEngineAddress(RULES_ENGINE_ADDRESS);
            console.log("GEMToken deployed at:", address(token));
            console.log("GEMToken Rules Engine set to:", RULES_ENGINE_ADDRESS);
        }
        
        // Always add to deployments for ABI export
        deployments.push(Deployment({name: "GEMToken", addr: address(token)}));
        
        // Check if GemNFT is already deployed
        uint256 nftSize;
        assembly {
            nftSize := extcodesize(existingNFTAddress)
        }
        
        if (nftSize > 0) {
            console.log("GemNFT already deployed at:", existingNFTAddress);
            nft = GemNFT(existingNFTAddress);
            nftDeployed = true;
        } else {
            // Deploy GemNFT
            console.log("Deploying new GemNFT...");
            nft = new GemNFT();
            
            // Set Rules Engine address for the NFT
            nft.setRulesEngineAddress(RULES_ENGINE_ADDRESS);
            console.log("GemNFT deployed at:", address(nft));
            console.log("GemNFT Rules Engine set to:", RULES_ENGINE_ADDRESS);
        }
        
        // Always add to deployments for ABI export
        deployments.push(Deployment({name: "GemNFT", addr: address(nft)}));
        
        if (tokenDeployed && nftDeployed) {
            console.log("\nBoth contracts already deployed. No new deployments needed.");
        }
    }
} 