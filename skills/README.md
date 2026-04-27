---
slug: /
sidebar_label: Overview
title: Morph Skills
---

# morph-doc Skills

This page is the entry point for the **Agent Skill system in the morph-doc repository**: it explains the **division of responsibility between `skills/` and `docs/`**, the **conventions and validation**, and how to **one-click or manually** symlink skill directories into the global loading paths for Cursor / Claude Code / OpenClaw.

- **Vision & contract (doc-as-SKILL, `doc_skill_id`):** [`VISION.md`](https://github.com/morph-l2/morph-doc/blob/main/VISION.md) (repo root)
- **Generate or audit a Skill from a single target:** [`agents/morph-doc-agent.md`](https://github.com/morph-l2/morph-doc/blob/main/agents/morph-doc-agent.md)
- **Only care about "how to link globally":** see [One-click Script `morph-skill-ln`](#one-click-script-morph-skill-ln) and [Manual Commands](#manual-symlink-commands) below; topic skill **[morph-skill-ln](/skills/morph-skill-ln/SKILL)**.

---

## What is `skills/`

- **Canonical path**: **`skills/<skill-id>/`** under the repo root, with **`SKILL.md`** as the main file (e.g. `skills/morph-js-sdk/SKILL.md`). Skills have been migrated out of `.cursor/skills`; **do not** treat `.cursor/skills` as the authoritative in-repo path.
- **Relationship to human docs**: Long-form content, tables, and demos live in **`docs/`** as the source of truth; Skills provide **routable summaries, execution steps, and pointers** — avoiding full duplication of MDX pages. When binding to a specific page, use **`doc_skill_id`** in the MDX frontmatter; its value must match the `skills/<skill-id>/` directory name and the **`name`** field in `SKILL.md` (validation: `__tests__/doc-skill-pairing.test.mjs`).
- **Inventory & frontmatter checks**: `__tests__/morph-doc-skill-inventory.test.mjs` runs basic consistency checks on `skills/*/SKILL.md`.

---

## Using within this repo

When you open **morph-doc** directly in Cursor / IDE, the model reads the **`skills/`** directory from the project, so **no additional symlinks** to other local directories are usually needed.

---

## Reusing in any project (symlink into each tool's skills directory)

If you want a Skill to be available in conversations **without opening morph-doc**, symlink the corresponding directory to the global skills path of each tool (macOS / Linux).

### One-click Script `morph-skill-ln`

Run from the **morph-doc repo root**. When no repo root is provided, the default is the parent directory of the script; you can also specify it with **`-r` / `--root`** or the environment variable **`MORPH_DOC_ROOT`** (priority: `-r` > `MORPH_DOC_ROOT` > default).

**Selecting target agents**: use **`-a` / `--agent`** (repeatable). Built-in names **`cursor`**, **`claude`**, **`openclaw`**, **`windsurf`**, **`codex`** map to **`<root>/.cursor/skills`**, **`.claude/skills`**, **`.openclaw/skills`**, **`.windsurf/skills`**, **`.codex/skills`** respectively (all pointing to `<root>/skills/<id>`). When no `--agent` is specified, defaults to **cursor + claude + openclaw + windsurf**. Other tools can be specified with a **repo-relative path** (must contain `/` or start with `.`), e.g. **`--agent .windsurf/skills`** is equivalent to built-in **`windsurf`**, or **`--agent mytool/skills`** for a custom directory.

```bash
./scripts/morph-skill-ln                              # batch; default root + four agents above
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
./scripts/morph-skill-ln
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

Use the parallel script `scripts/morph-agent-ln` — same flag surface as `morph-skill-ln`:

```bash
./scripts/morph-agent-ln                              # batch; default root + cursor/claude/openclaw/windsurf
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

Skills and agents are linked independently — running only `morph-skill-ln` will not expose `agents/*.md` to your IDE, and vice versa. Typical first-time setup: run both once.

---

## Correspondence with `doc_skill_id`

Docs paired with MDX use `doc_skill_id` in their frontmatter; its value must match both the `skills/<skill-id>/` directory name and the `name` field in `SKILL.md`. Validation: `__tests__/doc-skill-pairing.test.mjs` in the repo root.
