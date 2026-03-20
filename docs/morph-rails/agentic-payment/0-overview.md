---
title: Agentic Payment
lang: en-US
keywords: [morph,agentic payment,AI agent,x402,MCP,skill]
description: Agentic Payment is the AI-native payment layer of Morph Rails, enabling autonomous AI agents to discover, negotiate, and execute payments programmatically.
---

## Overview

Agentic Payment is the AI-native layer of Morph Rails. While Middleware Services target human developers and merchant systems via SDK/API, Agentic Payment targets autonomous AI agents via Skills, CLI, and MCP (Model Context Protocol).

The core insight: **AI agents don't use dashboards. They don't click buttons.** They need payment infrastructure that speaks their language — protocols, tool calls, and machine-readable interfaces.

## Components

| Component | Description | Interface |
|-----------|-------------|-----------|
| [x402 Facilitator](./x402-facilitator) | HTTP 402-based payment protocol for programmatic payments | HTTP 402 / MCP |
| [Morph Skill Hub](./morph-skill) | Registry and distribution platform for AI agent payment skills | Skills CLI |
| [Morph Rails CLI](./morph-rails-cli) | Command-line interface for agent and automation workflows | CLI (JSON) |
| [MCP Server](./mcp) | Model Context Protocol server for AI framework integration | MCP Protocol |

## Supported ERC Standards

- **ERC-4337** — Account Abstraction. Enables smart contract wallets for agents, supporting batch transactions, session keys, and programmable spending limits.
- **ERC-8004** — Native asset transfer standard optimized for payment flows.
- **ERC-7715** — Permission delegation. Allows agent owners to grant limited spending authority to agents without exposing private keys.
- **ERC-8021** — Agent-to-agent payment coordination protocol (early-stage).
