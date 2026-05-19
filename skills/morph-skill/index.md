---
title: Morph Skill
sidebar_label: Overview
slug: /morph-skill
description: AI Agent skill pack for the Morph L2 protocol layer — wallet, explorer, DEX, bridge, alt-fee, identity, EIP-7702, and x402 — wrapping `morph_api.py` from the morph-l2/morph-skill repo.
---

# Morph Skill

Mirrored documentation for the AI Agent skill pack at
[`morph-l2/morph-skill`](https://github.com/morph-l2/morph-skill). Each page
below is a routable summary; the upstream `SKILL.md` files remain the single
source of truth (linked at the top of every page).

## What this is

`morph-skill` is the **Morph protocol and business layer** for AI agents — a
Python CLI (`scripts/morph_api.py`) that lets agents like Claude Code, Cursor,
Windsurf, and Cline interact with Morph L2 through natural language. All
commands output JSON; all amounts are human-readable (`0.1` ETH, not wei).

It is **not** a wallet product. The wallet product / signing layer is
[BGW ↗](https://github.com/bitget-wallet-ai-lab/bitget-wallet-skill) — Bitget
Wallet's Social Login Wallet skill pack (TEE-backed signing). See
[Role boundary](#role-boundary) below for how to decide which side handles
what.

## Skills in this pack

| Skill | What it does |
|---|---|
| [morph-wallet](/skills/morph-skill/morph-wallet) | Local key wallet — create, balance, transfer, tx receipt |
| [morph-explorer](/skills/morph-skill/morph-explorer) | On-chain reads via Blockscout — address / tx / token / contract |
| [morph-identity](/skills/morph-skill/morph-identity) | EIP-8004 agent identity & reputation |
| [morph-dex](/skills/morph-skill/morph-dex) | Swap on Morph via Bulbaswap aggregator |
| [morph-bridge](/skills/morph-skill/morph-bridge) | Cross-chain swap across 6 chains (Bulbaswap) |
| [morph-7702](/skills/morph-skill/morph-7702) | EIP-7702 EOA delegation, atomic batch (tx `0x04`) |
| [morph-x402](/skills/morph-skill/morph-x402) | x402 HTTP payment protocol — pay / receive USDC |
| [morph-altfee](/skills/morph-skill/morph-altfee) | Pay gas in non-ETH tokens (tx `0x7f`) |

## Role boundary

> Before executing any Morph workflow, decide whether the user is asking for:
> a **Morph protocol/business** task, a **wallet / Social Login Wallet** task,
> or a **combined** flow that needs both.
>
> This repo is the **Morph protocol and business layer**. BGW should be
> treated as the **wallet product and signing layer**.

`morph-skill` owns: wallet RPC operations, explorer queries, DEX quotes,
bridge quotes/orders, alt-fee, EIP-8004 identity & reputation, EIP-7702
delegation, x402 pay/receive.

BGW owns: Social Login Wallet (TEE signing — keys never leave the TEE), swap
execution across chains (including Morph) for Social Login Wallet users,
token discovery, market data, security audits.

This repo **does not** call BGW scripts, embed BGW tooling, or manage BGW
sessions at runtime.

For combined Morph + BGW flows, see
[`docs/social-wallet-integration.md` ↗](https://github.com/morph-l2/morph-skill/blob/main/docs/social-wallet-integration.md).

## Routing table

| User need | Use |
|---|---|
| Local private-key wallet on Morph | Morph skills |
| Explorer, swap, bridge, alt-fee, identity, reputation on Morph (with local key) | Morph skills |
| EIP-7702 delegation, batch calls (with local key) | Morph skills |
| x402 payment (pay or receive USDC, with local key) | Morph skills |
| x402 discover / verify / settle / server (no signing needed) | Morph skills |
| Social Login Wallet, TEE signing, market data, token discovery | BGW skills |
| Swap / bridge execution with Social Login Wallet (incl. on Morph) | **BGW skills** — BGW supports Morph chain natively with TEE signing |
| Social Login Wallet + Morph protocol reads | BGW for address, then Morph for reads |
| x402 pay with Social Login Wallet | Agent orchestration: Morph `x402-discover` → BGW signs EIP-3009 → Agent replays with `PAYMENT-SIGNATURE` header |
| EIP-7702 batch with Social Login Wallet | Agent orchestration: Morph computes hashes → BGW signs via TEE → Agent assembles and broadcasts |

**Single-pass rule:** pick one mode at task start and stay in it. Do not
bounce between BGW and Morph more than once for the same task.

## Install

```bash
git clone https://github.com/morph-l2/morph-skill.git
cd morph-skill
pip install requests eth_account eth_abi eth_utils
python3 scripts/morph_api.py <command> [options]
```

No API keys required for queries. Bridge order management requires JWT
authentication via `bridge-login`.

For Claude Code, Cursor, Windsurf, Cline, and Dify integration, see the
[upstream README ↗](https://github.com/morph-l2/morph-skill#readme).

## Data sources

| Source | URL |
|---|---|
| Morph RPC | `https://rpc.morph.network/` |
| Explorer API (Blockscout) | `https://explorer-api.morph.network/api/v2` |
| DEX / Bridge API (Bulbaswap) | `https://api.bulbaswap.io` |
| x402 Facilitator | `https://morph-rails.morph.network/x402` |
| Hoodi testnet RPC | `https://rpc-hoodi.morph.network` |

ABIs for `IdentityRegistry` and `ReputationRegistry` are bundled locally in
the repo at `contracts/`.

## See also

- Native L1↔L2 bridge (deposit / withdraw via `L1GatewayRouter`,
  `proveAndRelayMessage`): [Morph Bridge (L1↔L2)](/skills/morph-bridge/SKILL)
- [Morph Skills overview](/skills/) — the full skill catalog for this site
- Upstream changelog: [`CHANGELOG.md` ↗](https://github.com/morph-l2/morph-skill/blob/main/CHANGELOG.md)
