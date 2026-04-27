---
title: Agent-Driven Development Workflow
lang: en-US
keywords: [morph, dapp, workflow, planning, tdd, code review, agent, skill, cursor, claude, dispatch, router]
description: The single entry point for Morph dApp development via Agent Skills. Dispatches a task — from a raw product idea down to a one-line fact lookup — to the right Morph Skill (morph-dapp-workflow for end-to-end, the child skills for one stage, or the fact-table skills for domain lookups). Designed to be driven by agentic IDEs (Cursor, Claude Code, OpenClaw, Windsurf, Codex).
doc_skill_id: morph-dapp-workflow
---

This page is the **human-readable entry point** for every Morph dApp Agent Skill in this
repo. Think of it as a router: describe what you are about to do, find the row in the
dispatch table below, and go invoke the matching Skill. The orchestrator
[`morph-dapp-workflow`](/skills/morph-dapp-workflow/SKILL) is only one of the destinations
— for small, focused tasks you should jump straight to a child Skill or a fact-table
Skill.

Both humans and Morph-facing agents (Cursor, Claude Code, OpenClaw, Windsurf, Codex) read
from the same source: this page plus the SKILL files under
[`skills/`](https://github.com/morph-l2/morph-doc/tree/main/skills).

## Pick your entry Skill

Scan the left column and pick the first row that matches your task. Each row points to a
single Skill — the Skill then self-describes its own steps.

| If the task is… | Invoke this Skill | Notes |
|---|---|---|
| End-to-end: product brief / Figma / API doc → merge-ready code | [`morph-dapp-workflow`](/skills/morph-dapp-workflow/SKILL) | Orchestrator. Chains the three stages below with a gate after each. |
| Turn requirements into planning output | [`morph-dapp-planning`](/skills/morph-dapp-planning/SKILL) | Outputs `planning/<feature-id>.md` with Goals / Test Cases / Target Files / Morph Constraints. |
| Implement an approved planning document (Red → Green TDD) | [`morph-dapp-codegen`](/skills/morph-dapp-codegen/SKILL) | Requires a planning file. Never auto-commits. |
| Review a diff / PR / working tree | [`morph-dapp-code-review`](/skills/morph-dapp-code-review/SKILL) | Four-dimension review (Security / Performance / Code Quality / Planning compliance), P0/P1/P2. |
| Look up a Morph SDK call or Alt Fee field shape | [`morph-js-sdk`](/skills/morph-js-sdk/SKILL) | Fact table — use from inside the other Skills too. |
| Find a predeployed contract address | [`morph-contracts`](/skills/morph-contracts/SKILL) | Canonical address list. Always prefer this over a block explorer. |
| Compute or display transaction fees (L1 + L2) | [`morph-tx-cost`](/skills/morph-tx-cost/SKILL) | Explains `GasPriceOracle.getL1Fee` and gas math. |
| Route to Morph Rails (Alt Fee, Reference Key, …) | [`morph-rails`](/skills/morph-rails/SKILL) | Product-level rails overview. |
| Install Skills into Cursor / Claude Code / OpenClaw | [`morph-skill-ln`](/skills/morph-skill-ln/SKILL) | Symlink script. |
| Run a Morph full node on a host | [`morph-full-node-run-on-host`](/skills/morph-full-node-run-on-host/SKILL) | Node operations, not dApp dev. |

Rule of thumb: **if there is no planning document yet and the task spans multiple files across
contract / SDK / frontend, start from `morph-dapp-workflow`. Otherwise go to a single
Skill.**

## Quick decision tree

```text
 "I'm about to touch Morph code or docs."
            │
            ▼
 Is this a fact lookup (address / fee / SDK field)?
  ├─ yes  →  morph-contracts / morph-tx-cost / morph-js-sdk
  └─ no
      │
      ▼
 Do I already have a planning document (planning/<id>.md)?
  ├─ no
  │    │
  │    ▼
  │   Is the change 1 file, obvious, no planning document needed?
  │    ├─ yes  →  edit directly (no Skill)
  │    └─ no   →  morph-dapp-workflow  (will call morph-dapp-planning)
  └─ yes
      │
      ▼
 Am I implementing, reviewing, or both?
  ├─ implementing      →  morph-dapp-codegen
  ├─ reviewing a diff  →  morph-dapp-code-review
  └─ both, plus gates  →  morph-dapp-workflow  (resumes at Stage 2)
```

## The end-to-end path: morph-dapp-workflow

When you do invoke the orchestrator, the three stages wire together like this:

```text
   Product brief / Figma / API doc
            │
            ▼
   ┌──────────────────────┐
   │  1. Planning         │   →  morph-dapp-planning
   │  planning/<id>.md    │
   └──────────┬───────────┘
              │   Goals · Test Cases · Target Files · Morph Constraints
              ▼
   ┌──────────────────────┐
   │  2. Code (TDD)       │   →  morph-dapp-codegen
   │  red → green → lint  │
   └──────────┬───────────┘
              │   tests + impl, no auto-commit
              ▼
   ┌──────────────────────┐
   │  3. Review (4-dim)   │   →  morph-dapp-code-review
   │  P0 / P1 / P2        │
   └──────────────────────┘
```

Each arrow is a **gate**: blocking items must be cleared before the next stage runs.
Resuming is implicit — the presence of `planning/<id>.md` (and later, landed tests) tells
the orchestrator where to pick up.

### Stage 1 — Planning

Skill: [`morph-dapp-planning`](/skills/morph-dapp-planning/SKILL)

You bring: a product description (and optionally an API doc + Figma URL).
You get: `planning/<feature-id>.md` containing **Goals**, **Test Cases**, **Target Files**,
**Morph Constraints**, **Open Questions**, and a **Self-Check**.

Morph-specific decisions this stage forces up-front:

| Decision | Why it matters on Morph |
|---|---|
| Mainnet (`2818`) vs Hoodi (`2910`) vs both | Wrong chain breaks signing & RPC |
| Alt Fee path? | If yes, `feeTokenID` must be chosen from the Token Registry; `feeLimit` is optional (set an explicit cap in product code if you need one) |
| Where do contract addresses come from? | Always [`developer-resources/contracts`](../developer-resources/1-contracts.md) — never an external explorer |
| L1 data fee in user-visible totals? | Use `GasPriceOracle.getL1Fee` per [`understand-transaction-cost-on-morph`](./4-understand-transaction-cost-on-morph.md) |

The planning document is not done until every 🔴 *Blocker* in *Open Questions* is resolved or
explicitly accepted. The agent will pause at the gate.

### Stage 2 — TDD Codegen

Skill: [`morph-dapp-codegen`](/skills/morph-dapp-codegen/SKILL)

1. **Red** — write failing tests for every *Test Case* in the planning document, get them to compile.
2. **Green** — implement only files in *Target Files* until the suite passes.
3. **Wrap-up** — run lint / type-check / project test script; reconcile against the
   planning document's *Self-Check* list.

Morph-specific guardrails that the test runner alone cannot enforce:

- Do not hard-code `chainId: 2818` literals — import from `@morph-network/chain` or the
  viem chain export.
- Do not mix `feeTokenID` / `feeLimit` into non-Alt-Fee paths (or vice versa).
- Do not commit on the user's behalf.
- Do not ship private keys or mnemonics in tests or examples.

Inside the `morph-doc` repo the project test entry point is `npm test`
(`scripts/run-tests.mjs`). New `__tests__/*.test.mjs` files **must** be added to
`TEST_FILES` in that script — `run-tests-manifest.test.mjs` enforces it.

### Stage 3 — Code Review

Skill: [`morph-dapp-code-review`](/skills/morph-dapp-code-review/SKILL)

A read-only pass over your `git diff`, scored along four dimensions:

| Dimension | What it catches (Morph-specific subset) |
|---|---|
| **Security** | Predeploy address copied from the wrong place, Mainnet/Hoodi mix-up, `feeTokenID` not in the Token Registry, missing replay protection on bridge messages |
| **Performance** | Per-tx repeat calls to `eth_gasPrice` / `GasPriceOracle.getL1Fee`, no backoff on bridge polling |
| **Code Quality** | `chainId` literals, RPC URLs hard-coded, Alt Fee fields leaking into vanilla EIP-1559 paths, real keys in samples |
| **Planning compliance** | Every planning *Goal* mapped to code, every *Test Case* has an actual test, no extra files outside *Target Files* |

Output is graded **P0 (blocks merge) / P1 (recommended) / P2 (optional)**.

## Driving the flow from your IDE

All Skills live in
[`skills/`](https://github.com/morph-l2/morph-doc/tree/main/skills) in this repo.
Two ways to make them available to your agent:

1. **Inside `morph-doc`** — open this repo in Cursor / Claude Code / OpenClaw / Windsurf
   and the agent loads `skills/*/SKILL.md` automatically.
2. **From any other project** — symlink them into your tool's global skills directory
   using the [`morph-skill-ln`](/skills/morph-skill-ln/SKILL) script:

   ```bash
   ./scripts/morph-skill-ln \
     morph-dapp-planning \
     morph-dapp-codegen \
     morph-dapp-code-review \
     morph-dapp-workflow \
     morph-js-sdk \
     morph-contracts \
     morph-tx-cost
   ```

Once installed, phrase your request so the router can route:

- Whole feature: *"Use morph-dapp-workflow to take this requirement from planning to review-ready
  code."*
- Single stage: *"Use morph-dapp-codegen against `planning/reward-claim.md`."*
- Fact lookup: *"Use morph-contracts to list the L2-side bridge addresses on Hoodi."*

## What this flow deliberately does not do

To stay simple and predictable on a single repo, the Skills intentionally **omit**
features that heavyweight enterprise pipelines often include:

- No snapshot/rollback state machine — your `git` history is the state.
- No checkpoint files, locks, or oscillation detection.
- No automatic commit, push, or PR creation.
- No multi-stack runs in a single invocation — split contract / SDK / frontend into
  separate planning files and run the workflow once per stack.

If you need any of the above, run the underlying Skills manually and orchestrate them in
your own scripts.

## See also

- Planning: [`morph-dapp-planning`](/skills/morph-dapp-planning/SKILL)
- TDD implementation: [`morph-dapp-codegen`](/skills/morph-dapp-codegen/SKILL)
- Multi-dimension review: [`morph-dapp-code-review`](/skills/morph-dapp-code-review/SKILL)
- Domain facts referenced by all three:
  [`morph-js-sdk`](/skills/morph-js-sdk/SKILL),
  [`morph-contracts`](/skills/morph-contracts/SKILL),
  [`morph-tx-cost`](/skills/morph-tx-cost/SKILL)
- Product rails: [`morph-rails`](/skills/morph-rails/SKILL)
- Install Skills into your IDE: [`morph-skill-ln`](/skills/morph-skill-ln/SKILL)
- The doc–skill contract this page follows:
  [`VISION.md`](https://github.com/morph-l2/morph-doc/blob/main/VISION.md)
