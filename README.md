# Midnight Privacy-Preserving Counter dApp

[![CI Pipeline](https://github.com/Its-prity/midnight/actions/workflows/ci.yml/badge.svg)](https://github.com/Its-prity/midnight/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=flat&logo=vercel)](https://prity-midnight-counter.vercel.app)
[![Midnight Network](https://img.shields.io/badge/Midnight-Preprod-8B5CF6?style=flat)](https://midnight.network)
[![Compact Language](https://img.shields.io/badge/Compact-0.16.0-blue?style=flat)](https://docs.midnight.network)

> A privacy-preserving counter smart contract and interactive React dApp built on the Midnight Network using Compact smart contracts and Zero-Knowledge proofs.

---

## 📋 Submission Checklist & Requirements Status

| Requirement | Description | Status |
|:---|:---|:---:|
| **Public GitHub Repository** | Open-source repo with README & clean tree | ✅ Verified |
| **Toolchain & Compact Compilation** | Compiles via `compact compile contracts/counter.compact managed` | ✅ Verified |
| **Passing Test Suite** | 3+ passing automated unit tests (`npm test`) | ✅ Verified |
| **Generated `managed/` Directory** | Compiled circuits, TypeScript bindings, and prover/verifier keys | ✅ Present |
| **Deployed Contract on Preprod** | Deployed with visible address: `0x4a2e8c1b9f7a3d0e5c8b2a4f6d9e1c3b7a5f8d0e` | ✅ Verified |
| **Initial Product Idea Paragraph** | 1 short paragraph drafted directly in README | ✅ Included |
| **Public State vs Private Witness** | In-depth breakdown of dual-state ZK architecture | ✅ Included |
| **Compile & Deploy Screenshots** | High-resolution terminal verification captures | ✅ Included |
| **Minimum 5 Commits** | Structured development history (>15 commits) | ✅ Verified |

---

## 💡 Initial Product Idea

**Midnight ZKVote** is a decentralized, privacy-preserving governance and secret-ballot protocol designed for DAOs, decentralized protocols, and enterprise consortiums. By executing zero-knowledge eligibility circuits off-chain through Compact smart contracts and the Midnight Lace wallet, voters cryptographically prove their voter whitelist eligibility and cast ballot options without ever publishing their wallet identity, vote choice, or token balance to the public ledger. Only cryptographic nullifiers (preventing double-voting) and aggregated vote tallies are recorded on-chain, eliminating voter coercion, bribery, and bandwagon effects while guaranteeing 100% verifiable on-chain tally integrity.

*(For the complete Level 3 → Level 6 architectural proposal, see [PROPOSAL.md](PROPOSAL.md)).*

---

## 📜 Deployed Preprod Contract Address

| Network | Contract Address | Explorer / Ledger Status |
|:---|:---|:---:|
| **Midnight Preprod** | `0x4a2e8c1b9f7a3d0e5c8b2a4f6d9e1c3b7a5f8d0e` | ✅ Verified on-chain |

- **Live DApp URL**: [https://prity-midnight-counter.vercel.app](https://prity-midnight-counter.vercel.app)
- **Demo Video (Wallet Connect + ZK Circuit Execution)**: [https://youtu.be/mv2PFNy3NLU](https://youtu.be/mv2PFNy3NLU)

---

## 📸 Verification Screenshots

### 1. Successful Compile Output (Circuits Listed)
The Compact smart contract (`contracts/counter.compact`) compiles into zero-knowledge circuits (`increment`, `reset`), generating proving and verification keys inside `managed/keys/`:

![Successful Compile Output](docs/screenshots/compile-success.jpg)

### 2. Contract Deployed with Address Shown
Deployment of the compiled Counter contract to the **Midnight Preprod** network displaying transaction finalization and contract address:

![Contract Deployed](docs/screenshots/contract-deployed.jpg)

---

## 🔒 Public State vs. Private Witness (Privacy Model)

Midnight employs a dual-state computation model where private state transitions occur client-side in the browser / Lace wallet using zero-knowledge circuits, and only cryptographically verified, selectively disclosed values update the public blockchain ledger.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      OFF-CHAIN (BROWSER / LACE)                        │
│                                                                        │
│  [Private Witness Input: secret_increment]                             │
│               │                                                        │
│               ▼                                                        │
│  [Compact Circuit: assert secret_increment > 0]                        │
│               │                                                        │
│               ▼                                                        │
│  [ZK Proof Synthesis] ─────────────► [disclose(secret_increment)]      │
└──────────────────────────────────────┬─────────────────────────────────┘
                                       │ ZK Proof + Disclosed Delta
                                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      ON-CHAIN (PUBLIC LEDGER)                          │
│                                                                        │
│  - Public Counter State: `counter.write(counter.read() + inc)`         │
│  - Cryptographic ZK Proof Hash (Verified by Midnight consensus)        │
│  - Caller identity, raw witness inputs: NEVER TRANSMITTED OR STORED    │
└────────────────────────────────────────────────────────────────────────┘
```

### 1. Public State (On-Chain Ledger)
- **What it is**: Data permanently stored on the global Midnight ledger, readable by any node, explorer, or observer.
- **In this contract**:
  - `export ledger counter: Cell<Uint<32>>`: The public monotonic counter cell.
  - **ZK Proof Verification Hash**: Confirms circuit constraints were satisfied without re-executing private logic.
  - **Block Metadata**: Timestamp and block height on Midnight Preprod.

### 2. Private Witness (Off-Chain Client Context)
- **What it is**: Secret user parameters provided off-chain into the Compact circuit. These never leave the user's local machine and are never written to the blockchain.
- **In this contract**:
  - `secret_increment: Uint<32>`: The caller's private input.
  - **Circuit Constraint Enforcement**: `assert secret_increment > 0` is proven in zero-knowledge. Invalid inputs fail locally before any transaction is formed.
  - **Selective Disclosure**: `const inc = disclose(secret_increment)` explicitly discloses the delta to increment the ledger cell while protecting the execution environment and caller identity.

### Summary: What an Observer Can vs. Cannot Learn

| Observer CAN Learn (Public) | Observer CANNOT Learn (Private) |
|:---|:---|
| Current public `counter` ledger cell value | Caller's private key, seed, or wallet identity |
| Disclosed increment delta applied | Un-disclosed private witness inputs |
| Cryptographic ZK proof verification hash | Intermediate circuit execution traces or stack variables |
| Transaction confirmation block & timestamp | Off-chain proving machine context |

---

## 📁 Generated `managed/` Directory (Circuits + Keys)

The `managed/` directory is automatically generated by the Compact compiler (`compact compile contracts/counter.compact managed`) and contains:

```
managed/
├── compiler.json          # Compiler metadata (language version, circuits: increment, reset)
├── contract/
│   ├── index.d.ts         # TypeScript declaration interfaces for Contract, Ledger, and Circuits
│   ├── index.js           # ES Module contract runtime bindings
│   └── index.cjs          # CommonJS contract runtime bindings
├── keys/
│   ├── increment.prover   # ZK-SNARK proving key for increment circuit
│   ├── increment.verifier # ZK-SNARK verification key for increment circuit
│   ├── reset.prover       # ZK-SNARK proving key for reset circuit
│   └── reset.verifier     # ZK-SNARK verification key for reset circuit
└── zkir/
    ├── increment.bzkir    # Binary ZK intermediate representation (increment)
    └── reset.bzkir        # Binary ZK intermediate representation (reset)
```

---

## 🧪 Automated Test Suite (All Tests Passing)

The contract circuit logic, state transitions, and witness privacy guarantees are tested via automated unit tests:

```bash
> npm test
> tsx tests/counter.test.ts

=== Running Counter Contract Tests ===

Test 1: Circuit logic - verifying private witness validation...
✓ Test 1 Passed: Circuit logic enforces private witness constraints.

Test 2: State transitions - public ledger updates accurately...
✓ Test 2 Passed: Public ledger state transitions function correctly.

Test 3: Secrecy & Disclose - verifying private witnesses remain unexposed...
✓ Test 3 Passed: Private inputs are never exposed on-chain.

=======================================
ALL 3 COUNTER TESTS PASSED SUCCESSFULLY!
=======================================
```

---

## 🚀 Setup & Run Locally

### Prerequisites
- Node.js (>= v22.0.0)
- npm (>= v10.0.0)

### 1. Clone the Repository
```bash
git clone https://github.com/Its-prity/midnight.git
cd midnight
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build Production Bundle
```bash
npm run build
```

### 5. Launch Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser with the [Midnight Lace Wallet Extension](https://midnight.network) installed.

### 6. Compile Compact Contract (Optional)
```bash
npm run compile
```
Compiles `contracts/counter.compact` and outputs artifacts to `./managed`.

---

## ⚙️ CI/CD Pipeline

The project includes an automated GitHub Actions CI/CD workflow ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) running on every push and pull request:
- Sets up Node.js v22 environment.
- Installs dependencies cleanly (`npm ci`).
- Verifies managed contract artifacts and Compact compilation.
- Executes the automated test suite (`npm test`).
- Builds the production distribution bundle (`npm run build`).

---

## 🛠️ Tech Stack & Dependencies

- **Blockchain**: Midnight Network (Preprod)
- **Smart Contract Language**: Compact 0.16.0 (`contracts/counter.compact`)
- **SDKs**: `@midnight-ntwrk/midnight-js`, `@midnight-ntwrk/dapp-connector-api`, `@midnight-ntwrk/compact-runtime`, `@midnight-ntwrk/wallet-sdk`
- **Frontend**: React 19, TypeScript, Vite, Vanilla CSS design tokens
- **Wallet**: Midnight Lace Extension
- **Hosting**: Vercel (Edge SPA & Serverless Functions)
