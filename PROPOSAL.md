# Product Proposal: Midnight ZKVote (Confidential Governance & Secret Ballot System)

## 1. What is the product, and who uses it?
**Midnight ZKVote** is a decentralized, privacy-preserving governance and secret-ballot protocol designed for DAOs, decentralized protocols, and enterprise consortiums.

### Target Users:
1. **DAO Members & Token Holders**: Cast confidential governance votes without exposing their individual voter preferences, wallet balances, or voting history to the public.
2. **Protocol Foundations & Committees**: Run tamper-proof elections, grant approvals, and treasury allocation polls with mathematically guaranteed tally accuracy.
3. **Enterprise Consortiums**: Participate in multi-stakeholder decisions without leaking strategic intent or corporate alliances to competitor observers.

---

## 2. Why Midnight specifically?
Transparent blockchains (such as Ethereum or public Solana) force all transactions and contract state to be fully visible on-chain. This creates critical issues for governance:
- **Voter Coercion & Bribery**: Transparent votes allow malicious actors to verify whether a bribe recipient voted as promised.
- **Bandwagon Effects & Front-Running**: Public interim voter tallies influence late voters and distort true community consensus.
- **Privacy Leakage**: Linking wallet addresses to voting positions permanently strips participant anonymity.

### Why Midnight Solves This:
1. **Compact Smart Contracts & Off-Chain Proving**: Voters generate Zero-Knowledge proofs of voter eligibility and vote validity locally in the browser/Lace wallet without publishing their identity or private ballot choices.
2. **Dual-State Architecture (Private Witness + Public Ledger)**: The voter's key, token weight, and secret ballot choice remain in the private witness realm, while only the aggregated tallies and valid ZK state transitions update the public ledger.
3. **Selective Disclosure**: Results are provably disclosed at the close of voting without ever exposing individual ballot-voter mappings.

---

## 3. Data Model
| Data Point | Type | Disclosed To | Description / Reason |
|:---|:---|:---|:---|
| **Voter Secret Key & Seed** | `Private Witness` | **Voter Only (No one on-chain)** | Kept strictly on the user's local machine inside the Lace wallet. |
| **Voter Choice / Ballot Option** | `Private Witness` | **Voter Only (No one on-chain)** | Kept confidential during the election period to prevent front-running and coercion. |
| **Eligibility Merkle Proof / Nullifier** | `Private Witness` | **ZK Circuit Verifier Only** | Proves the voter is registered on the whitelist and hasn't voted twice without revealing identity. |
| **Nullifier Hash** | `Public Ledger` | **Everyone (On-chain)** | Unique cryptographic commitment preventing double-voting. |
| **Public Proposal State & Counter** | `Public Ledger` | **Everyone (On-chain)** | Global verified vote tally updated strictly through proven ZK circuit transitions. |
| **ZK Proof Hex String** | `Public Ledger` | **Everyone (On-chain)** | Cryptographic proof ensuring circuit constraints (`choice in [1..N] && is_whitelisted`) are satisfied. |

---

## 4. Mainnet Feasibility (Level 3 → Level 6 Roadmap)
- **Level 2 (Current)**: Privacy-preserving Counter contract foundation with Compact circuit assertions, Lace DApp Connector API, and live Preprod deployment.
- **Level 3**: Multi-option confidential ballot circuits with nullifier generation and off-chain witness encryption.
- **Level 4**: Indexer integration with GraphQL subscription feeds for real-time proposal state tracking and wallet balance snapshots.
- **Level 5**: Production audit, proof server optimization with WebAssembly client-side proving, and pre-deployment load tests on Midnight Testnet.
- **Level 6 (Mainnet)**: Full production deployment to Midnight Mainnet with multi-sig governance control and developer documentation.

---

## 5. Architectural Alignment with Midnight Network
This application is designed specifically around Midnight's native capabilities:
- **Language**: Compact 0.16.0
- **Client SDK**: `@midnight-ntwrk/midnight-js` & `@midnight-ntwrk/dapp-connector-api`
- **Wallet Support**: Midnight Lace Extension
- **Network**: Midnight Preprod (`0x4a2e8c1b9f7a3d0e5c8b2a4f6d9e1c3b7a5f8d0e`)
