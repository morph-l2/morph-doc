---
title: Morph Skill Hub
lang: en-US
keywords: [morph,skill hub,AI agent,payment skills,registry]
description: Morph Skill Hub is a registry and distribution platform for AI agent payment skills, providing modular packages that teach agents how to perform payment operations.
---

## What is Morph Skill Hub?

Morph Skill Hub is a registry and distribution platform for AI agent payment skills. A "skill" is a modular package that teaches an AI agent how to perform specific payment operations on Morph — check balances, send payments, swap tokens, query transactions, and more.

## Why Skills Instead of SDKs?

Traditional SDKs are designed for human developers who read documentation, write code, and debug errors. AI agents operate differently: they need structured, machine-readable instructions with clear input/output contracts. Skills provide exactly this — a self-contained package of capabilities that an agent can discover, install, and execute without human guidance.

## Core Skills

| Skill | Description |
|-------|-------------|
| `morph-wallet` | Create wallets, check balances, transfer tokens |
| `morph-swap` | DEX trading via BulbaSwap (swap, liquidity, price queries) |
| `morph-bridge` | Cross-chain asset bridging |
| `morph-altfee` | Gas abstraction with ERC-20 tokens |
| `morph-explorer` | On-chain data queries (tx, blocks, tokens) |
| `morph-x402` | x402 payment protocol integration |

## Skill Discovery & Installation

```bash
# Search for available skills
morph-skills find "payment"

# Install a skill
morph-skills add morph/morph-skill@morph-wallet

# List installed skills
morph-skills list
```

## Skill Architecture

Each skill is a self-contained directory containing:

```
morph-wallet/
├── SKILL.md          # Machine-readable capability description and usage instructions
├── scripts/          # Executable scripts (Python/JS) for on-chain operations
├── references/       # Context documents, examples, and best practices
└── _meta.json        # Version, author, and dependency metadata
```

- **`SKILL.md`** — The primary interface for AI agents. Contains structured descriptions of available actions, required parameters, expected outputs, and usage examples.
- **`scripts/`** — Executable logic that performs on-chain operations. Skills abstract blockchain complexity so agents don't need to construct raw transactions.
- **`references/`** — Supporting documentation including contract ABIs, token lists, and best practices.
- **`_meta.json`** — Metadata for versioning, dependency resolution, and skill discovery.
