---
name: morph-x402
version: 1.0.0
description: "x402 HTTP payment protocol on Morph L2 — pay for and receive USDC payments for API resources. Client side: discover, pay. Merchant side: register, verify, settle, run a paid HTTP server. Uses EIP-3009 gasless USDC transfer authorization."
last_verified: 2026-05-19
verified_against:
  - https://github.com/morph-l2/morph-skill/blob/main/skills/morph-x402/SKILL.md
upstream_repo: https://github.com/morph-l2/morph-skill
---

# Morph x402

x402 HTTP payment protocol on Morph L2. Pay for or receive USDC for any HTTP
resource. Built on EIP-3009 (gasless USDC transfer authorization, signed by
payer; Facilitator calls `receiveWithAuthorization` on the USDC contract).

## Canonical reference

[`skills/morph-x402/SKILL.md` ↗](https://github.com/morph-l2/morph-skill/blob/main/skills/morph-x402/SKILL.md)

## When to use

- Check x402 support / discover whether a URL requires payment (no signing)
- Pay for an x402-protected resource with USDC
- Register as a merchant to receive payments
- Verify a payment signature; settle a payment on-chain
- Run a local x402 merchant test server

## Capability summary

### Client (payer) side

| Command | Flags | Purpose |
|---|---|---|
| `x402-supported` | (no flags) | Query Facilitator for supported schemes/networks |
| `x402-discover` | `--url <url>` | Probe URL for payment requirements (no pay) |
| `x402-pay` | `--url <url> --private-key 0x… [--max-payment 5.0]` | Pay an x402-protected resource (default max **1.0 USDC**) |

### Merchant (receiver) side

| Command | Flags | Purpose |
|---|---|---|
| `x402-register` | `--private-key 0x… [--save] [--name myagent]` | Register wallet → HMAC credentials |
| `x402-verify` | `--payload '{…}' --requirements '{…}' --name myagent` | Verify payment signature (no on-chain action) |
| `x402-settle` | `--payload '…' --requirements '…' --name myagent` | Settle on-chain (USDC transfer) |
| `x402-server` | `--pay-to 0x… --price 0.001 [--port 9000] [--path /api/data] [--dev | --name myagent]` | Run a paid HTTP server |

`x402-server` exposes:
- `/api/free` — free, returns 200
- `<paid-path>` — 402 → verify payment → 200

## Protocol references

| Item | Value |
|---|---|
| Facilitator URL | `https://morph-rails.morph.network/x402` |
| USDC (Morph) | `0xCfb1186F4e93D60E60a8bDd997427D1F33bc372B` (6 decimals, FiatTokenV2.2) |
| Chain | Morph Mainnet (Chain ID `2818`) |
| Protocol | x402 v2 (`"x402Version":2`) — Coinbase open standard for HTTP 402 payment |
| Scheme | `"scheme":"exact"` |
| Auth type | EIP-3009 gasless USDC transfer authorization |
| HMAC headers | `MORPH-ACCESS-KEY` / `MORPH-ACCESS-SIGN` / `MORPH-ACCESS-TIMESTAMP` |
| Credential storage | `~/.morph-agent/x402-credentials/` (encrypted with AES-256-GCM) |

## Safety rules (from upstream)

1. `x402-pay` enforces `--max-payment` (default **1.0 USDC**). Amounts
   exceeding the limit are rejected before signing.
2. Always confirm with the user before executing `x402-pay` — show amount,
   recipient, and URL.
3. `x402-register` only shows `secretKey` on first creation. **If `--save` is
   not used, the key is lost.**
4. Private keys are used locally for signing only — never sent to any API.
5. EIP-7702 delegated EOAs using legacy SimpleDelegation may fail during x402
   settlement (USDC contract `isValidSignature` checks). Verify with
   `7702-delegate` ([morph-7702](./morph-7702)) first.

## Which commands need a private key

- **Require** `--private-key`: `x402-pay`, `x402-register`
- **Do not** require `--private-key` (work with any wallet type):
  `x402-discover`, `x402-supported`, `x402-verify`, `x402-settle`, `x402-server`

## Cross-skill integration

- [morph-identity](./morph-identity) — `agent-register` creates the agent
  identity; `x402-register` makes its wallet a payment recipient
- [morph-wallet](./morph-wallet) — `token-balance --token USDC` to check USDC
  balance before paying
- [morph-7702](./morph-7702) — check with `7702-delegate` first; legacy
  SimpleDelegation EOAs may break x402 settlement
- [BGW ↗](https://github.com/morph-l2/morph-skill/blob/main/docs/social-wallet-integration.md):
  x402 pay with Social Login Wallet uses agent orchestration
  (`x402-discover` here → BGW signs EIP-3009 → agent replays with
  `PAYMENT-SIGNATURE` header)
