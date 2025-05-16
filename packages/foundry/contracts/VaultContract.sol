// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GemstoneVault is IERC721Receiver, Ownable {
    IERC721 public gemstoneCollection;

    event Deposited(address indexed from, uint256 indexed tokenId);
    event Removed(address indexed to, uint256 indexed tokenId);

    constructor(address _gemstoneCollection) {
        gemstoneCollection = IERC721(_gemstoneCollection);
    }

    function setGemstoneCollection(address _newCollection) external onlyOwner {
        gemstoneCollection = IERC721(_newCollection);
    }

    function depositNFT(uint256 tokenId) external {
        gemstoneCollection.safeTransferFrom(msg.sender, address(this), tokenId);
        emit Deposited(msg.sender, tokenId);
    }

    function removeNFT(uint256 tokenId) external onlyOwner {
        gemstoneCollection.safeTransferFrom(address(this), msg.sender, tokenId);
        emit Removed(msg.sender, tokenId);
    }

    // Restrict NFT deposits to only the allowed collection
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        require(msg.sender == address(gemstoneCollection), "Invalid NFT collection");
        emit Deposited(from, tokenId);
        return this.onERC721Received.selector;
    }
}
