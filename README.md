# Fortyyyyy 
## Zero Touch Compliance
> No Cap, On-Chain

# Wallets

```txt
mnemonic:
layer bread logic model bomb disagree tag speak utility fringe decline regular

Admin/Deployer:
0xC305a5bA271Bb573b0a7907f3726A36Ab4AF25A8

User A:
0x0BEB4b823B4Ec60129E5af569faaEC05737B80Fc

User B:
0x31A5f60Ce92e93606a94A69DD427D72583A2B7aC

User C:
0x6946d68de37D230C0274Acdf4e39c8d3c4da920A
```

# First Time Setup

```bash
yarn install
cd packages/foundry && forge install
cd ../..
yarn chain
yarn deploy
```

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