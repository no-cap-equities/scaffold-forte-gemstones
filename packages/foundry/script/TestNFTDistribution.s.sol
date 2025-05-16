// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/GemNFT.sol";

contract TestNFTDistribution is Script {
    // TODO: Replace these addresses with your desired recipient addresses
    address constant ADMIN = address(0xC305a5bA271Bb573b0a7907f3726A36Ab4AF25A8); 
    address constant USER_A = address(0x0BEB4b823B4Ec60129E5af569faaEC05737B80Fc); 
    address constant USER_B = address(0x31A5f60Ce92e93606a94A69DD427D72583A2B7aC);
    address constant USER_C = address(0x6946d68de37D230C0274Acdf4e39c8d3c4da920A);
    address constant MOCK_VAULT = address(0x200d676e08082fd68804A48411D910Ec8a6A1d95);

    function run() public {
        // Get deployed GemNFT contract address
        address gemNFTAddress = vm.envAddress("GEM_NFT_ADDRESS");
        GemNFT gemNFT = GemNFT(gemNFTAddress);

        // Start broadcasting transactions
        vm.startBroadcast();

        // Mint 5 NFTs
        console.log("Minting 5 NFTs...");
        for (uint256 i = 1; i <= 5; i++) {
            string memory uri = string(abi.encodePacked("https://static.gemtrust.xyz/nft/", vm.toString(i)));
            uint128 number = uint128(i);
            uint128 value = uint128(1000 * i); // Example values
            string memory doc = string(abi.encodePacked("NFT #", vm.toString(i)));
            uint128 date = uint128(block.timestamp);
            
            gemNFT.mint(uri, number, value, doc, date);
            console.log("Minted NFT #", i);
        }

        // Transfer NFTs to recipients
        console.log("Distributing NFTs to recipients...");
        
        // Transfer NFT #1 to USER_A
        gemNFT.ownerTransfer(1, USER_A);
        console.log("Transferred NFT #1 to", USER_A);
        
        // Transfer NFT #2 to USER_B
        gemNFT.ownerTransfer(2, USER_B);
        console.log("Transferred NFT #2 to", USER_B);
        
        // Transfer NFT #3 to USER_C
        gemNFT.ownerTransfer(3, USER_C);
        console.log("Transferred NFT #3 to", USER_C);
        
        // Transfer NFT #4 to MOCK_VAULT
        gemNFT.ownerTransfer(4, MOCK_VAULT);
        console.log("Transferred NFT #4 to", MOCK_VAULT);
        
        // Keep NFT #5 for the deployer
        console.log("Keeping NFT #5 for the deployer");

        vm.stopBroadcast();

        // Verify distribution
        console.log("\nVerifying distribution:");
        console.log("Deployer owns NFT #5:", gemNFT.ownerOf(5));
        console.log("Recipient 1 owns NFT #1:", gemNFT.ownerOf(1));
        console.log("Recipient 2 owns NFT #2:", gemNFT.ownerOf(2));
        console.log("Recipient 3 owns NFT #3:", gemNFT.ownerOf(3));
        console.log("Recipient 4 owns NFT #4:", gemNFT.ownerOf(4));
    }
}