---
name: morph-dex
version: 1.0.0
description: "DEX swap execution on Morph L2 only — quote and send swaps via the Bulbaswap aggregator. Use when the user asks for a swap quote, a token price, or to execute a swap on Morph. For cross-chain swaps, use the morph-bridge skill instead."
last_verified: 2026-05-19
verified_against:
  - https://github.com/morph-l2/morph-skill/blob/main/skills/morph-dex/SKILL.md
upstream_repo: https://github.com/morph-l2/morph-skill
---

# Morph DEX

Swap quotes and execution **on Morph chain only** via the Bulbaswap
aggregator (API at `https://api.bulbaswap.io`). For cross-chain swaps, see
[morph-bridge](./morph-bridge).

## Canonical reference

[`skills/morph-dex/SKILL.md` ↗](https://github.com/morph-l2/morph-skill/blob/main/skills/morph-dex/SKILL.md)

## When to use

- Get a swap quote (output amount, price impact)
- Check a token's price
- Execute a swap on Morph
- For swaps on other chains or cross-chain transfers, use
  [morph-bridge](./morph-bridge)

## Capability summary

| Command | Flags | Purpose |
|---|---|---|
| `dex-quote` | `--amount --token-in --token-out [--recipient] [--slippage 0.5] [--deadline 300] [--protocols v2,v3]` | Quote (output, price impact). Pass `--recipient` to include `methodParameters` (calldata) |
| `dex-send` | `--to --value --data --private-key` | Sign and broadcast using calldata from `dex-quote --recipient` |
| `dex-approve` | `--token --spender --amount --private-key` | Approve ERC-20 spending by a router (required before swapping ERC-20s) |
| `dex-allowance` | `--token --owner --spender` | Check current allowance |

**Defaults**: `--slippage` 1%, `--deadline` 300 seconds. Supported protocols:
`v2,v3`. Returned amounts are in human-readable units.

## Critical notes (from upstream)

- **Morph chain only** — `dex-quote` and `dex-send` only work for tokens on
  Morph
- Always use `--slippage` to protect against price movement
- `dex-quote` returns amounts in human-readable units
- `dex-send` requires `methodParameters` from a quote with `--recipient`

## Safety rules

1. Always confirm with the user before executing `dex-send` or `dex-approve` —
   show swap details (token pair, amount, slippage, router) before signing
2. Private keys are used locally for signing only — never sent to any API
3. DEX quotes expire quickly — get a fresh quote and send immediately

API: `https://api.bulbaswap.io`. No API keys required.
Install: see [overview](/skills/morph-skill#install).

## Cross-skill integration

- [morph-explorer](./morph-explorer) — `token-search` to find token contract
  addresses before quoting
- [morph-wallet](./morph-wallet) — `balance` / `token-balance` to verify funds
  before swapping
- [morph-altfee](./morph-altfee) — use `altfee-send` instead of `dex-send` to
  pay gas with an alt token
- [morph-7702](./morph-7702) — pass `dex-quote --recipient 0xEOA` calldata
  inside `7702-batch` for atomic approve + swap in a single tx
- [BGW ↗](https://github.com/morph-l2/morph-skill/blob/main/docs/social-wallet-integration.md):
  Social Login Wallet users should use BGW's swap flow for execution;
  `dex-quote` is still useful for price comparison
