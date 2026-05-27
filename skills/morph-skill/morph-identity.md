---
name: morph-identity
version: 1.4.0
description: "EIP-8004 agent identity and reputation on Morph — register agents, query metadata, submit and read feedback. Agents are represented as ERC-721 NFTs (numeric agent_id). Use when the user asks to register an agent, query an agent's wallet/metadata/reputation, leave feedback, or manage agent settings."
last_verified: 2026-05-19
verified_against:
  - https://github.com/morph-l2/morph-skill/blob/main/skills/morph-identity/SKILL.md
upstream_repo: https://github.com/morph-l2/morph-skill
---

# Morph Identity (EIP-8004)

On-chain agent identity and reputation on Morph L2 via EIP-8004. Each agent is
an ERC-721 token; `agent_id` is a numeric token ID (e.g. `1`, `42`).

## Canonical reference

[`skills/morph-identity/SKILL.md` ↗](https://github.com/morph-l2/morph-skill/blob/main/skills/morph-identity/SKILL.md)

## When to use

- Register an agent identity on-chain (`agent-register`)
- Query an agent's wallet, metadata, reputation, or full review history
- Submit / revoke feedback for an agent; append an owner response
- Manage an agent's metadata, URI, or operational wallet binding

## Capability summary

### Reads (no private key)

| Command | Flags | Purpose |
|---|---|---|
| `agent-wallet` | `--agent-id <id>` | Read the agent's payment wallet |
| `agent-metadata` | `--agent-id <id> --key name` | Read a metadata value by key |
| `agent-reputation` | `--agent-id <id> --tag1 quality` | Aggregate reputation summary |
| `agent-reviews` | `--agent-id <id> [--include-revoked]` | All recorded feedback entries |

### Writes (require `--private-key`)

| Command | Flags | Purpose |
|---|---|---|
| `agent-register` | `--name "MorphBot" --agent-uri "https://…" --metadata role=assistant,team=research --private-key 0x…` | Register an agent identity (mints ERC-721 NFT) |
| `agent-feedback` | `--agent-id <id> --value 4.5 --tag1 quality --feedback-uri "https://…" --private-key 0x…` | Submit feedback for an agent |
| `agent-set-metadata` | `--agent-id <id> --key "role" --value "assistant" --private-key 0x…` | Set a metadata key=value |
| `agent-set-uri` | `--agent-id <id> --uri "https://…" --private-key 0x…` | Update the agent URI |
| `agent-set-wallet` | `--agent-id <id> --new-wallet-key 0xNewKey --private-key 0xOwnerKey` | Bind a new operational wallet |
| `agent-unset-wallet` | `--agent-id <id> --private-key 0x…` | Unbind the operational wallet |
| `agent-revoke-feedback` | `--agent-id <id> --feedback-index 0 --private-key 0x…` | Revoke previously submitted feedback |
| `agent-append-response` | `--agent-id <id> --client 0xClientAddr --feedback-index 0 --response-uri "https://…" --private-key 0x…` | Append owner response to a feedback entry |

`agent-register` and `agent-feedback` accept `--fee-token-id` to pay gas in an
alt token (see [morph-altfee](./morph-altfee)).

## Contracts (Morph Mainnet)

| Contract | Default address | Override env var |
|---|---|---|
| IdentityRegistry | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` | `MORPH_IDENTITY_REGISTRY` |
| ReputationRegistry | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` | `MORPH_REPUTATION_REGISTRY` |

Network env overrides: `MORPH_RPC_URL`, `MORPH_CHAIN_ID`. ABIs bundled at
`contracts/IdentityRegistry.json` and `contracts/ReputationRegistry.json`.
Hoodi testnet supported via the env overrides.

## Safety rules (from upstream)

1. Always confirm with the user before executing `agent-register` — display
   name, URI, and metadata before signing.
2. Always confirm with the user before executing `agent-feedback` — display
   agentId, score, tags before signing.
3. Always confirm before executing any other write command — display agentId
   and the updated fields before signing.
4. Private keys are used locally for signing only — never sent to any API.
5. Read-only commands (`agent-wallet`, `agent-metadata`, `agent-reputation`,
   `agent-reviews`) require no private key.

## EIP-712 caveat (`agent-set-wallet`)

The signed payload must match `AgentWalletSet(agentId,newWallet,owner,deadline)`
on `ERC8004IdentityRegistry`, and the deadline must stay within the contract's
**5-minute window**.

## Cross-skill integration

- [morph-wallet](./morph-wallet) — `balance` to check ETH for gas;
  `tx-receipt` to inspect logs if `agent-register` times out
- [morph-altfee](./morph-altfee) — `--fee-token-id` on `agent-register` /
  `agent-feedback`
- [morph-x402](./morph-x402) — after `agent-register`, run
  `x402-register --save` to make the agent wallet a payment recipient;
  `x402-server` exposes a paid endpoint
- [BGW ↗](https://github.com/morph-l2/morph-skill/blob/main/docs/social-wallet-integration.md)
  (Social Login Wallet) users can do reads after resolving their address from
  BGW, but **cannot execute identity writes through this skill today**
