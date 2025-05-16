# Fortyyyyy 
## Zero Touch Compliance
> No Cap, On-Chain

# Wallets

```txt
mnemonic:
layer bread logic model bomb disagree tag speak utility fringe decline regular

Admin/Deployer:
0xC305a5bA271Bb573b0a7907f3726A36Ab4AF25A8
Private Key: 0xbb69217eefeb55763978a4d7ed56e5b5e9d5f606cf2c435fb3e23a9125392b8e

User A:
0x0BEB4b823B4Ec60129E5af569faaEC05737B80Fc

User B:
0x31A5f60Ce92e93606a94A69DD427D72583A2B7aC

User C:
0x6946d68de37D230C0274Acdf4e39c8d3c4da920A

Vault:
0x200d676e08082fd68804A48411D910Ec8a6A1d95

```

# First Time Setup

```bash
yarn install
cd packages/foundry && forge install
cd ../..
yarn chain  # Or use `yarn fork` to fork Base Sepolia
yarn deploy
```

## Using Fork Mode (Recommended for Development)

When running `yarn fork`, Anvil will fork Base Sepolia and include all deployed contracts. The deployment script automatically detects this and uses the existing contracts instead of deploying new ones:

```bash
yarn fork   # Starts Anvil with Base Sepolia fork
yarn deploy # Will use existing contracts from the fork
```

This means:
- **GEMToken** at `0x54389aB48730e453aA1B7e6D315337DC9A768222` 
- **GemNFT** at `0x415B6B8EAE5D54ABE0eC11A7DD7e74d13a259445`

Will be available in your local development environment without redeployment.

# Forte Rules Engine

Deployed contract addresses:

| Network | Address |
| ------- | ------- |
| Base Sepolia | 0x4E448907B4B8d5949D4A6C67f34419dBb29690bD |
| Bahamut | 0x9A44E9a43642398AfbC4953f03Ee62E0eA052A48 |
| Local Anvil Chain | ~0x0165878A594ca255338adfa4d48449f69242Eb8F~ <br/> 0x4E448907B4B8d5949D4A6C67f34419dBb29690bD |


## Important Notes

- **Revert messages** must be less than or equal to 32 characters
- Rules are applied in sequence based on their registration order
- Compliance policies must be registered before they can be enforced
- Rule engine uses a modular policy approach for different compliance requirements
- Transaction data is validated against registered policies before execution
- **Event codes** follow the format `P#R#:msg` where:
  - P# = Policy category and number (C=Compliance, G=GemBlock, O=Other)
  - R# = Rule number
  - Example: `C3R6: Some Message` for Compliance policy #3, rule #6
  - Remember: entire code string must be ≤32 characters

# VS Code `tasks.json` Helper

This project includes VS Code tasks to streamline development workflow:

Will launch a split terminal to run all the required commands to get local development environment running.

- **Main Build Workflow 🏗️** - The complete development workflow that:
  1. Runs a local Anvil chain
  2. Waits for the chain to start
  3. Deploys contracts
  4. Starts the frontend

- **Run Chain** - Runs a local Anvil chain (`yarn chain`)
- **Deploy Contracts** - Deploys contracts (`yarn deploy`)
- **Frontend UI** - Starts the Next.js frontend (`yarn start`)
- **Frontend (Re)Deploy** - Redeploys contracts and restarts the frontend

To use these tasks in VS Code:
1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Tasks: Run Task"
3. Select the desired task
> **Note:** Use `Ctrl+Shift+B` to run the default build task, to do all the steps above.

---
# Special Thanks
<ul>
<li><a href="https://scaffoldeth.io">Scaffold-ETH</a></li>
<li><a href="https://forte.io">Forte</a></li>
<li><a href="https://www.thrackle.io/">Thrackle</a></li>
<li><a href="https://bahamut.io">FastEx (Bahamut)</a></li>
<li><a href="https://polkadot.com/">Polkadot</a></li>
<li><a href="https://www.easya.io/">EasyA</a></li>
</ul>

## Deploying GemToken and GemNFT to Base Sepolia

We've created deployment scripts that will deploy both GemToken and GemNFT contracts to Base Sepolia and set the rules engine address to `0x4E448907B4B8d5949D4A6C67f34419dBb29690bD`.

### Prerequisites

1. Set up your private key in the `.env` file:
   ```bash
   cd packages/foundry
   cp .env.example .env
   # Edit .env and set PRIV_KEY to your private key
   ```

2. Make sure your account has BASE (the native token for Base network) to pay for gas fees.

3. The Base Sepolia RPC URL is already configured in `packages/foundry/foundry.toml`.

### Deployment Scripts

We have several deployment scripts available:

1. **Deploy.s.sol** (Default) - Fork-aware deployment that:
   - Detects if running on Anvil fork and uses existing addresses
   - Only deploys new contracts when needed
   - Handles both local and real deployments automatically

2. **DeployBaseSepoliaGems.s.sol** - Deploys with hardcoded addresses, only deploys if contracts don't exist

3. **DeployBaseSepoliaGemsWithCheck.s.sol** - Reads deployment info from deployment file

4. **DeployBaseSepoliaGemsEnv.s.sol** - Reads existing contract addresses from environment variables

5. **DeployWithForkCheck.s.sol** - Main fork-aware deployment logic used by Deploy.s.sol

### Current Deployment

The contracts are already deployed on Base Sepolia:
- **GEMToken**: `0x54389aB48730e453aA1B7e6D315337DC9A768222`
- **GemNFT**: `0x415B6B8EAE5D54ABE0eC11A7DD7e74d13a259445`

### Deployment Commands

#### Default Deployment (Fork-Aware)

The default deployment script automatically detects if you're running on a fork:

```bash
# On local fork - will use existing Base Sepolia addresses
yarn fork   # In one terminal
yarn deploy # In another terminal - will detect and use forked contracts

# On real network - will check for existing contracts
yarn deploy --network baseSepolia
```

#### Deploy Only If Not Already Deployed

This script checks if contracts already exist at known addresses and only deploys if they don't:

```bash
yarn deploy --file DeployBaseSepoliaGems.s.sol --network baseSepolia
```

#### Deploy Using Environment Variables

First, add the existing contract addresses to your `.env` file:
```bash
# In packages/foundry/.env
EXISTING_TOKEN_ADDRESS=0x54389aB48730e453aA1B7e6D315337DC9A768222
EXISTING_NFT_ADDRESS=0x415B6B8EAE5D54ABE0eC11A7DD7e74d13a259445
```

Then deploy:
```bash
yarn deploy --file DeployBaseSepoliaGemsEnv.s.sol --network baseSepolia
```

#### Force New Deployment

If you want to deploy new contracts regardless of existing ones:
1. Remove or comment out the existing addresses in the deployment script
2. Run the deployment command

### Troubleshooting

If your deployment goes to the local Anvil chain (Chain ID 31337) instead of Base Sepolia:
- Make sure you're using the exact network name `baseSepolia` (not `base-sepolia` with a dash)
- Check that `LOCAL_CHAIN=FALSE` in your `.env` file
- Verify you have funds on Base Sepolia for gas fees

### Verifying Rules Engine Integration

After deployment, you can verify that the contracts have the correct rules engine address set with the following script:

```bash
# Make the script executable if it's not already
chmod +x packages/foundry/scripts-sh/test-rules-engine-integration.sh

# Run the verification script
./packages/foundry/scripts-sh/test-rules-engine-integration.sh
```

This script will check that both GemToken and GemNFT have the rules engine address set to `0x4E448907B4B8d5949D4A6C67f34419dBb29690bD`.

### Deployment Output

After deployment, the contract addresses will be available in:
- `packages/foundry/deployments/84532.json` (Base Sepolia chain ID)
- The contract addresses will also be automatically added to your frontend under `packages/nextjs/contracts/deployedContracts.ts`

### Existing Contract Functionality

The deployed contracts include:
- **GEMToken**: ERC20 token with rules engine integration
- **GemNFT**: ERC721 NFT with appraisal functionality and rules engine integration

Both contracts have their rules engine address set to `0x4E448907B4B8d5949D4A6C67f34419dBb29690bD` for compliance enforcement.