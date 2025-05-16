// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "contracts/RulesEngineIntegrationERC20.sol";
import "contracts/RulesEngineIntegration.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GEMToken is RulesEngineClientCustom, ERC20, Ownable {
    error ZeroAmount();

    constructor() ERC20("GEM Token", "GEMT") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) external onlyOwner checkRulesBeforemint(address to, uint256 amount) {
        if (amount == 0) revert ZeroAmount();
        _mint(to, amount);
    }

    // Burn tokens, callable by token holder
    function burn(uint256 amount) external checkRulesBeforeburn(uint256 amount) {
        if (amount == 0) revert ZeroAmount();
        _burn(msg.sender, amount);
    }

    function transfer(address to, uint256 value) external checkRulesBeforeTransfer(address to, uint256 value) checkRulesBeforetransfer(address to, uint256 value) {
        super.transfer(to, value);
    }

    function transferFrom(address from, address to, uint256 value) external checkRulesBeforeTransfer(address to, uint256 value) checkRulesBeforetransferFrom(address from, address to, uint256 value) {
        super.transferFrom(from, to, value);
    }
    function transferOwnership(address newOwner) external checkRulesBeforeTransferOwnership(newOwner) checkRulesBeforetransferOwnership(address newOwner) {
        super.transferOwnership(newOwner);
    }
}