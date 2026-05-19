# Contributing to morph-doc

This repository is the Morph documentation site (Docusaurus) and the **source of truth for Morph Agent Skills**. Before opening a pull request that touches `docs/`, `skills/`, or `agents/`, read the links below so changes stay consistent with the doc–skill contract.

## Read first

| Doc | Purpose |
|-----|---------|
| [`CLAUDE.md`](./CLAUDE.md) | Claude Code workspace entry: commands, skill loop, **Mandatory self-check (docs / skills PRs)**, links to AGENTS.md / VISION.md / CONTRIBUTING.md |
| [`AGENTS.md`](./AGENTS.md) | Commands, directories, tests, day-to-day agent workspace operations |
| [`VISION.md`](./VISION.md) | Documentation-as-SKILL vision, pairing policy, freshness metadata |
| [`skills/README.md`](./skills/README.md) | `skills/` conventions, symlinks (`npm run skill-ln`), optional trigger-eval workflow |
| [`agents/morph-doc-agent.md`](./agents/morph-doc-agent.md) | How to author or revise one Skill from a single goal |
| [`agents/morph-dapp-agent.md`](./agents/morph-dapp-agent.md) | End-to-end dApp delivery — routes to harness Skills (`morph-dapp-workflow`, etc.) |

## Working with Claude Code

Claude Code reads root [`CLAUDE.md`](./CLAUDE.md) when this repository is the active project. Use it together with this document: `CLAUDE.md` carries commands and the skill loop; **Morph knowledge base: Skills as connectors** (above) is the team contract for `docs/` / `skills/` / tests.

- **Workspace root**: Open the **morph-doc** clone as the project root so paths (`docs/`, `skills/`, `__tests__/`) and `npm test` match CI and the guards described in `CLAUDE.md`.
- **Global skills (optional)**: Run `npm run skill-ln` so `skills/<id>/` are symlinked into your global Claude skills directory (paths vary by install; see [`skills/README.md`](./skills/README.md)). Then other projects’ Claude Code sessions can load Morph skills without opening this repo.
- **Global agents (optional)**: `npm run agent-ln` symlinks `agents/*.md` for tools that read global agent definitions. Agent frontmatter should include `name`, `description`, and `model` (see `__tests__/morph-dapp-agent.test.mjs`).
- **Single-topic Skill work**: Follow [`agents/morph-doc-agent.md`](./agents/morph-doc-agent.md); `CLAUDE.md` already routes the common “new or revise a Skill” loop there.
- **dApp harness planning output**: `planning/<feature-id>.md` is gitignored by default — local workflow state; commit only when the team wants planning docs in the PR.
- **Personal overrides**: Add a git-ignored `CLAUDE.local.md` at the repo root for machine-specific notes (see “Optional personal overrides” in [`CLAUDE.md`](./CLAUDE.md)).
- **Verify before merge**: Run `npm test` after doc or skill edits (same expectation as `CLAUDE.md`).

## Morph knowledge base: Skills as connectors

Team norms for treating this repository as Morph’s **versioned knowledge base** and **external brain** for agents. This aligns with the **Three-layer model** in [`AGENTS.md`](./AGENTS.md) and the contract in [`VISION.md`](./VISION.md).

### Three layers

1. **Knowledge base**: Canonical facts, long-form narrative, tables, and demos live in `docs/**/*.mdx` for humans and site search. Do not paste full MDX pages into a Skill.
2. **Brain**: **Execution Steps**, boundary notes, and **Self-Check** live in `skills/<skill-id>/SKILL.md`. Executable checks that must stay aligned with docs live in `__tests__/`; merge only after `npm test` passes.
3. **Connector (Skill)**: Connects a short user or tool prompt to the right material—routing via YAML `name` / `description`, pairing MDX pages via `doc_skill_id`, and handing off via **Related Skills** without copying sibling Skill bodies.

### Collaboration checklist

These items are **mandatory self-check bullets** in root [`CLAUDE.md`](./CLAUDE.md) for Claude Code sessions; keep both places aligned when you change norms.

- For **actionable** or **fact-table** topics, follow the pairing policy in `VISION.md`: keep `skills/<id>/SKILL.md` in sync, with `doc_skill_id` matching the Skill `name` and directory name (enforced by `__tests__/doc-skill-pairing.test.mjs` and related guards).
- Skill bodies follow the **connector contract**: execution steps + pointers to specific `docs/` sections + optional Related Skills; large tables may live under `references/` with guidance in the Skill on when to open them.
- When changing on-chain facts, contract addresses, RPC endpoints, or package versions, update `last_verified` / `verified_against` on affected Skills in the same PR (see `VISION.md`).
- Register new skill directories in `sidebars-skills.js`. To load skills globally in an IDE across clones, use `npm run skill-ln` (see `skills/README.md`).
- To tighten or relax how often a Skill is selected, see **Tuning description trigger rates** in `skills/README.md` and maintain an eval JSON modeled on `scripts/skill-trigger-evals.*.example.json`.

### Mnemonic

Write facts in `docs/`; write how to be found and executed in `skills/`; keep pairing verifiable with `doc_skill_id` and `npm test`.

## Local setup

- Install dependencies with your package manager (this repo commonly uses `pnpm` or `npm`).
- `npm start` — Docusaurus dev server  
- `npm test` — run all guards under `__tests__/` (required before merging doc–skill changes)

## Pull requests

- Run `npm test` and fix failures; do not broaden test scope to silence unrelated guards.
- Do not hand-edit typedoc output under `docs/build-on-morph/sdk/{classes,enumerations,functions,interfaces,type-aliases,variables}/` or add `doc_skill_id` there (regenerated output).
- Do not commit secrets (see `.gitignore` and `AGENTS.md`).

For broader product context, see the repository [`README.md`](./README.md).
