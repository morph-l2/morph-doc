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

> **L1↔L2 native bridge?** Use [Morph Bridge (L1↔L2)](/skills/morph-bridge/SKILL) — `L1GatewayRouter`, deposits, withdrawals, and `proveAndRelayMessage`. This page is the **Bulbaswap cross-chain swap** mirror only.

## Prompt triggers

| Trigger | CLI / flow |
|---------|------------|
| List chains or tokens | `bridge-chains`, `bridge-tokens`, `bridge-token-search` |
| Quote or balance (no JWT) | `bridge-quote`, `bridge-balance` |
| Authenticate for orders | `bridge-login` (EIP-191 → 24h JWT) |
| Create / submit / one-shot swap | `bridge-make-order`, `bridge-submit-order`, `bridge-swap` |
| Track orders | `bridge-order`, `bridge-history` |

## Execution Steps

1. **Disambiguate bridge type** — cross-chain swap (this page) vs Morph L1↔L2 native bridge ([`skills/morph-bridge/SKILL.md`](/skills/morph-bridge/SKILL)).
2. **Read-only path** — run `bridge-chains` / `bridge-tokens` / `bridge-quote` / `bridge-balance` without JWT.
3. **Stateful swap path** — `bridge-login` → `bridge-make-order` (unsigned txs) → sign locally → `bridge-submit-order`; or use `bridge-swap` for make+sign+submit when the user approves one-shot execution.
4. **Confirm before writes** — get explicit user approval before `bridge-make-order`, `bridge-submit-order`, or `bridge-swap`.
5. **On auth errors** — JWT expires after 24h; re-run `bridge-login`.

## Deep links

- Upstream playbook: [`github.com/morph-l2/morph-skill` — morph-bridge SKILL](https://github.com/morph-l2/morph-skill/blob/main/skills/morph-bridge/SKILL.md)
- L1↔L2 native bridge (this repo): [`skills/morph-bridge/SKILL.md`](/skills/morph-bridge/SKILL)
- BGW social wallet handoff: [social-wallet-integration](https://github.com/morph-l2/morph-skill/blob/main/docs/social-wallet-integration.md)

## Safety (short)

- Private keys stay local (EIP-191 in `bridge-login` only); never send keys to the API.
- JWT in `Authorization: Bearer` headers; re-auth on expiry.
- Native tokens use `""` in the API; CLI normalizes this.

## Related Skills

- [morph-dex](./morph-dex) — on-Morph swap quotes (`dex-quote`)
- [morph-wallet](./morph-wallet) — balances across chains
- [Morph Bridge (L1↔L2)](/skills/morph-bridge/SKILL) — canonical L1↔L2 deposit/withdraw
