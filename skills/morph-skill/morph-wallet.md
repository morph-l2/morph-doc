---
name: morph-wallet
version: 1.0.0
description: "Generate a local ETH key pair, query native and ERC-20 balances, send ETH or tokens, and look up tx receipts on Morph (Chain ID 2818). Use when the user asks to create a wallet, check balances, transfer ETH or ERC-20 tokens, or inspect a transaction. Local private key only — for Social Login Wallet flows (TEE-signed), route to BGW instead."
last_verified: 2026-05-19
verified_against:
  - https://github.com/morph-l2/morph-skill/blob/main/skills/morph-wallet/SKILL.md
upstream_repo: https://github.com/morph-l2/morph-skill
---

# Morph Wallet

Wallet operations on Morph L2 via the `morph_api.py` CLI from the
[`morph-l2/morph-skill`](https://github.com/morph-l2/morph-skill) repo.
Outputs JSON; amounts are human-readable (pass `0.1` for 0.1 ETH, not wei).

## Canonical reference (single source of truth)

[`skills/morph-wallet/SKILL.md` ↗](https://github.com/morph-l2/morph-skill/blob/main/skills/morph-wallet/SKILL.md)

This page is a routable summary for human readers. The full command spec, error
codes, and platform-specific install notes live in the upstream repo.

## When to use

- "Create a new wallet" → `create-wallet` (offline)
- "How much ETH do I have?" / "What's my USDT balance?" → `balance` / `token-balance`
- "Send 0.1 ETH to 0x…" / "Send 10 USDT to 0x…" → `transfer` / `transfer-token`
- "What happened in this tx?" → `tx-receipt`

For a **Social Login Wallet** (no local private key, signed inside Bitget Wallet
TEE), route to BGW skills instead — see
[social-wallet-integration ↗](https://github.com/morph-l2/morph-skill/blob/main/docs/social-wallet-integration.md).

## Capability summary

| Command | Flags | Purpose |
|---|---|---|
| `create-wallet` | (no flags) | Generate ETH key pair locally (offline) |
| `balance` | `--address 0xAddr` | Native ETH balance |
| `token-balance` | `--address 0xAddr --token USDT` | ERC-20 balance by symbol or contract address |
| `transfer` | `--to 0xRecipient --amount 0.01 --private-key 0xKey` | Send ETH |
| `transfer-token` | `--token USDT --to 0xRecipient --amount 10 --private-key 0xKey` | Send ERC-20 (token units) |
| `tx-receipt` | `--hash 0xTxHash` | Receipt: status, gas used, logs |

## Known token addresses (Morph Mainnet)

The CLI accepts either a known symbol or a contract address for `--token`. Pass
`""` or `ETH` for native ETH.

| Symbol | Name | Address |
|---|---|---|
| USDT | USDT | `0xe7cd86e13AC4309349F30B3435a9d337750fC82D` |
| USDT.e | Tether Morph Bridged | `0xc7D67A9cBB121b3b0b9c053DD9f469523243379A` |
| USDC | USD Coin | `0xCfb1186F4e93D60E60a8bDd997427D1F33bc372B` |
| USDC.e | USD Coin Morph Bridged | `0xe34c91815d7fc18A9e2148bcD4241d0a5848b693` |
| WETH | Wrapped Ether | `0x5300000000000000000000000000000000000011` |
| BGB | BitgetToken | `0x389C08Bc23A7317000a1FD76c7c5B0cb0b4640b5` |
| BGB (old) | BitgetToken (old) | `0x55d1f1879969bdbB9960d269974564C58DBc3238` |

For other tokens, use `token-search` from the [morph-explorer](./morph-explorer)
skill.

## Safety rules (from upstream)

1. Always confirm `transfer` / `transfer-token` with the user before signing —
   show recipient, amount, and token.
2. Amounts are human-readable. `0.1` means 0.1 ETH, not 0.1 wei.
3. Private keys are used locally for signing only — never sent to any API.
4. `create-wallet` runs offline.
5. For large transfers, verify the recipient address character-by-character.

## Common workflows

- **Portfolio check:** `balance` → `token-balance` per token of interest →
  `address-tokens` from [morph-explorer](./morph-explorer) for the full list.
- **Safe send:** `balance` (verify funds + gas) → `transfer` / `transfer-token`
  → `tx-receipt` (confirm).

## Pay gas in alt tokens

`transfer` / `transfer-token` do not accept `--fee-token-id`. To pay gas in
USDT / USDC / etc., use `altfee-send` from the
[morph-altfee](./morph-altfee) skill with the same `--to`, `--value`, or
`--data`.

## Cross-skill integration

- [morph-altfee](./morph-altfee) — pay gas in non-ETH tokens
- [morph-explorer](./morph-explorer) — `address-tokens`, `token-search`,
  full portfolio queries
- [morph-7702](./morph-7702) — atomic batch (e.g. approve + swap in one tx)
- [morph-x402](./morph-x402) — pay for HTTP-protected resources in USDC
