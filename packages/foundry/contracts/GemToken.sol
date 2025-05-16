// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {ERC1363} from "@openzeppelin/contracts/token/ERC20/extensions/ERC1363.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Custodian} from "@openzeppelin/community-contracts/token/ERC20/extensions/ERC20Custodian.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @custom:security-contact security@gemblock.xyz
contract GemstoneToken is ERC20, ERC20Burnable, Ownable, ERC1363, ERC20Permit, ERC20Custodian {
    constructor(address initialOwner)
        ERC20("Gemstone Token", "GEM")
        Ownable(initialOwner)
        ERC20Permit("Gemstone Token")
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _isCustodian(address user) internal view override returns (bool) {
        return user == owner();
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Custodian)
    {
        super._update(from, to, value);
    }
}