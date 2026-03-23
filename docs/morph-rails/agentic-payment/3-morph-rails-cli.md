---
title: Morph Rails CLI
lang: en-US
keywords: [morph,CLI,command line,AI agent,automation,payment]
description: Morph Rails CLI is a command-line interface that enables AI agents and developers to interact with the full Morph Rails stack from a terminal or script environment.
---

:::info
Morph Rails CLI is currently under development. Documentation will be updated upon release.
:::

## What is Morph Rails CLI?

Morph Rails CLI is a command-line interface that enables AI agents (and developers) to interact with the full Morph Rails stack from a terminal or script environment. While the SDK/API targets web applications, the CLI targets agents running in sandboxed environments, CI/CD pipelines, and automation workflows.

## Key Commands

### Wallet Operations

```bash
morph-cli wallet create
morph-cli wallet balance --address 0x... --token USDC
```

### Payments

```bash
morph-cli pay --to 0xMerchant --amount 10.00 --token USDC --ref "ORD-001"
morph-cli pay --x402 --url https://api.example.com/data
```

### Transaction Queries

```bash
morph-cli tx status --hash 0xABC...
morph-cli tx history --address 0x... --days 7
morph-cli tx lookup --ref-key "ORD-001"
```

### Gas Abstraction

```bash
morph-cli altfee enable --token BGB
morph-cli altfee estimate --to 0x... --amount 10 --token USDC
```

### Token Swap

```bash
morph-cli swap --from USDC --to ETH --amount 100
morph-cli swap quote --from USDC --to ETH --amount 100
```

## Design Principles

- **JSON output by default** — Every command returns structured JSON, making it trivially parseable by AI agents.
- **Stateless** — No persistent sessions. Every command is self-contained. Agents don't need to manage connection state.
- **AltFee-native** — All transaction commands use AltFee by default. Pass `--gas-token ETH` to override.
- **Dry-run mode** — Add `--dry-run` to any transaction command to simulate without broadcasting.
