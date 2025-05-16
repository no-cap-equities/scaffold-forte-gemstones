// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./GemNFT.sol";

contract GEMVault is Ownable, IERC721Receiver {
    error NotOwner();
    error ZeroValue();

    event NFTReceived(uint256 indexed id, address indexed from);

    constructor() Ownable(msg.sender) {}

    // Implement ERC721Receiver to accept NFTs
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
