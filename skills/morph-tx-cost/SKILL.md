---
name: morph-tx-cost
description: "Morph L2 transaction fee model: L2 execution fee (EIP-1559 gas) plus L1 data/security fee, GasPriceOracle getL1Fee, eth_gasPrice / eth_estimateGas, UI total-fee display, max-ETH sends, and common RPC errors. Use when the user asks about gas cost, tx fees, l1Fee + l2Fee, why fees differ from Ethereum-only math, or fee estimation on Morph — not for AltFeeTx field signing (see docs/about-morph/10-altfeetx.md)."
last_verified: 2026-04-20
verified_against:
  - docs/build-on-morph/build-on-morph/4-understand-transaction-cost-on-morph.md
  - docs/about-morph/10-altfeetx.md
  - docs/build-on-morph/sdk/functions/estimateL1GasCost.md
  - docs/build-on-morph/sdk/functions/estimateL2GasCost.md
---

# Morph Transaction Fees (Execution Playbook)

## Single Source of Truth

| Topic | In-repo path |
|-------|--------------|
| **Fee model, formula, RPC, common errors (primary entry)** | `docs/build-on-morph/build-on-morph/4-understand-transaction-cost-on-morph.md` |
| AltFee: total fee first calculated in ETH (L1+L2), then converted to ERC-20 | `docs/about-morph/10-altfeetx.md` (Fee Calculation) |
| JS/TS: `estimateL1GasCost` / `estimateL2GasCost` etc. | `docs/build-on-morph/sdk/functions/estimateL1GasCost.md`, `estimateL2GasCost.md`; overview in `docs/build-on-morph/sdk/js-sdk.mdx` |

Details, long explanations, and on-chain notes follow **`4-understand-transaction-cost-on-morph.md`**; this SKILL only provides actionable key points and routing.

## Core Facts (Quick Reference)

The total cost of a single transaction on Morph has **two components** (unlike the pure L1 mental model of `gasPrice × gasLimit`):

1. **L2 execution fee** — Similar to Ethereum: gas consumed by execution and storage × L2 gas price.
   - Morph supports **EIP-1559**: `l2_gas_price = l2_base_fee + l2_priority_fee`.
   - `l2_execution_fee = l2_gas_price * l2_gas_used`.

2. **L1 data / security fee** — Transaction data is published to Ethereum for verifiability and security; users bear this cost, and it **typically dominates total cost**.
   - The doc provides a formula involving `l1BaseFee`, `commitScalar`, `l1BlobBaseFee`, `blobScalar`, and per-byte pricing for `len(tx_data)`; **read specific parameters from the on-chain Gas Price Oracle**, do not hardcode them.

**When displaying an estimated fee to users**: show the **sum of L2 execution fee + L1 data fee**, not just `gasPrice * gasLimit`.

## On-chain Estimation (L1 Data Fee)

- Predeploy **`GasPriceOracle`** (also called L1 Gas Price Oracle in docs); Morph Mainnet example address is in **`4-understand-transaction-cost-on-morph.md`** via the Explorer link (typically a `0x5300…000f`-style predeploy).
- Call with **raw transaction data**: `getL1Fee(bytes _data) returns (uint256)` to estimate the **L1 data fee**.
- The doc states: once a transaction is processed by the sequencer, the L1 fee the user owes is finalized; subsequent fluctuations do not affect the actual fee deducted for an already-executed transaction (see the Tip on that page).

## Sending Transactions & RPC Conventions

- Sending flow is the same as Ethereum: use `eth_gasPrice` to get the current L2 gas price; use `eth_estimateGas` to estimate the gas limit.
- **Insufficient balance** may cause the node to return:
  `invalid transaction: insufficient funds for l1Fee + l2Fee + value` (must cover **value, L2 fee, and L1 fee** simultaneously).
- **Gas price too low/too high** may cause Morph to return a custom `-32000` error (see the same doc for error text); handle per the doc's "gas price updates" section (refer to the page).

## "Send Max ETH" (max send)

When transferring as much ETH as possible from a user's balance, you must subtract both the estimated **L2 execution fee** and the **L1 data fee** from the intended transfer amount, or an insufficient funds error will occur.

## Sub-topics → Specific Skills

| User question focus | Open first |
|---------------------|------------|
| Paying gas with USDT/USDC etc., tx type `0x7f`, `feeTokenID` / `feeLimit` | `docs/about-morph/10-altfeetx.md` |
| Viem/Ethers client, chain preset, SDK package names | **`skills/morph-js-sdk/SKILL.md`** + `docs/build-on-morph/sdk/js-sdk.mdx` |
| Mainnet / Hoodi contract and RPC quick reference | **`skills/morph-contracts/SKILL.md`** (if installed) |

## Common Boundary Confusion

- **This skill**: explains **ETH-denominated** L2+L1 fee structure, display, and RPC errors.
- **AltFee token gas (`10-altfeetx.md`)**: after the total ETH fee is calculated, how to use the Token Registry and a `0x7f` transaction to pay with ERC-20; do not expand RLP/signing details in this skill.
- **Official L1↔L2 bridge (deposits/withdrawals, challenge periods)**: not covered here — see `docs/build-on-morph/build-on-morph/3-bridge-between-morph-and-ethereum.md`; distinct from the gas/L1 data fee of a single L2 tx.

## Execution Steps (model)

1. Determine if the user is asking about **fee composition/estimation/UI**, or **paying gas with tokens** — the latter redirects to **`docs/about-morph/10-altfeetx.md`**.
2. For contract addresses and chain IDs, use **morph-contracts** or `docs/` contract chapters — do not hardcode from memory.
3. Before delivering: verify that **total fee = L2 execution + L1 data** is emphasized; verify it points to `4-understand-transaction-cost-on-morph.md` as the authoritative reference.

## Self-Check

- [ ] Is **`docs/build-on-morph/build-on-morph/4-understand-transaction-cost-on-morph.md`** listed as the primary source of truth?
- [ ] Are both **L2 execution fee** and **L1 data fee** explicitly stated, with the note that they must be **summed** for display?
- [ ] Is it mentioned that the L1 data fee is estimated via **`getL1Fee`** (GasPrice Oracle), not just by multiplying gas?
- [ ] Does it cover **`insufficient funds for l1Fee + l2Fee + value`** and gas-price-too-low/too-high errors (per the doc)?
- [ ] In "token gas payment" scenarios, does it redirect to **`10-altfeetx.md`** and avoid repeating the AltFee signing table?
- [ ] Does it avoid pasting the full formula derivation inside the SKILL (use "open the above MD file" instead)?
