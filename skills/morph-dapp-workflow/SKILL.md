---
name: morph-dapp-workflow
description: "Morph dApp end-to-end workflow orchestrator: chain planning → TDD implementation → multi-dimension review for Morph contract / JS SDK / frontend changes. Use when the user asks to take a Morph feature from idea to merge-ready code, runs the full planning-to-review pipeline, or wants a single command that walks through planning output, implementation, and review. Trigger when the user wants to push a Morph requirement straight from product description to mergeable code, or wants an end-to-end pipeline. For atomic tasks, call the matching child skill directly instead of this workflow."
last_verified: 2026-04-30
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

> **One stage per turn.** Complete the current stage, surface its output to the user,
> then **stop and wait for explicit user confirmation** before advancing. Never chain
> stages in a single reply.

### Stage 1 — Planning

1. Read `skills/morph-dapp-planning/SKILL.md` and execute its full flow verbatim.
2. Write `planning/<feature-id>.md` to disk (Goals / Test Cases / Target Files /
   Morph Constraints / Open Questions / Self-Check).
3. **Output to user**: paste the full planning document path and its contents.
4. **Hard stop — mandatory user confirmation gate**:
   - Display: `"Stage 1 complete. Review the planning document above. Reply 'proceed' to advance to Stage 2, or give feedback to revise."`
   - Do **not** write any code, do not enter Stage 2, do not read `morph-dapp-codegen`.
   - Even if the user previously said "run the full pipeline", stop here. The confirmation is required every time.
5. **Before advancing**: verify `planning/<feature-id>.md` exists on disk AND every 🔴 in Open Questions is resolved or explicitly accepted by the user (recorded inline in the document). If either check fails, refuse to proceed.

### Stage 2 — Code

1. Read `skills/morph-dapp-codegen/SKILL.md` and execute its full flow verbatim, passing the Stage 1 planning document path.
2. Complete Red → Green → wrap-up; the project's root scripts must pass
   (`npm test` / `forge test` / `tsc --noEmit` as applicable).
3. **Output to user**: list every changed file and the final test run output.
4. **Hard stop — mandatory user confirmation gate**:
   - Display: `"Stage 2 complete. All tests pass. Reply 'proceed' to advance to Stage 3 (Review), or give feedback to fix."`
   - Do **not** enter Stage 3 until the user replies.
5. **Before advancing**: all tests green, no lint errors. On failure → stop, return the failing stack trace to the user, do not enter Stage 3.

### Stage 3 — Review

1. Read `skills/morph-dapp-code-review/SKILL.md` and execute its full flow verbatim, using the commit recorded at the start of this workflow as the base.
2. Pass the Stage 1 planning document path so the planning-compliance dimension is enabled.
3. **Output to user**: emit the full review report inline.
4. Proceed directly to Stage 4 (no user gate needed between Review and Wrap-up).

### Stage 4 — Wrap-up (handled inside this workflow, not delegated)

1. Aggregate outputs from all three stages (planning document path, changed-file list, review
   report).
2. List blockers (review P0 + still-open 🔴 from the planning document). No blockers → tell the
   user they may proceed to commit/PR. Blockers exist → recommend the inner loop
   "back to Stage 2 to fix P0 → rerun Stage 3"; **never auto commit / push**.

## State and Recovery

Simple rule: each stage's output file IS the state. When resuming, **always confirm the
feature-id with the user first** — do not infer it from whatever planning file happens to
exist on disk.

| Existing artifact | Inferred phase | Suggested entry |
|---|---|---|
| Only a requirement description | Fresh start | Stage 1 |
| `planning/<feature-id>.md` exists **and user confirms it is complete** | Planning done | Stage 2 |
| Planning doc + associated impl/tests landed **and user confirms tests are green** | Code done | Stage 3 |
| All of the above and the code was changed again | Needs re-review | Stage 3 |

Even when resuming from Stage 2 or 3, the per-stage user confirmation gate (step 4 in
each stage) still applies before the next stage starts.

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
