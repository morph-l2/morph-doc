# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Canonical handbook

Day-to-day architecture, commands, and conventions live in [`AGENTS.md`](./AGENTS.md) — read it first. The doc–skill contract (why this repo exists as an "external brain" for Morph-facing agents) is in [`VISION.md`](./VISION.md). This file only captures what Claude Code specifically needs on top of those.

Optional personal overrides: `CLAUDE.local.md` (git-ignored). Nested `CLAUDE.md` files in subfolders may apply when working only in those paths.

## What this repo is

A Docusaurus 3.1.1 site (`morph-doc`) that doubles as the source of truth for **Morph Agent Skills**. Two linked surfaces:

- `docs/**/*.mdx|.md` — human-readable documentation. Long-form content, tables, demos.
- `skills/<skill-id>/SKILL.md` — routable, executable summaries for AI agents. Each declares YAML frontmatter (`name`, `description`, `last_verified`, `verified_against`).

Pairing is enforced: MDX pages marked `doc_skill_id: <id>` must match a `skills/<id>/SKILL.md` whose `name` equals `<id>`. See `__tests__/doc-skill-pairing.test.mjs`.

## Commands

```bash
npm start              # docusaurus dev server
npm run build          # production build (output: build/)
npm run serve          # serve built site on port 8080
npm run clear          # clear docusaurus cache
npm test               # runs scripts/run-tests.mjs (all __tests__/*.test.mjs in a fixed order)
npm run skill-ln       # symlink skills/<id>/ into .cursor/.claude/.openclaw/.windsurf/skills
npm run agent-ln       # symlink agents/<name>.md into .cursor/.claude/.openclaw/.windsurf/agents
```

### Running a single test

`npm test` executes the manifest in `scripts/run-tests.mjs`. To run one file directly:

```bash
node __tests__/<file>.test.mjs
```

New test files must be added to `TEST_FILES` in `scripts/run-tests.mjs` — `run-tests-manifest.test.mjs` enforces this.

## Testing model

Tests are plain Node ESM scripts (no framework). They exit non-zero on failure. Key guards to be aware of when editing docs or skills:

- `doc-skill-pairing.test.mjs` — every MDX `doc_skill_id` must resolve to a skill whose `name` matches.
- `morph-doc-skill-inventory.test.mjs` — frontmatter consistency across all `skills/*/SKILL.md`; warns (non-fatal) when `last_verified` is older than 90 days.
- `morph-contracts-skill-tokenlist.test.mjs` — enforces parity between the `morph-contracts` Skill tables and `morph-bridge/public/morph-list/src/mainnet/tokenList.json`.
- `skills-sidebar.test.mjs` — `sidebars-skills.js` must list every skill directory.
- `vision-md.test.mjs` — VISION.md structural contract.
- `examples-viem-alt-fee.test.mjs` — executable Alt Fee behavior tied to SDK docs.

When you change an `actionable` or `fact-table` MDX page or the corresponding SKILL.md, re-stamp `last_verified` and update `verified_against` in the same change.

## Skill authoring loop (the most common task)

When the user asks for a new skill or a revision, follow [`agents/morph-doc-agent.md`](./agents/morph-doc-agent.md): **one goal → one skill directory**, `name` == folder name. The golden path:

1. Land or update long-form content in `docs/` with `doc_skill_id` frontmatter when routing is needed.
2. Create/update `skills/<id>/SKILL.md` — frontmatter + execution steps + self-check. Do **not** copy MDX body; link to the section.
3. If adding a new skill id, register it in `sidebars-skills.js`.
4. Run `npm test`. Fix the specific guard that fails — don't broaden scope.
5. For fact-table skills, update `verified_against` to list every canonical path you cross-checked.

See `VISION.md` for the pairing policy (which doc types require a skill) and the freshness contract.

## Repo-specific conventions

- **Never copy content between `docs/` and `skills/`.** Skills point into docs; docs never embed skill playbooks.
- **Morph-specific fields** (e.g. Alt Fee `feeTokenID` / `feeLimit`, predeploy addresses) must match current docs — do not infer from Ethereum mainnet assumptions.
- **Generated typedoc output** under `docs/build-on-morph/sdk/{classes,enumerations,functions,interfaces,type-aliases,variables}/` is regenerated; do not hand-edit frontmatter there.
- **Agent workspace files** at repo root (`IDENTITY.md`, `SOUL.md`, `USER.md`, `TOOLS.md`, `HEARTBEAT.md`, `memory/`) are for the OpenClaw agent runtime — leave them alone unless the task is specifically about agent configuration. `USER.md` is git-ignored.
