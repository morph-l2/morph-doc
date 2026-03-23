---
title: Private Transactions
lang: en-US
keywords: [morph,private transactions,privacy,payment,compliance]
description: Morph Rails Private Transactions enable confidential on-chain payments with built-in privacy guarantees without compromising auditability or compliance.
---

:::info
Private Transactions is currently under development and will be available after launch.
:::

## Overview

Public blockchains are radically transparent. Every transaction — amount, sender, recipient — is visible to anyone. For consumer payments and enterprise use cases, this is a dealbreaker. No merchant wants competitors to see their daily revenue. No consumer wants their purchase history exposed on a block explorer.

**Private Transactions** enables confidential on-chain payments with built-in privacy guarantees, without compromising auditability or compliance.

## How It Works

Private Transactions use Morph's privacy-preserving infrastructure to shield sensitive payment data while maintaining on-chain settlement:

### Transaction Shielding

Payment amounts and counterparty addresses are encrypted before submission. Only the sender, recipient, and authorized auditors can decrypt the details.

### Compliance-Compatible Privacy

Unlike fully anonymous systems (e.g., Tornado Cash), Morph's privacy layer supports **selective disclosure**. Merchants can prove transaction details to auditors or regulators without revealing them publicly.

### Privacy-Preserving Index

A specialized indexing service allows authorized parties to query and aggregate private transaction data without exposing individual records. Merchants can generate revenue reports, tax summaries, and audit trails from private transactions.

## Privacy Levels

| Level | Visible On-Chain | Hidden | Use Case |
|-------|-----------------|--------|----------|
| **Public** | Everything | Nothing | Open commerce, donations |
| **Amount-Private** | Sender, recipient | Amount | B2B payments |
| **Full-Private** | Transaction exists | Amount, parties | Consumer payments |
| **Auditable-Private** | To auditors only | Public view | Enterprise compliance |

## Key Properties

- **Selective disclosure** — Merchants choose what to reveal and to whom.
- **Audit-ready** — Regulators and auditors can be granted decryption keys without public exposure.
- **No mixing required** — Privacy is achieved at the transaction level, not through mixing pools.
- **Compatible with Reference Key** — Private transactions can still carry Reference Keys for internal reconciliation.
