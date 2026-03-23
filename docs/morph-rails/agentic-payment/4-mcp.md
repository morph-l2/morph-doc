---
title: MCP (Model Context Protocol)
lang: en-US
keywords: [morph,MCP,model context protocol,AI agent,payment tools]
description: Morph Rails exposes a MCP-compatible server that provides payment tools to any MCP-enabled AI agent, enabling native discovery and invocation of payment operations.
---

:::info
Morph Rails MCP Server is currently under development. Documentation will be updated upon release.
:::

## What is MCP?

Model Context Protocol (MCP) is an open standard for connecting AI models to external tools and data sources. It provides a structured way for AI agents to discover, authenticate, and invoke capabilities — including payment operations.

## Why MCP for Payments?

MCP solves the "last mile" problem of agent payments. An AI agent running inside Claude, GPT, or any LLM framework can natively discover and invoke Morph payment tools without custom integration code. The agent's runtime handles tool discovery, parameter validation, and response parsing automatically.

## Morph Rails MCP Server

Morph Rails exposes a MCP-compatible server that provides payment tools to any MCP-enabled AI agent:

```json
{
  "tools": [
    {
      "name": "morph_pay",
      "description": "Send a payment on Morph L2",
      "parameters": {
        "to": "Recipient address",
        "amount": "Payment amount (human-readable)",
        "token": "Token symbol (USDC, USDT, BGB)",
        "reference_key": "Optional merchant order ID"
      }
    },
    {
      "name": "morph_balance",
      "description": "Check token balance for an address",
      "parameters": {
        "address": "Wallet address",
        "token": "Token symbol"
      }
    },
    {
      "name": "morph_x402_pay",
      "description": "Execute an x402 payment for a paid HTTP resource",
      "parameters": {
        "url": "The 402-protected resource URL",
        "max_amount": "Maximum payment amount willing to pay"
      }
    },
    {
      "name": "morph_swap",
      "description": "Swap tokens via BulbaSwap DEX",
      "parameters": {
        "from_token": "Source token",
        "to_token": "Destination token",
        "amount": "Amount to swap"
      }
    }
  ]
}
```

## Integration Flow

1. The AI agent's runtime discovers the Morph Rails MCP server.
2. Available payment tools are loaded into the agent's tool registry.
3. When the agent needs to make a payment, it invokes the appropriate MCP tool.
4. The MCP server validates parameters, constructs the transaction, and submits it on-chain.
5. The result (tx hash, confirmation, balance update) is returned to the agent.

## Key Advantages Over Direct API Calls

- **Standardized discovery** — Agents don't need to know Morph-specific APIs. They discover tools via MCP.
- **Runtime-managed auth** — Wallet keys and signing are handled by the MCP server, not by the agent's prompt context. This prevents key leakage.
- **Composable** — MCP tools can be chained. An agent can check balance → swap tokens → make payment → verify receipt in a single reasoning chain.
- **Framework-agnostic** — Works with any MCP-compatible runtime (Claude, OpenAI Agents SDK, LangChain, etc.).
