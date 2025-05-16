// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./RulesEngineIntegrationERC20.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GEMToken is RulesEngineClientCustom, ERC20, Ownable {
    error ZeroAmount();

    constructor() ERC20("GEM Token", "GEMT") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) external onlyOwner checkRulesBeforemint(to, amount) {
        if (amount == 0) revert ZeroAmount();
        _mint(to, amount);
    }

    // Burn tokens, callable by token holder
    function burn(uint256 amount) external checkRulesBeforeburn(amount) {
        if (amount == 0) revert ZeroAmount();
        _burn(msg.sender, amount);
    }

    function transfer(address to, uint256 value) public virtual override checkRulesBeforetransfer(to, value) returns (bool) {
        return super.transfer(to, value);
    }

    function transferFrom(address from, address to, uint256 value) public virtual override checkRulesBeforetransferFrom(from, to, value) returns (bool) {
        return super.transferFrom(from, to, value);
    }
    
    function transferOwnership(address newOwner) public virtual override onlyOwner checkRulesBeforetransferOwnership(newOwner) checkRulesBeforetransferOwnership(newOwner) {
        super.transferOwnership(newOwner);
    }
}