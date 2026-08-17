# Midnight Privacy-Preserving Counter dApp
> A privacy-preserving counter smart contract and interactive React dApp built on the Midnight Network using Compact and Zero-Knowledge proofs.

## Live Demo
[PASTE LIVE URL AFTER DEPLOYING FRONTEND]

## Contract Address
| Network  | Address                                                            |
|----------|--------------------------------------------------------------------|
| Preprod  | 0x4a2e8c1b9f7a3d0e5c8b2a4f6d9e1c3b7a5f8d0e                          |

*(Contract address is MANDATORY. Placeholders above will be updated upon final deployment.)*

## What This Does
This dApp maintains a global public counter on the Midnight blockchain ledger. Users connect their Midnight Lace wallet and trigger counter increments by providing a private witness input (`secret_increment`). The Compact smart contract validates circuit constraints off-chain locally in the browser, generates a Zero-Knowledge proof, and explicitly discloses only the calculated increment amount to update the public on-chain counter state without revealing the caller's identity or raw witness data.

## Privacy Model
- **What is PUBLIC (on-chain, visible to anyone)**:
  - `counter`: The on-chain `Uint<32>` ledger Cell holding the current state total.
  - The final disclosed increment value applied to the public counter.
  - The cryptographic Zero-Knowledge proof verification hash.
- **What is PRIVATE (private witness, never on-chain)**:
  - `secret_increment`: The caller's private circuit input and off-chain execution context.
  - User's private key, wallet credentials, and local computing environment.
- **What the user PROVES without revealing**:
  - Proves via Zero-Knowledge proof that the private increment value satisfies circuit constraints (`secret_increment > 0`) without exposing the secret input or identity.

## Privacy Claim
> **An on-chain observer sees the updated ledger counter total and the cryptographic Zero-Knowledge proof confirming the circuit ran validly. The observer CANNOT see the caller's private witness input or identity.**

## Tech Stack
- Midnight network, Compact language, Midnight.js SDK, DApp Connector API (`@midnight-ntwrk/dapp-connector-api`), React + Vite, Lace wallet

## Prerequisites
- Midnight Lace wallet extension installed in browser
- Node.js v22 (or higher)

## Run Locally
1. Clone the repository and navigate into the project directory:
   ```bash
   cd "c:\Users\HP\OneDrive\projects\prity midnight"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the React + Vite frontend locally:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:3000` and connect your Lace wallet.

5. Run automated contract unit tests:
   ```bash
   npm test
   ```

## Demo Video
[PLACEHOLDER — I will add the link after recording]
