//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import { DeployWithForkCheck } from "./DeployWithForkCheck.s.sol";

/**
 * @notice Main deployment script that's fork-aware
 * @dev This script:
 *      - Detects if running on a fork and uses existing addresses
 *      - Only deploys new contracts when needed
 *      - Handles both local development and real deployment scenarios
 *
 * Example: yarn deploy # runs this script (without `--file` flag)
 */
contract DeployScript is ScaffoldETHDeploy {
    function run() external {
        // Use the fork-aware deployment script
        DeployWithForkCheck deployContracts = new DeployWithForkCheck();
        deployContracts.run();
    }
}
