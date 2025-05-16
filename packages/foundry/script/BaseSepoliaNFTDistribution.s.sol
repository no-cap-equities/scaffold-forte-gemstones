// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/GemNFT.sol";

contract BaseSepoliaNFTDistribution is Script {
    // GemNFT deployed address on Base Sepolia
    address constant GEM_NFT_ADDRESS = 0x415B6B8EAE5D54ABE0eC11A7DD7e74d13a259445;
    
    // Test addresses from CLAUDE.md
    address constant ADMIN = address(0xC305a5bA271Bb573b0a7907f3726A36Ab4AF25A8); 
    address constant USER_A = address(0x0BEB4b823B4Ec60129E5af569faaEC05737B80Fc); 
    address constant USER_B = address(0x31A5f60Ce92e93606a94A69DD427D72583A2B7aC);
    address constant USER_C = address(0x6946d68de37D230C0274Acdf4e39c8d3c4da920A);

    function run() public {
        // Get the GemNFT contract instance
        GemNFT gemNFT = GemNFT(GEM_NFT_ADDRESS);

        // Get the private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Get the current supply to determine the next token ID
        uint256 currentSupply = gemNFT.totalSupply();
        uint256 startId = currentSupply + 1; // Next token ID
        console.log("Current supply:", currentSupply);
        console.log("Starting from token ID:", startId);

        // Mint 5 NFTs
        console.log("Minting 5 NFTs starting from ID:", startId);
        for (uint256 i = 0; i < 5; i++) {
            uint256 tokenId = startId + i;
            string memory uri = string(abi.encodePacked("https://static.gemtrust.xyz/nft/base-sepolia-", vm.toString(tokenId)));
            uint128 number = uint128(tokenId);
            uint128 value = uint128(1000 * (i + 1)); // Values: 1000, 2000, 3000, 4000, 5000
            string memory doc = string(abi.encodePacked("Base Sepolia NFT #", vm.toString(tokenId)));
            uint128 date = uint128(block.timestamp);
            
            gemNFT.mint(uri, number, value, doc, date);
            console.log("Minted NFT #", tokenId);
        }

        // Transfer NFTs to recipients
        console.log("Distributing NFTs to recipients...");
        
        // Transfer first NFT to USER_A
        gemNFT.ownerTransfer(startId, USER_A);
        console.log("Transferred NFT #", startId, "to USER_A:", USER_A);
        
        // Transfer second NFT to USER_B
        gemNFT.ownerTransfer(startId + 1, USER_B);
        console.log("Transferred NFT #", startId + 1, "to USER_B:", USER_B);
        
        // Transfer third NFT to USER_C
        gemNFT.ownerTransfer(startId + 2, USER_C);
        console.log("Transferred NFT #", startId + 2, "to USER_C:", USER_C);
        
        // Transfer fourth NFT to ADMIN (another test address)
        gemNFT.ownerTransfer(startId + 3, ADMIN);
        console.log("Transferred NFT #", startId + 3, "to ADMIN:", ADMIN);
        
        // Keep the fifth NFT for the deployer
        console.log("Keeping NFT #", startId + 4, "for the deployer");

        vm.stopBroadcast();

        // Verify distribution (these calls won't be broadcast)
        address deployer = vm.addr(deployerPrivateKey);
        console.log("\nVerifying distribution:");
        console.log("Deployer:", deployer);
        console.log("owns NFT #%s: %s", startId + 4, gemNFT.ownerOf(startId + 4));
        console.log("USER_A:", USER_A);
        console.log("owns NFT #%s: %s", startId, gemNFT.ownerOf(startId));
        console.log("USER_B:", USER_B);
        console.log("owns NFT #%s: %s", startId + 1, gemNFT.ownerOf(startId + 1));
        console.log("USER_C:", USER_C);
        console.log("owns NFT #%s: %s", startId + 2, gemNFT.ownerOf(startId + 2));
        console.log("ADMIN:", ADMIN);
        console.log("owns NFT #%s: %s", startId + 3, gemNFT.ownerOf(startId + 3));
        
        console.log("\nBase Sepolia NFT distribution completed!");
        console.log("View contract on Base Sepolia explorer:");
        console.log(string(abi.encodePacked("https://sepolia.basescan.org/address/", vm.toString(GEM_NFT_ADDRESS))));
    }
}