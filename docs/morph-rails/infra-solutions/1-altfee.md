---
title: AltFee (Gas Abstraction)
lang: en-US
keywords: [morph,altfee,gas abstraction,ERC-20,USDC,payment]
description: AltFee is Morph's native gas abstraction mechanism that allows transactions to pay gas fees in approved ERC-20 tokens instead of ETH.
---

## Overview

Every blockchain transaction requires gas paid in the chain's native token (typically ETH). This creates a critical UX barrier: users and agents must acquire, hold, and manage ETH balances solely for transaction fees. For payment use cases, this is impractical — imagine requiring merchants to hold a separate "fee currency" just to accept credit cards.

**AltFee** is Morph's native gas abstraction mechanism. It allows any transaction to pay gas fees in approved ERC-20 tokens (e.g., USDC, USDT, BGB) instead of ETH.

## How It Works

1. The user constructs a standard EVM transaction.
2. Instead of submitting a Type-2 (EIP-1559) transaction, the client submits a **Type-0x7F transaction** — Morph's custom AltFee transaction type.
3. The transaction includes a `token_id` field specifying which token to use for gas.
4. Morph's sequencer validates the transaction, deducts gas fees from the user's token balance, and executes the transaction.
5. From the user's perspective, the experience is identical to a normal transaction — except no ETH is required.

## Supported Tokens

| Token | Contract Address | Token ID |
|-------|-----------------|----------|
| USDC | `0xe34c91815d7fc18A9e2148bcD4241d0a5848b693` | — |
| BGB | `0x389C08Bc23A7317000a1FD76c7c5B0cb0b4640b5` | 4 |

## Key Properties

- **Zero ETH required** — Users and agents can operate entirely in stablecoins.
- **Native protocol support** — AltFee is implemented at the sequencer level, not as a smart contract wrapper. This means lower gas overhead and higher reliability than relayer-based solutions (e.g., ERC-4337 paymasters).
- **Transparent pricing** — Gas costs are denominated in the chosen token at real-time oracle rates.
- **Composable** — AltFee works with all Morph Rails services. x402 payments, DEX swaps, token transfers — all can use AltFee.

## Competitive Advantage

This is a critical differentiator versus Base and other L2s. On Base, agents must acquire and manage ETH for gas. On Morph, an agent funded with only USDC can operate indefinitely — a fundamentally simpler operational model for autonomous systems.

:::tip
For the full AltFee technical specification including transaction signing procedures and protocol architecture, see the [AltFeeTx Technical Specification](/docs/about-morph/altfeetx).
:::
