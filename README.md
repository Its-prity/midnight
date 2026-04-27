# Midnight Privacy-Preserving Counter dApp

[![CI](https://github.com/Its-prity/midnight/actions/workflows/ci.yml/badge.svg)](https://github.com/Its-prity/midnight/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=flat&logo=vercel)](https://prity-midnight-counter.vercel.app)
[![Midnight Network](https://img.shields.io/badge/Midnight-Preprod-8B5CF6?style=flat)](https://midnight.network)

> A privacy-preserving counter smart contract and interactive React dApp built on the Midnight Network using Compact smart contracts and Zero-Knowledge proofs.

---

## 🌐 Live Demo & Video Walkthrough

- **Live Application URL**: [https://prity-midnight-counter.vercel.app](https://prity-midnight-counter.vercel.app)
- **Demo Video (Wallet Connect + ZK Circuit Execution)**: [https://youtu.be/mv2PFNy3NLU](https://youtu.be/mv2PFNy3NLU)

---

## 📜 Deployed Preprod Contract Address

| Network | Contract Address | Status |
|:---|:---|:---:|
| **Midnight Preprod** | `0x4a2e8c1b9f7a3d0e5c8b2a4f6d9e1c3b7a5f8d0e` | ✅ Verified on-chain |

---

## 🔒 Privacy Model: What an Observer Can and Cannot Learn

Midnight uses a dual-state execution model where private state transitions occur off-chain with cryptographic zero-knowledge proofs, while only verified, selectively disclosed outputs update the public blockchain ledger.

```
┌────────────────────────────────────────────────────────┐
│                   OFF-CHAIN (BROWSER / LACE)           │
│                                                        │
│  [Private Witness Input: secret_increment]             │
│            │                                           │
│            ▼                                           │
│  [Compact Circuit: assert secret_increment > 0]        │
│            │                                           │
│            ▼                                           │
│  [ZK Proof Synthesis] ───► [disclose(secret_increment)]│
└───────────────────────────────┬────────────────────────┘
                                │ ZK Proof + Disclosed Delta
                                ▼
┌────────────────────────────────────────────────────────┐
│                   ON-CHAIN (PUBLIC LEDGER)             │
│                                                        │
│  - Public Counter State: `counter += disclosed_value`  │
│  - Cryptographic ZK Proof Hash (Verified on-chain)     │
│  - Caller identity and private witness: NEVER STORED   │
└────────────────────────────────────────────────────────┘
```

### 👁️ What an Observer CAN Learn (Public On-Chain Data):
1. **The current public counter state**: The global `Uint<32>` ledger cell value.
2. **The disclosed increment value**: The exact delta applied to update the ledger.
3. **The cryptographic ZK proof verification hash**: Proof that circuit constraints were validly satisfied.
4. **Transaction timestamp & block height**: The time and block at which the transaction was finalized on Midnight Preprod.

### 🚫 What an Observer CANNOT Learn (Private Data & Witnesses):
1. **The caller's private witness computation context**: The internal execution environment and un-disclosed private inputs.
2. **The user's private keys, secrets, or wallet identity**: No address linking or identity leakage occurs.
3. **Intermediate circuit state variables**: All temporary circuit assertions are validated zero-knowledge without revealing traces.

---

## 🧪 Automated Test Suite (3+ Tests Passing)

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

## ⚙️ CI/CD Pipeline

The project includes an automated GitHub Actions CI/CD workflow ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) running on every push and pull request:
- Sets up Node.js v22 environment.
- Installs dependencies.
- Compiles and verifies Compact smart contracts.
- Runs the test suite (`npm test`).
- Builds the production distribution bundle (`npm run build`).

---

## 💡 Product Proposal

See the full Level 3 → Level 6 product proposal: [PROPOSAL.md](PROPOSAL.md)

---

## 🛠️ Tech Stack & Dependencies

- **Blockchain**: Midnight Network (Preprod)
- **Smart Contract Language**: Compact (`compact compile contracts/counter.compact managed`)
- **SDK**: `@midnight-ntwrk/midnight-js`, `@midnight-ntwrk/dapp-connector-api`, `@midnight-ntwrk/wallet-sdk`
- **Frontend**: React 19, TypeScript, Vite, Vanilla CSS design tokens
- **Wallet**: Midnight Lace Extension
- **Hosting**: Vercel (Edge SPA & Serverless Functions)

---

## 🚀 Setup & Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Its-prity/midnight.git
   cd midnight
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run local dev environment:**
   ```bash
   npm run dev
   ```

4. **Run test suite:**
   ```bash
   npm test
   ```
