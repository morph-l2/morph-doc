---
title: Reference Key
lang: en-US
keywords: [morph,reference key,reconciliation,payment,merchant]
description: Reference Key is a merchant-facing order identifier that links directly to on-chain transaction records for payment reconciliation.
---

:::info
Reference Key will be available after the mainnet launch in April 2026.
:::

## Overview

On-chain transactions are identified by transaction hashes — opaque 64-character hex strings with no business context. When a merchant receives a payment, they cannot easily link it to a specific order, customer, or invoice. Reconciliation becomes a manual, error-prone process of matching blockchain records against internal databases.

**Reference Key** is a merchant-facing order identifier that links directly to on-chain transaction records. Merchants attach a human-readable Reference Key to any payment, then use it to query associated transaction history on Morph.

## How It Works

1. The merchant generates a Reference Key (e.g., `ORD-2026-03-17-001`) and includes it in the payment request.
2. The Reference Key is embedded in the transaction's metadata (calldata or event logs) during on-chain settlement.
3. Post-settlement, the merchant (or their system) queries the Morph Rails API with the Reference Key to retrieve the full transaction record.
4. The API returns: transaction hash, block number, timestamp, amount, sender, recipient, gas cost, and confirmation status.

## Use Cases

### Settlement Reconciliation

Automatically match on-chain payments to internal orders. Export records as CSV for accounting.

### Dispute Resolution

When a customer disputes a charge, the merchant can pull the immutable on-chain record tied to the Reference Key as proof of payment.

### Audit Trail

On-chain transaction records linked to business identifiers provide a tamper-proof audit trail for compliance and financial reporting.

### Multi-Payment Orders

A single order may involve multiple on-chain transactions (e.g., partial payments, refunds). The Reference Key groups them together.

## Key Properties

- **Merchant-defined** — The merchant controls the key format and namespace. No collision risk across merchants.
- **Immutable linkage** — Once a Reference Key is attached to an on-chain transaction, the association is permanent and verifiable.
- **Queryable** — Full CRUD API for Reference Key management and transaction lookup.
