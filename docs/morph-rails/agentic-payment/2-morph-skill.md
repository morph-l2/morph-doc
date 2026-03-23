---
title: Morph Skill Hub
lang: en-US
keywords: [morph,skill hub,AI agent,payment skills,registry,modular framework]
description: Morph Skills is an extensible, modular framework of self-contained modules that teach AI agents how to perform payment-related tasks on Morph.
---

## What is Morph Skill?

Morph Skills is an extensible, modular framework designed to enhance the capabilities of the Morph ecosystem. At its core, a Skill is a self-contained, context-aware module — similar to a smart contract or a specialized agent — that can be deployed within or alongside the Morph network. These skills encapsulate complex on-chain and off-chain functionalities behind a simple, standardized interface, allowing them to perform sophisticated operations efficiently. Powered by Morph's high-throughput and low-latency infrastructure, they can handle everything from automated cross-chain asset management and data oracle integrations to custom protocol extensions.

In simple terms, a Skill is a modular package that teaches an AI agent how to carry out specific payment-related tasks on Morph — such as checking balances, sending payments, swapping tokens, querying transactions, and more.

## Why Skills Instead of SDKs?

Traditional SDKs are designed for human developers who read documentation, write code, and debug errors. AI agents operate differently: they need structured, machine-readable instructions with clear input/output contracts. Skills provide exactly this — a self-contained package of capabilities that an agent can discover, install, and execute without human guidance.

## Core Skills Available

| Skill | Description |
|-------|-------------|
| `morph-wallet` | Create wallets, check balances, transfer tokens |
| `morph-swap` | DEX trading via BulbaSwap (swap, liquidity, price queries) |
| `morph-bridge` | Cross-chain asset bridging |
| `morph-altfee` | Gas abstraction with ERC-20 tokens |
| `morph-explorer` | On-chain data queries (tx, blocks, tokens) |

To explore more Skills and view the full documentation, please visit [GitHub](https://github.com/morph-l2/morph-skill).
