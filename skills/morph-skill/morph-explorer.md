---
name: morph-explorer
version: 1.0.0
description: "On-chain data queries on Morph L2 — address info, transactions, tokens, contracts via the Blockscout API. Use when the user asks to look up an address, view tx history, check token holdings, search tokens, get token details (holders, supply, transfers), or investigate a transaction. All commands are read-only; no private key required."
last_verified: 2026-05-19
verified_against:
  - https://github.com/morph-l2/morph-skill/blob/main/skills/morph-explorer/SKILL.md
upstream_repo: https://github.com/morph-l2/morph-skill
---

# Morph Explorer

Read-only on-chain queries on Morph L2 (Chain ID 2818) backed by the Blockscout
explorer API. Outputs JSON; no API keys or private keys required.

## Canonical reference

[`skills/morph-explorer/SKILL.md` ↗](https://github.com/morph-l2/morph-skill/blob/main/skills/morph-explorer/SKILL.md)

## When to use

- Look up an address, view its tx history or token holdings
- Search for tokens by name/symbol; get supply, holders, recent transfers
- Investigate a single transaction in detail
- Check whether a contract is verified and pull its source / ABI / proxy info

## Capability summary

| Command | Flags | Purpose |
|---|---|---|
| `address-info` | `--address 0xAddr` | Address overview (balance, tx count, …) |
| `address-txs` | `--address 0xAddr [--limit 5]` | List transactions for an address |
| `address-tokens` | `--address 0xAddr` | All ERC-20 holdings of an address |
| `tx-detail` | `--hash 0xTxHash` | Decoded tx detail (explorer view) |
| `token-search` | `--query "USDC"` | Find token by name or symbol |
| `contract-info` | `--address 0x…` | Verified contract source, ABI, proxy info |
| `token-transfers` | `--token USDT` *or* `--address 0x…` | Recent transfer history |
| `token-info` | `--token USDT` *or* `--token 0x…` | Token details (supply, holders, transfers) |
| `token-list` | (no flags) | Single-page token list |

API endpoint: `https://explorer-api.morph.network/api/v2`. No API keys required.
Install: see [overview](/skills/morph-skill#install).

## Caveats (from upstream)

- All commands output JSON. All commands are **read-only**.
- `contract-info` only works for **verified contracts**.
- `token-info` is for **ERC-20 tokens only** — for native ETH use `address-info`.
- `token-list` returns a **single page** response.
- [BGW ↗](https://github.com/morph-l2/morph-skill/blob/main/docs/social-wallet-integration.md)
  (Social Login Wallet) users: resolve the address via BGW first, then run
  these commands normally.

## Common workflows

- **Investigate a tx:** `tx-detail` (explorer view) → `tx-receipt`
  ([morph-wallet](./morph-wallet)) for RPC-level logs
- **Research an address:** `address-info` → `address-txs` → `address-tokens`
- **Token dashboard:** `token-search` → `token-info` → `token-transfers`
- **Analyze a contract:** `contract-info` (source, ABI, proxy type) →
  `address-txs` (recent interactions)

## Cross-skill integration

- Pair `address-tokens` with `balance` / `token-balance` from
  [morph-wallet](./morph-wallet) for precise balance + broad portfolio view
- Use `token-search` to find token addresses before `dex-quote`
  ([morph-dex](./morph-dex)) or `bridge-quote` ([morph-bridge](./morph-bridge))
- Use `tx-receipt` ([morph-wallet](./morph-wallet)) alongside `tx-detail` for
  log-level vs explorer-level views
- Use `7702-delegate` ([morph-7702](./morph-7702)) to check whether an address
  has EIP-7702 delegation
