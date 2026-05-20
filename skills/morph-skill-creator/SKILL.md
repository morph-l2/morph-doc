---
name: morph-skill-creator
description: "Morph-doc bridge to Anthropic skill-creator: install upstream, validate Morph Skills (inventory + pairing), run description trigger eval loops, and drive behavioral eval/improve cycles for skills/<id>/SKILL.md. Use when testing Skill routing, fixing stale descriptions, benchmarking Skill outputs, or iteratively improving a Morph Skill after drift reports — not for authoring long-form docs (see morph-doc-agent)."
last_verified: 2026-05-20
verified_against:
  - scripts/morph-skill-creator.mjs
  - scripts/lib/skill-creator-path.mjs
  - skills/README.md
  - https://github.com/anthropics/skills/tree/main/skills/skill-creator
---

# morph-skill-creator

Connect **morph-doc** Skills to the upstream **[skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator)** toolkit (eval loops, description optimization, benchmark viewer). Morph-specific metadata (`last_verified`, `verified_against`, `doc_skill_id`) stays governed by **`npm test`** — upstream `quick_validate.py` does not know those fields.

## Single Source of Truth

| Topic | Path |
|-------|------|
| Trigger-eval JSON format & copy-paste example | `scripts/skill-trigger-evals.morph-js-sdk.example.json`, `skills/README.md` § Tuning description trigger rates |
| Morph Skill authoring / audit | `agents/morph-doc-agent.md` |
| Freshness bot (scheduled stale queue) | `scripts/skill-freshness-bot.DESIGN.md` |
| Upstream skill-creator playbook | Install root → `SKILL.md` (Anthropic) |

## When to Use

| Goal | Tool |
|------|------|
| Check install (Python, skill-creator path, optional `claude` CLI) | `npm run skill-creator:check` |
| Install upstream into `vendor/skill-creator` | `npm run skill-creator:install` |
| Static Morph guards for one Skill | `npm run skill-creator:validate -- <skill-id>` |
| **LLM trigger eval** (one-shot `claude -p` per query; needs `claude` CLI) | `npm run skill-creator:run-eval -- <skill-id>` |
| Optimize YAML **`description`** routing (needs `claude` CLI) | `npm run skill-creator:desc-loop -- <skill-id>` |
| Fix facts / execution steps / pairing | `morph-doc-agent` + PR + `npm test` |
| Behavioral eval (outputs, assertions, viewer) | Upstream skill-creator § Running and evaluating test cases + `skills/<id>/evals/evals.json` |

## Prerequisites

1. **Node** — `npm test` from morph-doc root after any Skill edit.
2. **Python 3** + **PyYAML** — `npm run skill-creator:install` creates `.local/skill-creator-venv` (PEP 668–safe); `validate` / `desc-loop` auto-bootstrap the venv if needed.
3. **skill-creator checkout** — one of:
   - `npm run skill-creator:install` → `vendor/skill-creator` (gitignored)
   - User-level: `~/.claude/skills/skill-creator` ([anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/skill-creator))
   - `export MORPH_SKILL_CREATOR_ROOT=/path/to/skill-creator`
4. **`run-eval` / `desc-loop`:** `claude` CLI (see upstream skill-creator). Without it, hand-edit `description` using trigger evals + `npm test`.

## Execution Steps

### Step 0 — Install & check

```bash
npm run skill-creator:install   # once per clone
npm run skill-creator:check
```

### Step 1 — Static validate (always)

```bash
npm run skill-creator:validate -- morph-js-sdk
```

Runs `morph-doc-skill-inventory` + `doc-skill-pairing` for the repo, then optional upstream `quick_validate.py` (may warn on `last_verified` — ignore; trust Morph inventory).

### Step 2 — Trigger eval set (description routing)

Ensure a JSON **array** of `{ "query", "should_trigger" }` exists (≥20 rows, ≥8 true / ≥8 false):

| Priority | Path |
|----------|------|
| 1 | `scripts/skill-trigger-evals.<skill-id>.json` |
| 2 | `scripts/skill-trigger-evals.<skill-id>.example.json` |
| 3 | `skills/<skill-id>/evals/trigger.json` |

Copy from `scripts/skill-trigger-evals.morph-js-sdk.example.json` and tailor queries.

### Step 3 — LLM trigger eval (one shot)

```bash
npm run skill-creator:run-eval -- morph-js-sdk
# optional: pass through run_eval.py flags after --
# npm run skill-creator:run-eval -- morph-js-sdk -- --runs-per-query 1 --num-workers 4
```

Calls upstream `run_eval.py` via `claude -p` (default 3 runs per query). JSON goes to stdout; a copy is saved under `.local/skill-run-eval/<skill-id>/results.json` unless you pass `--out` or set `MORPH_SKILL_CREATOR_RUN_EVAL_OUT`.

### Step 4 — Description optimization loop

```bash
npm run skill-creator:desc-loop -- morph-js-sdk
# optional extra flags after --
# npm run skill-creator:desc-loop -- morph-js-sdk -- --max-iterations 3 --holdout 0.3
```

Results under `.local/skill-desc-opt/<skill-id>/`. Merge printed **`best_description`** into `skills/<id>/SKILL.md`, then:

1. Re-stamp **`last_verified`** if you re-read sources.
2. Run **`npm test`**.

### Step 5 — Behavioral evals (fix Skill body / outputs)

1. Add `skills/<id>/evals/evals.json` from `scripts/skill-behavior-evals.template.json`.
2. Follow upstream skill-creator **Running and evaluating test cases** (with-skill vs baseline, grader, `aggregate_benchmark`, `eval-viewer/generate_review.py`).
3. Apply fixes via **`morph-doc-agent`** or direct SKILL edits; never paste full `docs/` MDX into the Skill.

### Step 6 — Land in Git

- Same PR: SKILL + optional eval JSON + `last_verified` / `verified_against` if facts changed.
- Register new skill ids in `sidebars-skills.js`.
- Human drift: `.github/ISSUE_TEMPLATE/skill-feedback.yaml` (`skill-drift`).

## Related Skills

- `morph-doc-agent` — create or audit a Skill from one goal; use after behavioral eval shows content gaps.
- `morph-skill-ln` — symlink skills into IDE discovery paths before testing routing in Cursor/Claude.
- `morph-dapp-workflow` — dApp delivery harness; not for Skill meta-testing.

## Self-Check

- [ ] Did `npm run skill-creator:check` pass before spending API credits on loops?
- [ ] Is the trigger eval set realistic (chain IDs, package names, near-miss negatives)?
- [ ] After merging `best_description`, does `morph-doc-skill-inventory` still accept trigger phrasing in `description`?
- [ ] Did you run full **`npm test`** before opening the PR?
- [ ] For fact changes, are **`last_verified`** and **`verified_against`** updated in the same change set?
