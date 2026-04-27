---
name: morph-dapp-planning
description: "Morph dApp planning: turn a product requirement (optionally + API doc + Figma URL) into a testable Morph dApp planning document covering Goals, Test Cases, Target Files, and Morph chain/contract/SDK constraints. Use when the user provides a Morph product requirement, feature description, API doc, or Figma link and wants to draft or revise planning output before coding. Trigger on requests to break a requirement into a buildable plan, planning work, or to align product inputs × API × Figma. Not for generating implementation code (see morph-dapp-codegen)."
last_verified: 2026-04-27
verified_against:
  - docs/build-on-morph/sdk/js-sdk.mdx
  - docs/build-on-morph/developer-resources/1-contracts.md
  - docs/build-on-morph/build-on-morph/4-understand-transaction-cost-on-morph.md
  - skills/morph-js-sdk/SKILL.md
  - skills/morph-contracts/SKILL.md
  - skills/morph-tx-cost/SKILL.md
---

# Morph dApp Planning

Turn a single requirement (a written product brief, a verbal description, or product
brief + API + Figma bundle) into a **planning document** that downstream development and
review skills can consume.
Default output file: `<repo-root>/planning/<feature-id>.md`.

## When to use

- The user described a new feature or iteration but has no planning document yet.
- The user provided product brief / API doc / Figma links together and wants to align
  all three before coding.
- An existing planning document needs an incremental update due to a requirement change.

Do **not** use this skill to produce implementation code — hand off to
`morph-dapp-codegen`.

## Prerequisites (minimum info to gather)

Before writing, confirm the items below. If anything is missing, ask the user **once** in
a single AskQuestion round — do not guess as you write:

- **Target network**: Mainnet (chainId `2818`) / Hoodi Testnet (`2910`) / both.
- **Tech stack**: contracts (Solidity / Hardhat / Foundry) / JS SDK (viem / ethers v6 /
  ethers v5) / frontend (React / Next.js) / node operations.
- **Alt Fee involvement**: yes → the planning document must explicitly state how
  `feeTokenID` is chosen (Token Registry) and, if the product sets one, how `feeLimit` is sourced (optional at protocol level; set for an explicit user cap in-app).
- **Product × API × Figma cross-check needed**: when the user only supplies a single
  written brief, skip Stage 2 and just do single-source extraction.

## Execution Steps

### 1. Extract from all inputs in parallel (only when multiple inputs are provided)

Process inputs in parallel, not sequentially. File each into a draft using the structure
below:

- **Product brief**: module → fields (source: API / i18n / hard-coded) → interactions →
  empty/error states → open questions
- **API doc**: endpoint URL/method/auth → request params → full response field tree →
  server-side defaults
- **Figma**: module → UI elements → dynamic-content mapping → visual specs (color tokens,
  font sizes, spacing, radii) → state frames (default / loading / empty / error)

For Figma, prefer the Figma MCP (`get_design_context` + `get_screenshot`); without MCP,
ask the user for key screenshots.

### 2. Cross-check the three sources, output a contradiction list

Run only when ≥2 inputs exist. Tag every finding with a severity:

- 🔴 **Blocker**: clear contradiction or critical missing info — must be resolved before
  coding
- 🟡 **Needs confirmation**: ambiguity or inconsistency — needs sign-off from product /
  design / backend
- ✅ **Aligned**: ready to flow into Goals

Walk through three pairwise comparisons (source, field name, count, copy, navigation
target, empty/error state, etc.) and aggregate findings into a Markdown table:
`finding type | severity | description | suggested action`.

### 3. Generate the planning document body

Default file path: `planning/<feature-id>.md` (feature-id in lowercase-kebab-case).
Minimum sections:

```markdown
# <Feature Name> Planning

## Context
- Source: <link / summary>
- Target network: mainnet | hoodi | both (chainId 2818 / 2910)
- Stacks involved: contracts | js-sdk | frontend | node
- Alt Fee involved: yes | no

## Goals
- G1: <verifiable product goal>
- G2: ...

## Non-Goals
- Items explicitly out of scope this round

## Test Cases
- T1: <given … when … then …>
- T2: ...
(Each Goal must map to at least one test case; include error branches.)

## Technical Approach
- Module breakdown, dependencies, key classes/functions
- Morph-specific constraints (see Morph Constraints below)

## Target Files
- impl: <relative path>
- test: <relative path>

## Morph Constraints
- Chain / RPC: presets from morph-network/chain; do not hard-code chainId / RPC
- Contract addresses: take from docs/build-on-morph/developer-resources/1-contracts.md;
  never copy from a public block explorer
- Alt Fee: tx type 0x7f, must pass `feeTokenID` for token gas; `feeLimit` optional; non-Alt-Fee paths
  must NOT include those fields
- L1 data fee: user-visible total gas estimate = L2 EIP-1559 + L1 data fee
  (GasPriceOracle.getL1Fee)

## Open Questions
- Repeat 🔴 / 🟡 items from Stage 2 verbatim, each with an owner

## References
- docs/...
- Sibling skills: morph-js-sdk / morph-contracts / morph-tx-cost
```

### 4. Author the planning document Self-Check (last section)

Append the checklist below as the document's final `## Self-Check` so downstream skills
have verifiable anchors:

- [ ] Every Goal maps to at least one Test Case
- [ ] Test Cases cover at least one error branch
- [ ] Each `Target Files` entry has a paired impl / test path that exists
- [ ] If Alt Fee is involved, the planning document states the source of `feeTokenID`
      (and of `feeLimit` if the product uses an explicit cap)
- [ ] Any contract address, chainId, or RPC mentioned cites an in-repo authoritative
      docs path — no copy from external sources
- [ ] Every 🔴 in Open Questions has an explicit owner; otherwise the planning document is
      not allowed to advance to the next stage

## Self-Check (run immediately after writing)

- Does the output path follow the `planning/<feature-id>.md` convention?
- Are the trigger scenarios in `description` actually reflected in the planning body?
- Was the contradiction list delivered separately (not mixed into the planning body)?
- Do all referenced docs paths actually exist in the repo?

## Related Skills

- `morph-js-sdk`: authoritative SDK fields and Alt Fee usage
- `morph-contracts`: predeployed contract address table
- `morph-tx-cost`: L1 + L2 fee math
- `morph-dapp-codegen`: consumes this planning document for TDD implementation
- `morph-dapp-code-review`: uses the same document as the planning-compliance dimension's
  source of truth
