---
name: morph-dapp-workflow
description: "Morph dApp end-to-end workflow orchestrator: chain planning → TDD implementation → multi-dimension review for Morph contract / JS SDK / frontend changes. Use when the user asks to take a Morph feature from idea to merge-ready code, runs the full planning-to-review pipeline, or wants a single command that walks through planning output, implementation, and review. Trigger when the user wants to push a Morph requirement straight from product description to mergeable code, or wants an end-to-end pipeline. For atomic tasks, call the matching child skill directly instead of this workflow."
last_verified: 2026-04-27
verified_against:
  - skills/morph-dapp-planning/SKILL.md
  - skills/morph-dapp-codegen/SKILL.md
  - skills/morph-dapp-code-review/SKILL.md
metadata:
  orchestrates:
    - morph-dapp-planning
    - morph-dapp-codegen
    - morph-dapp-code-review
---

# Morph dApp End-to-End Workflow

Run a Morph requirement through three phases: **Planning → Code → Review**. Each phase
hands off to the corresponding child skill's full flow — never copy that content into
this file.

## When to use

- The user brings a complete requirement (written brief / Figma / spoken description) and wants
  it driven all the way to mergeable code in one go.
- A previous phase already produced output (e.g. a planning document exists) and the user wants to
  resume from a middle stage.

Do **not** use for atomic operations — call the matching child skill directly.

## Prerequisites

Confirm the following child skills are loadable in the current IDE / tool (inside the
morph-doc repo, you can read `skills/<id>/SKILL.md` directly):

- `morph-dapp-planning`
- `morph-dapp-codegen`
- `morph-dapp-code-review`

Any missing → stop and point the user at `skills/README.md` to symlink via
`scripts/morph-skill-ln`.

## Execution Steps

### Stage 1 — Planning

1. Hand off to **morph-dapp-planning**'s full flow.
2. Output: `planning/<feature-id>.md` containing Goals / Test Cases / Target Files /
   Morph Constraints / Open Questions / Self-Check.
3. **Gate**: every 🔴 in Open Questions must be cleared or explicitly accepted by the
   user (recorded inline in the planning document). Otherwise stop and wait — do not enter
   Stage 2.

### Stage 2 — Code

1. Pass the Stage 1 planning document path as input and hand off to **morph-dapp-codegen**'s full
   flow.
2. Complete Red → Green → wrap-up; the project's root scripts must pass
   (`npm test` / `forge test` / `tsc --noEmit` as applicable).
3. **Gate**: all tests pass, no lint errors. On failure → stop and return control to
   the user.

### Stage 3 — Review

1. Hand off to **morph-dapp-code-review**'s full flow, using the commit recorded at
   the start of this workflow as the base.
2. Pass the Stage 1 planning document path through so the planning-compliance dimension is enabled.
3. Emit the review report.

### Stage 4 — Wrap-up (handled inside this workflow, not delegated)

1. Aggregate outputs from all three stages (planning document path, changed-file list, review
   report).
2. List blockers (review P0 + still-open 🔴 from the planning document). No blockers → tell the
   user they may proceed to commit/PR. Blockers exist → recommend the inner loop
   "back to Stage 2 to fix P0 → rerun Stage 3"; **never auto commit / push**.

## State and Recovery

Simple rule: each stage's output file IS the state.

| Existing artifact | Inferred phase | Suggested entry |
|---|---|---|
| Only a requirement description | Fresh start | Stage 1 |
| `planning/<feature-id>.md` exists | Planning done | Stage 2 |
| Planning doc + associated impl/tests landed | Code done | Stage 3 |
| All of the above and the code was changed again | Needs re-review | Stage 3 |

No manifest file, no lock. For multi-person collaboration, ask the user to `git pull`
before starting.

## Self-Check

- Did each of the three stages "hand off to the child skill" rather than inline its
  content?
- Was a gate check performed before each transition?
- Does the final output include all three: the planning document path, the changed-file list, and
  the review report?
- Was auto-commit / auto-push avoided?

## Related Skills

- `morph-dapp-planning` / `morph-dapp-codegen` / `morph-dapp-code-review`: the three
  atomic flows orchestrated by this workflow
- `morph-js-sdk` / `morph-contracts` / `morph-tx-cost`: Morph domain fact-tables,
  invoked on demand from inside the child skills
