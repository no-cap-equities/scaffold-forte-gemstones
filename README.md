
# Fortyyyyy — Zero-Touch Compliance  
*“🧢 No Cap, On-Chain.”*

---
<div align="center">
<b>Watch the Demo</b>

[![Watch the demo on YouTube](https://img.youtube.com/vi/mfs0m0gWBho/hqdefault.jpg)](https://www.youtube.com/watch?v=mfs0m0gWBho)

</div>


---

## Table of Contents
1. [Project Overview](#project-overview)  
2. [Demo Wallets](#demo-wallets)  
3. [Quick Start](#quick-start)  
4. [Recommended Fork Workflow](#recommended-fork-workflow)  
5. [VS Code Helper Tasks](#vs-code-helper-tasks)  
6. [Contract Addresses](#contract-addresses)  
7. [Forte Rules Engine Notes](#forte-rules-engine-notes)  
8. [Deploying GemToken & GemNFT](#deploying-gemtoken--gemnft)  
9. [Troubleshooting](#troubleshooting)  
10. [Special Thanks](#special-thanks)

---

## Project Overview
Fortyyyyy integrates **GEMToken** (ERC-20) and **GemNFT** (ERC-721) with the **Forte Rules Engine** to deliver *zero-touch, on-chain compliance* for hackathon demos.  
- **One-command local fork** of Base Sepolia for realistic testing  
- **Fork-aware deploy scripts**—reuse real contracts when possible  
- **VS Code tasks** to spin up chain, deploy, and run the Next.js front-end automatically  

---

## Demo Wallets
> **Security disclaimer:** These keys are for *public demo only*. Never fund them with real value.

| Role | Address | Private Key / Mnemonic |
| ---- | ------- | ---------------------- |
| **Admin / Deployer** | `0xC305a5bA271Bb573b0a7907f3726A36Ab4AF25A8` | `0xbb69…2b8e` |
| **User A** | `0x0BEB4b823B4Ec60129E5af569faaEC05737B80Fc` | — |
| **User B** | `0x31A5f60Ce92e93606a94A69DD427D72583A2B7aC` | — |
| **User C** | `0x6946d68de37D230C0274Acdf4e39c8d3c4da920A` | — |
| **Vault** | `0x200d676e08082fd68804A48411D910Ec8a6A1d95` | — |

Mnemonic (for all keys above):

```

layer bread logic model bomb disagree tag speak utility fringe decline regular

````

---

## Quick Start
```bash
# 1 Install dependencies
yarn install
cd packages/foundry && forge install
cd ../..

# 2 Run a local Anvil chain
yarn chain          # or `yarn fork` for Base Sepolia fork

# 3 Deploy (fork-aware)
yarn deploy

# 4 Launch the Next.js front-end
yarn start
````

---

## Recommended Fork Workflow

Running `yarn fork` spins up **Anvil** forked from Base Sepolia **with live contract code already loaded**.
The deploy script detects the fork and re-uses those addresses:

```bash
yarn fork   # terminal ① – starts forked chain
yarn deploy # terminal ② – binds to forked contracts
```

Available locally without redeployment:

* **GEMToken** `0x5438…8222`
* **GemNFT**   `0x415B…9445`

---

## VS Code Helper Tasks

Press <kbd>Ctrl + Shift + P</kbd> → **Tasks: Run Task**.

| Task                        | What it does                                             |
| --------------------------- | -------------------------------------------------------- |
| **Main Build Workflow 🏗️** | Runs chain → deploys → starts front-end (split terminal) |
| **Run Chain**               | `yarn chain`                                             |
| **Deploy Contracts**        | `yarn deploy`                                            |
| **Frontend UI**             | `yarn start`                                             |
| **Frontend (Re)Deploy**     | redeploys then restarts UI                               |

> **Shortcut:** <kbd>Ctrl + Shift + B</kbd> triggers **Main Build Workflow**.

---

## Contract Addresses

| Network                | GEMToken                    | GemNFT                      | Rules Engine                |
| ---------------------- | --------------------------- | --------------------------- | --------------------------- |
| **Base Sepolia**       | `0x5438…8222`               | `0x415B…9445`               | `0x4E44…90bD`               |
| **Bahamut**            | —                           | —                           | `0x9A44…2A48`               |
| **Local Fork / Anvil** | same as Base Sepolia (fork) | same as Base Sepolia (fork) | same as Base Sepolia (fork) |

---

## Forte Rules Engine Notes

* **Revert strings** ≤ 32 chars
* Rules evaluated **in registration order**
* Register compliance policies **before** enforcement
* Event code format: `P#R#:msg`

  * `P#` → Policy category & number (C = Compliance, G = GemBlock, O = Other)
  * `R#` → Rule number
  * Example: `C3R6:Bad Country` (≤ 32 chars)

---

## Deploying GemToken & GemNFT

### Prerequisites

```bash
cd packages/foundry
cp .env.example .env            # add PRIV_KEY
# ensure BASE Sepolia funds for gas
```

### Deployment Scripts (choose one)

| Script                               | Description                       |
| ------------------------------------ | --------------------------------- |
| **Deploy.s.sol**                     | Smart, fork-aware (default)       |
| DeployBaseSepoliaGems.s.sol          | Uses hard-coded addrs if vacant   |
| DeployBaseSepoliaGemsWithCheck.s.sol | Reads deployment file             |
| DeployBaseSepoliaGemsEnv.s.sol       | Uses env vars for existing addrs  |
| DeployWithForkCheck.s.sol            | Core logic used by default script |

#### Typical Commands

```bash
# Local fork (contracts reused)
yarn fork
yarn deploy

# Real network
yarn deploy --network baseSepolia

# Only if not deployed
yarn deploy --file DeployBaseSepoliaGems.s.sol --network baseSepolia

# Use env-defined addresses
yarn deploy --file DeployBaseSepoliaGemsEnv.s.sol --network baseSepolia
```

#### Verify Rules Engine Address

```bash
chmod +x packages/foundry/scripts-sh/test-rules-engine-integration.sh
./packages/foundry/scripts-sh/test-rules-engine-integration.sh
```

Deployment artifacts land here:
`packages/foundry/deployments/84532.json` → auto-synced to `packages/nextjs/contracts/deployedContracts.ts`.

---

## Troubleshooting

| Symptom                                                   | Fix                                          |
| --------------------------------------------------------- | -------------------------------------------- |
| Deploys to chain ID 31337 (Anvil) instead of Base Sepolia | Use network name **`baseSepolia`** (no dash) |
| `LOCAL_CHAIN` ignored                                     | Ensure `LOCAL_CHAIN=FALSE` in `.env`         |
| “Not enough gas”                                          | Request BASE Sepolia from faucet             |
| Event string > 32 chars                                   | Shorten message or code                      |

---

## Special Thanks

[Scaffold-ETH](https://scaffoldeth.io) · [Forte](https://forte.io) · [Thrackle](https://www.thrackle.io) · [FastEx (Bahamut)](https://bahamut.io) · [Polkadot](https://polkadot.com) · [EasyA](https://www.easya.io)

---

*Zero Touch Compliance. No Cap! 🧢* 

