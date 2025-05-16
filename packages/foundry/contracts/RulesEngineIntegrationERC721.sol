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
    modifier checkRulesBeforemint(string calldata uri, uint128 number, uint128 value, string calldata doc, uint128 date) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,calldata uri, uint128 number, uint128 value, calldata doc, uint128 date);
		_invokeRulesEngine(encoded);
		_;
	}

	modifier checkRulesAftermint(string calldata uri, uint128 number, uint128 value, string calldata doc, uint128 date) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,calldata uri, uint128 number, uint128 value, calldata doc, uint128 date);
		_;
		_invokeRulesEngine(encoded);
	}

	modifier checkRulesBeforeburn(uint256 id) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,id);
		_invokeRulesEngine(encoded);
		_;
	}

	modifier checkRulesAfterburn(uint256 id) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,id);
		_;
		_invokeRulesEngine(encoded);
	}

	modifier checkRulesBeforetransfer(address to, uint256 id) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,to, id);
		_invokeRulesEngine(encoded);
		_;
	}

	modifier checkRulesAftertransfer(address to, uint256 id) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,to, id);
		_;
		_invokeRulesEngine(encoded);
	}

	modifier checkRulesBeforetransferOwnership(uint256 id, address to) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,id, to);
		_invokeRulesEngine(encoded);
		_;
	}

	modifier checkRulesAftertransferOwnership(uint256 id, address to) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,id, to);
		_;
		_invokeRulesEngine(encoded);
	}

	modifier checkRulesBeforetransferFrom(address from, address to, uint256 tokenId) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,from, to, tokenId);
		_invokeRulesEngine(encoded);
		_;
	}

	modifier checkRulesAftertransferFrom(address from, address to, uint256 tokenId) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,from, to, tokenId);
		_;
		_invokeRulesEngine(encoded);
	}

	modifier checkRulesBeforesafeTransferFrom(address from, address to, uint256 tokenId) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,from, to, tokenId);
		_invokeRulesEngine(encoded);
		_;
	}

	modifier checkRulesAftersafeTransferFrom(address from, address to, uint256 tokenId) {
		bytes memory encoded = abi.encodeWithSelector(msg.sig,from, to, tokenId);
		_;
		_invokeRulesEngine(encoded);
	}

	// Modifier Here






}
