---
name: morph-altfee
version: 1.0.0
description: "Alt-fee gas payment on Morph L2 — pay gas with alternative ERC-20 tokens (USDT, USDC, BGB, etc.) via tx type 0x7f. Use when the user has no ETH for gas and wants to pay with another token, or wants to estimate gas in token units. Mutually exclusive with EIP-7702."
last_verified: 2026-05-19
verified_against:
  - https://github.com/morph-l2/morph-skill/blob/main/skills/morph-altfee/SKILL.md
upstream_repo: https://github.com/morph-l2/morph-skill
---

# Morph Alt-Fee

Pay gas in non-ETH tokens on Morph L2 via tx type `0x7f`. Use when the user has
no ETH but holds USDT / USDC / BGB / etc.

## Canonical reference

[`skills/morph-altfee/SKILL.md` ↗](https://github.com/morph-l2/morph-skill/blob/main/skills/morph-altfee/SKILL.md)

## When to use

- List supported fee tokens
- Get details (scale, rate, decimals) for a fee token
- Estimate gas cost in an alt token
- Send a transaction paying gas with a non-ETH token

## Capability summary

| Command | Flags | Purpose |
|---|---|---|
| `altfee-tokens` | (no flags) | List supported fee tokens |
| `altfee-token-info` | `--id <n>` | Token details (contract, scale, feeRate, decimals, active) |
| `altfee-estimate` | `--id <n> [--gas-limit <n>]` | Estimate gas cost in token units (10% safety margin) |
| `altfee-send` | `--to --value --data --fee-token-id --fee-limit --gas-limit --private-key` | Send tx, pay gas with alt token |

`--fee-limit` defaults to `0` (no limit — uses available balance, unused
portion is refunded).

## Fee tokens

Supported IDs (from upstream):

| ID | Token |
|---|---|
| 1 | USDT.e |
| 2 | USDC.e |
| 3 | BGB (old) |
| 4 | BGB |
| 5 | USDT (`0xe7cd86e13AC4309349F30B3435a9d337750fC82D`) |
| 6 | USDC |

`TokenRegistry`: `0x5300000000000000000000000000000000000021`.

## Fee formula

```
feeLimit >= (gasFeeCap × gasLimit + L1DataFee) × tokenScale / feeRate
```

`altfee-token-info --id <n>` returns `tokenScale` and `feeRate` per token.
`altfee-estimate` includes a 10% safety margin.

## Critical caveats (from upstream)

- **Alt-fee and EIP-7702 are mutually exclusive** — cannot use both in one
  transaction (tx type `0x7f` vs `0x04`)
- **L1 Data Fee** depends on calldata size and L1 gas price; not estimable
  upfront
- `altfee-send` requires `--private-key` (local signing only)
- [BGW ↗](https://github.com/morph-l2/morph-skill/blob/main/docs/social-wallet-integration.md)
  (Social Login Wallet) users **cannot** use alt-fee through this skill

## Safety rules

1. Always confirm with the user before executing `altfee-send` — show
   recipient, amount, fee token, and fee limit before signing
2. Private keys are used locally for signing only — never sent to any API
3. Default `feeLimit=0` means no limit — unused portion is refunded; confirm
   this with the user

## Alt-fee support matrix

| Command | `--fee-token-id` |
|---|---|
| `altfee-send` | Yes (required) |
| `agent-register` ([morph-identity](./morph-identity)) | Yes (optional) |
| `agent-feedback` ([morph-identity](./morph-identity)) | Yes (optional) |
| `transfer` ([morph-wallet](./morph-wallet)) | No |
| `transfer-token` ([morph-wallet](./morph-wallet)) | No |
| `dex-send` ([morph-dex](./morph-dex)) | No |

## Cross-skill integration

- [morph-dex](./morph-dex) — pass `dex-quote` calldata into `altfee-send` to
  pay swap gas in alt tokens
- [morph-wallet](./morph-wallet) — `token-balance` to check fee-token balance
  before sending; `balance` to detect zero-ETH situations and suggest alt-fee
- BGW: for TEE-signed gasless flows, use BGW's `no_gas` mode instead
