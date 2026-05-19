---
name: morph-bridge
version: 1.3.0
description: "Cross-chain swap with JWT auth — quote prices, create orders, submit transactions, and track order status across 6 chains via the Bulbaswap Cross-Chain Swap API. Use when the user asks to bridge tokens between chains, get a cross-chain quote, search tokens on multiple chains, or manage cross-chain orders. NOT the L1↔L2 native bridge — for that, see Morph Bridge (L1↔L2)."
last_verified: 2026-05-19
verified_against:
  - https://github.com/morph-l2/morph-skill/blob/main/skills/morph-bridge/SKILL.md
upstream_repo: https://github.com/morph-l2/morph-skill
---

# Morph Bridge (Cross-chain Swap)

> **Looking for the L1↔L2 native bridge?** This page covers Bulbaswap-based
> cross-chain swap across **6 chains** with JWT order management. For Morph's
> canonical L1↔L2 deposit / withdraw via `L1GatewayRouter` and
> `proveAndRelayMessage`, see [Morph Bridge (L1↔L2)](/skills/morph-bridge/SKILL).

Cross-chain swap via the Bulbaswap Cross-Chain Swap API. Stateful orders
require JWT auth obtained from `bridge-login`.

## Canonical reference

[`skills/morph-bridge/SKILL.md` ↗](https://github.com/morph-l2/morph-skill/blob/main/skills/morph-bridge/SKILL.md)

## Supported chains

| Chain ID | Name |
|---|---|
| `morph` | Morph |
| `eth` | Ethereum |
| `base` | Base |
| `bnb` | BNB Chain |
| `arbitrum` | Arbitrum |
| `matic` | Polygon |

## When to use

- Bridge tokens across the 6 supported chains
- Get a cross-chain swap quote
- Search tokens on multiple chains; check balance + USD price on any chain
- Create, sign, submit, or track cross-chain swap orders

## Capability summary

### No-auth (read-only)

| Command | Flags | Purpose |
|---|---|---|
| `bridge-chains` | (no flags) | List supported chains |
| `bridge-tokens` | `[--chain <chain>]` | List tokens (optionally on a single chain) |
| `bridge-token-search` | `--keyword <kw> [--chain <chain>]` | Search tokens by keyword |
| `bridge-quote` | `--from-chain --from-token --amount --to-chain --to-token --from-address` | Cross-chain swap quote |
| `bridge-balance` | `--chain --token --address` | Token balance + USD price on any chain |

### Auth setup

| Command | Flags | Purpose |
|---|---|---|
| `bridge-login` | `--private-key` | EIP-191 sign → 24h JWT |

### JWT-required

| Command | Flags | Purpose |
|---|---|---|
| `bridge-make-order` | `--jwt --from-chain --from-contract --from-amount --to-chain --to-contract --to-address --market [--slippage] [--feature]` | Create an order (returns unsigned txs) |
| `bridge-submit-order` | `--jwt --order-id --signed-txs` | Submit signed txs to the API |
| `bridge-swap` | `--jwt --from-chain --from-contract --from-amount --to-chain --to-contract [--to-address] --market [--slippage] [--feature] --private-key` | One-step: make + sign + submit |
| `bridge-order` | `--jwt --order-id` | Track an order by ID |
| `bridge-history` | `--jwt [--page] [--page-size] [--status]` | List user's order history |

`--to-address` defaults to sender address if omitted on `bridge-swap`.

## Safety rules (from upstream)

- Private keys are only used locally for EIP-191 message signing in
  `bridge-login`. They are never sent to the API.
- JWT tokens are sent as `Authorization: Bearer <token>` headers. They expire
  after 24 hours.
- Always confirm with the user before executing `bridge-make-order` or
  `bridge-swap`.
- Always confirm with the user before executing `bridge-submit-order`.
- JWT expiry: re-authenticate via `bridge-login` if you hit auth errors.
- Native token format: the Bridge API uses empty string `""` for native
  tokens; the CLI handles this automatically.

## Cross-skill integration

- Pair `bridge-token-search` with `dex-quote` ([morph-dex](./morph-dex)) when
  the user wants on-Morph swap as well as cross-chain
- Pair `bridge-balance` with `balance` / `token-balance`
  ([morph-wallet](./morph-wallet)) for full multi-chain portfolio view
- Compare `bridge-quote` rates against `dex-quote` rates before deciding
  same-chain vs cross-chain
- [BGW ↗](https://github.com/morph-l2/morph-skill/blob/main/docs/social-wallet-integration.md):
  Social Login Wallet users should route execution through BGW's swap flow;
  this skill still provides quotes and route reasoning
