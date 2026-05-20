---
slug: /
sidebar_label: Overview
title: Morph Skills
---

# morph-doc Skills

This page is the entry point for the **Agent Skill system in the morph-doc repository**: it explains the **division of responsibility between `skills/` and `docs/`**, the **conventions and validation**, and how to **mirror** canonical `skills/<id>/` directories into **in-repo** IDE discovery paths (e.g. `.cursor/skills/`) or, when needed, into **user-level** skill directories for other workspaces.

- **Vision & contract (doc-as-SKILL, `doc_skill_id`):** [`VISION.md`](https://github.com/morph-l2/morph-doc/blob/main/VISION.md) (repo root)
- **Generate or audit a Skill from a single target:** [`agents/morph-doc-agent.md`](https://github.com/morph-l2/morph-doc/blob/main/agents/morph-doc-agent.md)
- **Only care about symlinks / `morph-skill-ln`:** see [IDE discovery paths (in-repo mirrors)](#ide-discovery-paths-in-repo-mirrors) and [One-click script `morph-skill-ln`](#one-click-script-morph-skill-ln); topic skill **[morph-skill-ln](/skills/morph-skill-ln/SKILL)**.

---

## What is `skills/`

- **Canonical path**: **`skills/<skill-id>/`** under the repo root, with **`SKILL.md`** as the main file (e.g. `skills/morph-js-sdk/SKILL.md`). **Do not** treat per-IDE symlink mirrors inside the repo (hidden config trees created by your editor) as the authoritative copy — edit **`skills/<id>/`** only.
- **Relationship to human docs**: Long-form content, tables, and demos live in **`docs/`** as the source of truth; Skills provide **routable summaries, execution steps, and pointers** — avoiding full duplication of MDX pages. When binding to a specific page, use **`doc_skill_id`** in the MDX frontmatter; its value must match the `skills/<skill-id>/` directory name and the **`name`** field in `SKILL.md` (validation: `__tests__/doc-skill-pairing.test.mjs`).
- **Inventory & frontmatter checks**: `__tests__/morph-doc-skill-inventory.test.mjs` runs basic consistency checks on `skills/*/SKILL.md`.
- **Tuning `description` (trigger rate)**: If a Skill is under-used in the IDE, build a morph-doc eval JSON, run **skill-creator** *Description Optimization*, then merge `best_description`. See [Tuning description trigger rates](#tuning-description-trigger-rates).

---

## Using within this repo

When **morph-doc** is the workspace root, many agents already load **`skills/<id>/SKILL.md`** from the canonical tree — **symlinks are optional** in that case.

Run **`npm run skill-ln`** (or `./scripts/morph-skill-ln`) when your tool only discovers skills under **`.cursor/skills`**, **`.claude/skills`**, **`.openclaw/skills`**, or **`.windsurf/skills`** inside the repo. Those paths are **mirrors** of `skills/<id>/`, not a second source of truth. Typical first-time setup on a fresh clone: link once if your editor expects the mirror paths.

---

## Skill testing & improvement (skill-creator bridge)

Morph-doc ships a bridge Skill and CLI so you do not hand-wire paths to upstream [Anthropic skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator):

| Step | Command |
|------|---------|
| Install upstream into `vendor/skill-creator` | `npm run skill-creator:install` |
| Verify Python / path / optional `claude` CLI | `npm run skill-creator:check` |
| Static Morph guards for one Skill | `npm run skill-creator:validate -- <skill-id>` |
| LLM trigger eval (`claude -p`, one shot) | `npm run skill-creator:run-eval -- <skill-id>` |
| Description trigger optimization loop | `npm run skill-creator:desc-loop -- <skill-id>` |

Playbook: **[`skills/morph-skill-creator/SKILL.md`](./morph-skill-creator/SKILL.md)** · Agent: **[Morph Skill Creator Agent](/agents/morph-skill-creator-agent)**

Behavioral evals (outputs + assertions + viewer) still follow the upstream skill-creator `SKILL.md`; add `skills/<id>/evals/evals.json` from `scripts/skill-behavior-evals.template.json`.

## Tuning description trigger rates

IDE routing depends mainly on the YAML **`description`** in `skills/<id>/SKILL.md` (plus `name`). After you have a trigger eval JSON, run **`npm run skill-creator:run-eval -- <skill-id>`** (one-shot LLM trigger test via upstream `run_eval.py`) or **`npm run skill-creator:desc-loop -- <skill-id>`** (iterative description optimization via `run_loop.py`) — see **Skill testing & improvement** above. Manual path: follow the **Description Optimization** section in the upstream **skill-creator** `SKILL.md`.

**Prerequisites:** skill-creator installed (`npm run skill-creator:install` or user-level checkout); description loop requires the **Claude Code / `claude` CLI**. Without those, hand-edit `description` and run **`npm test`**.

### 1. Trigger eval set (JSON)

- Format: a JSON **array** of objects `{ "query": "...", "should_trigger": true|false }`.
- **Minimum 16 rows** for checked-in examples: at least **8** `should_trigger: true` and **8** `false` (`__tests__/skill-trigger-eval-examples.test.mjs`). **~20 rows** (roughly half positive, half near-miss negatives) is a good target — positives are real user prompts that *should* load this Skill; negatives share vocabulary but should route elsewhere (e.g. `morph-contracts` for address-only tables, `morph-tx-cost` for fee formula without SDK packages).
- Queries should be **concrete** (paths, chain IDs, error messages, package names); avoid toy prompts like "read a file" — models may not consult a Skill for trivial one-step tasks.
- **Example file** checked into this repo (copy and edit for another Skill id): `scripts/skill-trigger-evals.morph-js-sdk.example.json`.

### 2. Run the loop (skill-creator)

Steps 2–3 (optional HTML review, `python -m scripts.run_loop`, flags, and reports) live in **skill-creator** → **Description Optimization** — do not duplicate that CLI here; it changes with the upstream skill.

When you run it against morph-doc, point:

- **`--eval-set`** at `scripts/skill-trigger-evals.<skill-id>.example.json` (copy from the `morph-js-sdk` example)
- **`--skill-path`** at `skills/<skill-id>/`

`--results-dir` is optional (see skill-creator). If you want reports under this clone, pick any writable path under **`.local/`** (e.g. `.local/skill-desc-opt`) — that folder is **not in git** (`.gitignore` ignores `.local/`) and is **created by the loop on first run**, so you will not see it until you actually run description optimization.

Merge the loop’s **`best_description`** into the Skill below.

### 3. Land changes in morph-doc

1. Replace the `description:` field in `skills/<id>/SKILL.md` (keep `name` and directory aligned; do not paste the full Skill body into `description`).
2. Run **`npm test`**; fix `morph-doc-skill-inventory` if `description` no longer matches trigger-phrase heuristics.
3. If you changed **facts** or re-pointed canonical docs, update **`last_verified`** / **`verified_against`** per `VISION.md` and `CLAUDE.md`.

---

## IDE discovery paths (in-repo mirrors)

`morph-skill-ln` and `morph-agent-ln` write **project-local** symlinks under the **morph-doc repo root** — for example `<root>/.cursor/skills/<skill-id>` → `<root>/skills/<skill-id>`. They do **not** install into `~/.cursor/skills` or other user-home paths.

### Using Morph skills from another repository

To load Morph skills while a **different** folder is the workspace, symlink into that tool's **user-level** skills directory (paths vary by install; see each product's docs):

```bash
MORPH_DOC_ROOT="/absolute/path/to/morph-doc"
SKILL_ID="morph-js-sdk"
mkdir -p "${HOME}/.cursor/skills"
ln -sfn "${MORPH_DOC_ROOT}/skills/${SKILL_ID}" "${HOME}/.cursor/skills/${SKILL_ID}"
```

Repeat for other tools (`~/.claude/skills`, etc.) as needed. Alternatively, open **morph-doc** as the workspace or include it in a multi-root setup.

### One-click script `morph-skill-ln`

Run from the **morph-doc repo root** (`npm run skill-ln` is equivalent). When no repo root is provided, the default is the parent directory of the script; you can also specify it with **`-r` / `--root`** or the environment variable **`MORPH_DOC_ROOT`** (priority: `-r` > `MORPH_DOC_ROOT` > default).

**Selecting target agents**: use **`-a` / `--agent`** (repeatable). Built-in names **`cursor`**, **`claude`**, **`openclaw`**, **`windsurf`**, **`codex`** map to **`<root>/.cursor/skills`**, **`.claude/skills`**, **`.openclaw/skills`**, **`.windsurf/skills`**, **`.codex/skills`** respectively (all pointing to `<root>/skills/<id>`). When no `--agent` is specified, defaults to **cursor + claude + openclaw + windsurf**. Other tools can be specified with a **repo-relative path** (must contain `/` or start with `.`), e.g. **`--agent .windsurf/skills`** is equivalent to built-in **`windsurf`**, or **`--agent mytool/skills`** for a custom directory under `<root>/`.

```bash
npm run skill-ln                                      # batch; default root + four agents above
./scripts/morph-skill-ln morph-js-sdk                 # single skill id
./scripts/morph-skill-ln -a cursor -a claude          # only link Cursor and Claude Code
./scripts/morph-skill-ln -r /path/to/morph-doc -a windsurf
./scripts/morph-skill-ln --agent .windsurf/skills --dry-run
./scripts/morph-skill-ln --dry-run                    # only print mkdir/ln, no writes
./scripts/morph-skill-ln --unlink -a cursor morph-js-sdk   # remove symlink under .cursor/skills
./scripts/morph-skill-ln --unlink --dry-run           # preview rm -f commands
```

To specify the path via environment variable:

```bash
export MORPH_DOC_ROOT="/absolute/path/to/morph-doc"
npm run skill-ln
```

For equivalent manual commands and tool notes, see the next two sections; for behavior details and troubleshooting, see **`skills/morph-skill-ln/SKILL.md`**.

### Manual Symlink Commands

Replace `MORPH_DOC_ROOT` with the **absolute path** to this repo's root, and `SKILL_ID` with the directory name (must match `name` in `SKILL.md` frontmatter).

**Single skill (using `morph-js-sdk` as an example, linking within the repo matching the script's default agents)**

```bash
MORPH_DOC_ROOT="/path/to/morph-doc"
SKILL_ID="morph-js-sdk"
SKILL_DIR="${MORPH_DOC_ROOT}/skills/${SKILL_ID}"

mkdir -p "${MORPH_DOC_ROOT}/.cursor/skills" "${MORPH_DOC_ROOT}/.claude/skills" \
  "${MORPH_DOC_ROOT}/.openclaw/skills" "${MORPH_DOC_ROOT}/.windsurf/skills"

ln -sfn "${SKILL_DIR}" "${MORPH_DOC_ROOT}/.cursor/skills/${SKILL_ID}"
ln -sfn "${SKILL_DIR}" "${MORPH_DOC_ROOT}/.claude/skills/${SKILL_ID}"
ln -sfn "${SKILL_DIR}" "${MORPH_DOC_ROOT}/.openclaw/skills/${SKILL_ID}"
ln -sfn "${SKILL_DIR}" "${MORPH_DOC_ROOT}/.windsurf/skills/${SKILL_ID}"
```

**Batch: create symlinks for all `morph-*` skills in this repo**

```bash
MORPH_DOC_ROOT="/path/to/morph-doc"

mkdir -p "${MORPH_DOC_ROOT}/.cursor/skills" "${MORPH_DOC_ROOT}/.claude/skills" \
  "${MORPH_DOC_ROOT}/.openclaw/skills" "${MORPH_DOC_ROOT}/.windsurf/skills"

for d in "${MORPH_DOC_ROOT}/skills"/morph-*/; do
  [ -d "$d" ] || continue
  id="$(basename "$d")"
  [ -f "${d}SKILL.md" ] || continue
  ln -sfn "${MORPH_DOC_ROOT}/skills/${id}" "${MORPH_DOC_ROOT}/.cursor/skills/${id}"
  ln -sfn "${MORPH_DOC_ROOT}/skills/${id}" "${MORPH_DOC_ROOT}/.claude/skills/${id}"
  ln -sfn "${MORPH_DOC_ROOT}/skills/${id}" "${MORPH_DOC_ROOT}/.openclaw/skills/${id}"
  ln -sfn "${MORPH_DOC_ROOT}/skills/${id}" "${MORPH_DOC_ROOT}/.windsurf/skills/${id}"
done
```

Using `ln -sfn` updates an existing symlink target in-place.

---

## Tool Notes (corresponding to `morph-skill-ln` built-in `--agent` values)

| Tool | In-repo path (relative to morph-doc root) | Notes |
|------|------------------------------------------|-------|
| **Cursor** | `.cursor/skills/<skill-id>/` | Corresponds to `-a cursor`. |
| **Claude Code** | `.claude/skills/<skill-id>/` | Corresponds to `-a claude`. |
| **OpenClaw** | `.openclaw/skills/<skill-id>/` | Corresponds to `-a openclaw`; workspace behavior follows OpenClaw docs. |
| **Windsurf (Cascade)** | `.windsurf/skills/<skill-id>/` | Corresponds to `-a windsurf` or `-a .windsurf/skills` (official Cascade workspace skills path). |
| **Codex compatible** | `.codex/skills/<skill-id>/` | Corresponds to `-a codex`. |

Other directories can be added with **`--agent <repo-relative-path>`** (must contain `/` or start with `.`).

---

## Linking agents (sibling mechanism)

Agent definitions (files under `agents/<name>.md`, e.g. `morph-doc-agent`, `morph-dapp-agent`) are symlinked separately from skills, because they live as **single `.md` files** rather than directories, and they land in **`.cursor/agents/`** / **`.claude/agents/`** (not `…/skills/`).

Use the parallel script `scripts/morph-agent-ln` (`npm run agent-ln`) — same flag surface as `morph-skill-ln`:

```bash
npm run agent-ln                                      # batch; default root + cursor/claude/openclaw/windsurf
./scripts/morph-agent-ln morph-dapp-agent             # single agent name (with or without .md)
./scripts/morph-agent-ln -a cursor -a claude          # only link Cursor and Claude Code
./scripts/morph-agent-ln --dry-run                    # only print mkdir/ln, no writes
./scripts/morph-agent-ln --unlink -a cursor morph-dapp-agent
```

Built-in `--agent` names map to repo-relative paths:

| Tool | Agents path |
|------|------------|
| **Cursor** | `.cursor/agents/<name>.md` |
| **Claude Code** | `.claude/agents/<name>.md` |
| **OpenClaw** | `.openclaw/agents/<name>.md` |
| **Windsurf** | `.windsurf/agents/<name>.md` |
| **Codex compatible** | `.codex/agents/<name>.md` |

Skills and agents are linked independently — running only `morph-skill-ln` will not expose `agents/*.md` to your IDE, and vice versa. Typical first-time setup on a fresh clone: run **`npm run skill-ln`** and **`npm run agent-ln`** once if your editor expects the in-repo mirror paths.
