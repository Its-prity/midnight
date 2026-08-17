# Midnight Privacy-Preserving Counter Smart Contract
> A privacy-preserving counter smart contract built on the Midnight Network using the Compact language and Zero-Knowledge proofs.

## Contract Address
| Network  | Address                          |
|----------|----------------------------------|
| Preview  | [PASTE ADDRESS AFTER DEPLOY]     |
| Preprod  | [PASTE ADDRESS AFTER DEPLOY]     |

*(This section is MANDATORY. Placeholders above will be updated upon final network deployment.)*

## What This Does
This smart contract maintains a global public counter on the Midnight blockchain ledger. Users can trigger increments by submitting a private witness input (a secret increment value). The contract validates circuit conditions off-chain and explicitly discloses only the calculated increment amount to update the public counter state, ensuring high privacy and verifiable execution.

## Privacy Model
- **What is PUBLIC (on-chain, visible to anyone)**:
  - `counter`: The on-chain `Uint<32>` ledger Cell holding the current state total.
  - The final disclosed increment value applied to the public counter.
- **What is PRIVATE (private witness, never on-chain)**:
  - `secret_increment`: The caller's private circuit input and off-chain execution context.
- **What the user PROVES without revealing**:
  - Proves via Zero-Knowledge proof that the private increment value satisfies circuit constraints (`secret_increment > 0`) without exposing the user's private key or identity.

## Tech Stack
- Midnight network, Compact language, Node.js v22, Docker

## Prerequisites
- Node.js v22 (or higher)
- Docker Desktop (with WSL2 enabled on Windows)
- Compact compiler toolchain (`@midnight-ntwrk/compact-compiler`)
- Midnight Proof Server container (`midnightnetwork/proof-server:latest`)

## Setup
1. Clone the repository and navigate into the project directory:
   ```bash
   cd "c:\Users\HP\OneDrive\projects\prity midnight"
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Start the Midnight Proof Server in Docker:
   ```bash
   docker run -d -p 6300:6300 --name proof-server midnightnetwork/proof-server
   ```
4. Compile the Compact contract:
   ```bash
   compact compile contracts/counter.compact managed
   ```

## Run Tests
Run the automated TypeScript unit test suite:
```bash
npm test
```

## Initial Idea
[LEAVE PLACEHOLDER — I will fill this in manually]

## Screenshots
[LEAVE PLACEHOLDER — I will add compile output and contract address screenshots]
