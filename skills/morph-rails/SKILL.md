---
name: morph-rails
description: "Morph Rails programmable payment middleware on Morph L2: permissionless PayFi stack, non-custodial settlement, AltFee gas abstraction in Rails flows, Reference Key reconciliation, Agentic Payment (x402 + Skill Hub). Use when the user asks what Morph Rails is, PayFi on Morph, payment infrastructure vs raw chain ops, merchant/agent payment rails, or how Rails pieces fit together — not for deep AltFee signing or full x402 CLI/API tables (see linked docs under Single Source of Truth / Sub-topics)."
last_verified: 2026-04-20
verified_against:
  - docs/morph-rails/0-overview.md
  - docs/about-morph/morph-rails.md
  - docs/morph-rails/infra-solutions/1-altfee.md
  - docs/morph-rails/infra-solutions/2-reference-key.md
  - docs/morph-rails/agentic-payment/1-x402-facilitator.md
  - docs/morph-rails/agentic-payment/2-morph-skill.md
---

# Morph Rails (Execution Playbook)

## Single Source of Truth

| Topic | In-repo path |
|-------|--------------|
| Overview & narrative (open infrastructure, modules) | `docs/about-morph/morph-rails.md` |
| Architecture & typical transaction flows (merchant / AI Agent) | `docs/morph-rails/0-overview.md` |
| Infrastructure capability: AltFee | `docs/morph-rails/infra-solutions/1-altfee.md` |
| Infrastructure capability: Reference Key | `docs/morph-rails/infra-solutions/2-reference-key.md` |
| Agentic: x402 Facilitator integration | `docs/morph-rails/agentic-payment/1-x402-facilitator.md` |
| Agentic: Morph Skill Hub | `docs/morph-rails/agentic-payment/2-morph-skill.md` |

Details and long tables follow the **files above**; this SKILL only provides routing and boundaries to avoid duplicating topic-specific skills.

## What is Morph Rails (one sentence)

**Morph Rails** is a **programmable payment middleware layer** built on Morph: it encapsulates on-chain complexity — gas, monitoring, reconciliation, settlement — into production-grade payment capabilities accessible via SDK / API / CLI / MCP. **Non-custodial** (does not hold user or merchant funds at the middleware layer), **permissionless** access.

## Core Principles (aligned with docs)

- **Programmability** — Payment flows are configurable via SDK, API, CLI, MCP; composable with autonomous Agent orchestration.
- **Non-Custodial** — Settlement happens on-chain; the middleware is an orchestration layer, not a custodian.
- **Permissionless** — No approval process, no minimum transaction volume (consistent with `0-overview` narrative).
- **Full-Stack** — Includes infrastructure services, middleware, Agent toolchain, and merchant-side capabilities (vs "protocol only" solutions).

## Typical Workflows (for explaining "the full Rail" to users)

**Merchant payment receipt (Transaction Flow in docs):**
Payment app initiates → Rails interface → risk/compliance check → **AltFee** pays gas with stablecoins → transaction carries **Reference Key** → on-chain settlement on Morph → merchant reconciles with Reference Key.

**AI Agent paying for API:**
Skill Hub / discovery endpoint → HTTP `402 Payment Required` → **x402 Facilitator** constructs and signs payment → **AltFee** pays gas with USDC etc. (zero ETH possible) → resource returned after on-chain settlement (see `0-overview`).

## Sub-topics → Specific Skills / Docs

| User question focus | Open first |
|---------------------|------------|
| Rails overview, architecture diagram, who it's for | `docs/morph-rails/0-overview.md`, `docs/about-morph/morph-rails.md` |
| HTTP 402, Facilitator, HMAC, merchant credentials, CLI `x402-*` | `docs/morph-rails/agentic-payment/1-x402-facilitator.md` |
| Transaction type `0x7f`, `feeTokenID` / `feeLimit`, Viem/Ethers signing | `docs/about-morph/10-altfeetx.md`, `docs/morph-rails/infra-solutions/1-altfee.md` |
| JS/TS client, chain preset, npm packages | **`skills/morph-js-sdk/SKILL.md`** |
| Merchant order reconciliation, on-chain reference lookup | `docs/morph-rails/infra-solutions/2-reference-key.md` (check the page for mainnet availability timeline) |
| Agent-side Skill list, `morph-wallet` / `morph-altfee` etc. | `docs/morph-rails/agentic-payment/2-morph-skill.md`, [morph-skill GitHub](https://github.com/morph-l2/morph-skill) |

## Common Boundary Confusion

- **Morph Rails ≠ x402 only**: x402 is one key protocol for **Agent-to-Agent micropayments** within the Rails ecosystem; use this skill when discussing the full payment stack, and open **`1-x402-facilitator.md`** for verify/settle/HMAC/CLI details.
- **Morph Rails ≠ full AltFee spec**: Rails docs mention "pay gas with USDC"; for transaction fields and signing details, refer to **`10-altfeetx.md`**, **`1-altfee.md`**, and the AltFee technical sections linked from those pages.
- **Morph Skill (Hub / morph-skill repo) ≠ this repo's Agent Skills**: the former is an on-chain/Agent-side capability module; the **`skills/`** directory in this repo contains SKILL documentation for IDE/model tools — do not conflate the two.

## Execution Steps (model)

1. Determine if the user wants the "full picture" or a "sub-protocol/sub-feature" — full picture: only read this SKILL + `0-overview`; otherwise redirect to the topic-specific skill.
2. For addresses, chain IDs, contract lists, use **morph-contracts** (if installed) or `docs/` contract chapters — do not hardcode from memory.
3. Before delivering: verify Rails is described as non-custodial and permissionless; verify the split between x402/AltFee responsibilities is clear.

## Self-Check

- [ ] Does it point to `docs/morph-rails/0-overview.md` or `docs/about-morph/morph-rails.md` as the full-picture source of truth?
- [ ] Does it clarify that x402 is one component of Rails, and redirect details to **`1-x402-facilitator.md`**?
- [ ] Does it clarify that AltFee is a common Rails capability, and redirect signing/type details to **`10-altfeetx.md`** / **`1-altfee.md`**?
- [ ] Does it distinguish Morph Skill Hub (product) from the `skills/` Agent Skills in this repo?
- [ ] Does Reference Key remind the reader to check availability and API description in `2-reference-key.md`?
- [ ] Does it avoid repeating the long x402 Facilitator API table inside the SKILL (readers should open `1-x402-facilitator.md`)?
