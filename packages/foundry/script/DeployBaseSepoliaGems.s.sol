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
        // Deploy GEMToken
        GEMToken token = new GEMToken();
        deployments.push(Deployment({name: "GEMToken", addr: address(token)}));
        
        // Set Rules Engine address for the token
        token.setRulesEngineAddress(RULES_ENGINE_ADDRESS);
        console.log("GEMToken deployed at:", address(token));
        console.log("GEMToken Rules Engine set to:", RULES_ENGINE_ADDRESS);
        
        // Deploy GemNFT
        GemNFT nft = new GemNFT();
        deployments.push(Deployment({name: "GemNFT", addr: address(nft)}));
        
        // Set Rules Engine address for the NFT
        nft.setRulesEngineAddress(RULES_ENGINE_ADDRESS);
        console.log("GemNFT deployed at:", address(nft));
        console.log("GemNFT Rules Engine set to:", RULES_ENGINE_ADDRESS);
    }
} 