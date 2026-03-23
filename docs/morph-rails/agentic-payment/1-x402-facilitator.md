---
title: x402 Facilitator
lang: en-US
keywords: [morph,x402,HTTP 402,payment protocol,AI agent,facilitator]
description: Morph's x402 Facilitator implements the HTTP 402 payment protocol, enabling AI agents and HTTP clients to make programmatic on-chain payments.
---

## What is x402?

x402 is a payment protocol built on the HTTP 402 ("Payment Required") status code — a standard that existed in the HTTP spec since 1999 but was never widely implemented. x402 turns it into a real payment layer for the programmable internet.

When an AI agent (or any HTTP client) requests a paid resource, the server responds with:

```
HTTP/1.1 402 Payment Required
X-Payment-Network: morph
X-Payment-Address: 0xMerchant...
X-Payment-Amount: 1000000
X-Payment-Token: USDC
```

The client automatically constructs a payment transaction, signs it, submits it on-chain, and retries the request with a payment receipt. The server verifies the on-chain payment and serves the resource.

## Morph's x402 Facilitator

Morph's implementation adds critical capabilities on top of the base x402 standard:

### 1. AltFee Integration

x402 payments use AltFee by default. Agents pay in USDC/USDT, never needing ETH for gas. This is a fundamental advantage over Base-native x402, where agents must manage ETH balances.

### 2. Facilitator Service

A middleware component that handles payment verification, receipt validation, and retry logic on behalf of both clients and servers. Developers don't implement x402 from scratch; they integrate the Facilitator.

### 3. Rate Limiting & Abuse Prevention

The Facilitator includes built-in rate limiting and fraud detection. Agents with low reputation scores face higher payment requirements or are throttled.

### 4. Multi-Token Support

Unlike implementations locked to a single stablecoin, Morph's x402 supports USDC, USDT, and BGB, with more tokens addable via governance.

### 5. Settlement Proof

Every x402 payment generates an on-chain settlement proof that both parties can independently verify. No trust required.

## Integration Flow

```
Agent → GET /api/premium-data
Server → 402 Payment Required (USDC 0.01, address 0xABC...)
Agent → Signs tx via x402 Facilitator → Submits on-chain
Agent → GET /api/premium-data + X-Payment-Proof: 0xTxHash...
Server → Verifies on-chain → 200 OK + data
```

## Example

```bash
# Agent requests a paid API endpoint
curl -X GET https://api.example.com/premium-data

# Server responds with 402 and payment details
# HTTP/1.1 402 Payment Required
# X-Payment-Network: morph
# X-Payment-Address: 0xABC...
# X-Payment-Amount: 10000   (0.01 USDC)
# X-Payment-Token: USDC

# Agent uses x402 Facilitator to pay and retry
curl -X GET https://api.example.com/premium-data \
  -H "X-Payment-Proof: 0xTxHash..."

# Server verifies on-chain payment → 200 OK
```
