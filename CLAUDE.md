# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"No Cap Forte Tokens" is an equity management platform built using Scaffold-ETH 2, designed for on-chain compliance and zero-touch compliance features. The project uses a monorepo structure with Yarn workspaces containing smart contracts (Foundry) and a Next.js frontend.

## Architecture

### Packages Structure
- `/packages/foundry/`: Smart contracts using Foundry framework
  - `contracts/`: Solidity contracts (currently has template YourContract.sol)
  - `script/`: Deployment scripts
  - `test/`: Contract tests
- `/packages/nextjs/`: Next.js frontend application
  - `app/`: Next.js App Router pages
  - `components/`: React components
  - `hooks/`: Custom hooks for smart contract interactions
  - `contracts/`: Generated ABIs and contract addresses

### Key Configuration Files
- `/packages/foundry/foundry.toml`: Foundry configuration
- `/packages/nextjs/scaffold.config.ts`: Frontend blockchain configuration
- Root `package.json`: Defines workspace scripts

## Development Commands

### Initial Setup
```bash
yarn install  # Install all dependencies in the monorepo
```

### Smart Contract Development
```bash
# From root directory:
yarn chain          # Start local Anvil blockchain
yarn deploy         # Deploy contracts to local chain
yarn compile        # Compile smart contracts
yarn test          # Run smart contract tests
yarn format        # Format Solidity code

# From /packages/foundry directory:
forge test -vvv    # Run tests with verbose output
forge test --match-test testSpecificFunction  # Run a specific test
```

### Frontend Development
```bash
# From root directory:
yarn start         # Start Next.js dev server (http://localhost:3000)
yarn next:build    # Build the frontend
yarn next:lint     # Lint TypeScript/JavaScript
yarn next:format   # Format frontend code
```

### Deployment to Networks
```bash
# Deploy to specific network (requires private key configuration)
yarn deploy --network sepolia
yarn verify --network sepolia  # Verify contracts on Etherscan
```

## Test Wallets (Development)

The project includes predefined test wallets for local development:

**Mnemonic**: layer bread logic model bomb disagree tag speak utility fringe decline regular

- **Admin/Deployer**: 0xC305a5bA271Bb573b0a7907f3726A36Ab4AF25A8
- **User A**: 0x0BEB4b823B4Ec60129E5af569faaEC05737B80Fc
- **User B**: 0x31A5f60Ce92e93606a94A69DD427D72583A2B7aC
- **User C**: 0x6946d68de37D230C0274Acdf4e39c8d3c4da920A

## Environment Configuration

Copy `.env.example` to `.env` in the `/packages/foundry` directory for deployment configuration. The project uses:
- Alchemy API keys for RPC endpoints
- Etherscan API keys for contract verification
- Private keys for deployment (auto-generated or imported)

## Smart Contract Interaction

The frontend uses custom hooks for contract interactions:
- `useScaffoldContract()`: Get contract instance
- `useScaffoldReadContract()`: Read contract state
- `useScaffoldWriteContract()`: Write to contract
- `useScaffoldEventHistory()`: Subscribe to contract events

## Deployment Scripts

The main deployment script is `/packages/foundry/script/Deploy.s.sol`. Add new contract deployments by:
1. Creating a new deployment script in `/packages/foundry/script/`
2. Adding the deployment call to the main Deploy.s.sol

## Testing Strategy

- Unit tests are in `/packages/foundry/test/`
- Use Foundry's test framework with forge-std
- Run specific tests with `forge test --match-test testName`
- Use `-vvv` flag for verbose output during debugging

## Forge Commands Explanation

### Forge Basics
- `forge`: The main command-line tool for Foundry development
- `anvil`: Local Ethereum development blockchain
- `cast`: Ethereum CLI for interacting with smart contracts and networks

### Detailed Forge/Cast Command Explanations
- `forge test`: Runs smart contract tests
  - `-vvv`: Provides verbose output for detailed test results
  - `--match-test`: Runs only specific test functions
  - `--debug`: Debugs a specific test

- `forge compile`: Compiles Solidity smart contracts
  - Generates bytecode and ABI for deployment
  - Checks for compilation errors

- `forge script`: Runs deployment or interaction scripts
  - Used to deploy contracts to local or live networks
  - Can simulate transactions before execution

- `cast`: Useful for blockchain interactions
  - `cast send`: Send transactions to contracts
  - `cast call`: Read contract state without modifying blockchain
  - `cast block`: Retrieve block information
  - `cast tx`: Get transaction details

Remember to always check network configuration, have sufficient test ETH in wallets, and review scripts carefully before execution.