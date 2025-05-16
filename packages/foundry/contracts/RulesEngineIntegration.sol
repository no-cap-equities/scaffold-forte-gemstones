import "@thrackle-io/forte-rules-engine/src/client/RulesEngineClient.sol";

// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.24;

/**
 * @title Template Contract for Testing the Rules Engine
 * @author @mpetersoCode55, @ShaneDuncan602, @TJ-Everett, @VoR0220
 * @dev This file serves as a template for dynamically injecting custom Solidity modifiers into smart contracts.
 *              It defines an abstract contract that extends the `RulesEngineClient` contract, providing a placeholder
 *              for modifiers that are generated and injected programmatically.
 */
abstract contract RulesEngineClientCustom is RulesEngineClient {
    modifier checkRulesBeforemint(address to, uint256 amount) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,to, amount);
		_invokeRulesEngine(encoded);
		_;
	}

	modifier checkRulesAftermint(address to, uint256 amount) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,to, amount);
		_;
		_invokeRulesEngine(encoded);
	}

	modifier checkRulesBeforeburn(uint256 amount) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,amount);
		_invokeRulesEngine(encoded);
		_;
	}

	modifier checkRulesAfterburn(uint256 amount) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,amount);
		_;
		_invokeRulesEngine(encoded);
	}

	modifier checkRulesBeforetransferOwnership(address newOwner) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,newOwner);
		_invokeRulesEngine(encoded);
		_;
	}

	modifier checkRulesAftertransferOwnership(address newOwner) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,newOwner);
		_;
		_invokeRulesEngine(encoded);
	}

	modifier checkRulesBeforetransfer(address to, uint256 value) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,to, value);
		_invokeRulesEngine(encoded);
		_;
	}

	modifier checkRulesAftertransfer(address to, uint256 value) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,to, value);
		_;
		_invokeRulesEngine(encoded);
	}

	modifier checkRulesBeforetransferFrom(address from, address to, uint256 value) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,from, to, value);
		_invokeRulesEngine(encoded);
		_;
	}

	modifier checkRulesAftertransferFrom(address from, address to, uint256 value) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,from, to, value);
		_;
		_invokeRulesEngine(encoded);
	}




}
