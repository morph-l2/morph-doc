---
name: morph-skill-ln
description: "Morph-doc Agent Skills 安装脚本：将 skills/<id>/ 链到仓库内各工具 skills 目录（--agent …），或用 --unlink 移除对应软链。Use when the user runs morph-skill-ln, unlinks agent symlinks, needs Windsurf .windsurf/skills, or troubleshoots project-local skills in Cursor/Claude/OpenClaw."
last_verified: 2026-04-20
verified_against:
  - scripts/morph-skill-ln
  - skills/README.md
---

# morph-skill-ln (Execution Playbook)

## Single Source of Truth

| Topic | In-repo path |
|-------|--------------|
| Skills overview (directory conventions, relationship to human docs, symlink notes, tool table) | `skills/README.md` |
| Doc-as-SKILL vision & `doc_skill_id` contract | `VISION.md` |
| Generate/audit a Skill from a single target | `agents/morph-doc-agent.md` |

This SKILL only describes **how to use the script to create symlinks**; conventions and index follow **`skills/README.md`**.

## When to Use

- Create **project-local** skill symlinks for **Cursor / Claude Code / OpenClaw / Windsurf (Cascade)** etc. under the repo root (`<root>/skills/<id>` → `<root>/.*/skills/<id>`).
- Use **`./scripts/morph-skill-ln --agent …`** to select the tool; **Windsurf** uses **`-a windsurf`** (maps to **`.windsurf/skills`**, consistent with the official Cascade Skills workspace path).
- Batch update symlink targets (after repo path changes, re-linking on a new machine) or troubleshoot "Agent does not list skill".

## Canonical Path Conventions

- Canonical in-repo directory: **`skills/<skill-id>/`** (containing `SKILL.md`); **do not** treat `.cursor/skills` as the sole in-repo source.
- `name` (frontmatter), directory name, and optional MDX `doc_skill_id` must match; validation: `__tests__/doc-skill-pairing.test.mjs`.

## Execution Steps (model / human)

1. Confirm **morph-doc** is cloned locally. **Repo root**: **`-r` / `--root PATH`** or **`MORPH_DOC_ROOT`** or the script default (**`-r` > `MORPH_DOC_ROOT` > default**).
2. **Target Agent**: **`-a` / `--agent ARG`** (repeatable). **Built-in**: `cursor`, `claude`, `openclaw`, `windsurf`, `codex`; when **no `--agent`** is passed, defaults to **cursor + claude + openclaw + windsurf**. **Custom**: pass a **repo-relative path** (containing `/` or starting with `.`), e.g. **`.windsurf/skills`**, **`mytool/skills`** — maps to `<root>/<path>/<skill-id>`.
3. Example commands from the repo root:

     ```bash
     ./scripts/morph-skill-ln
     ./scripts/morph-skill-ln morph-js-sdk
     ./scripts/morph-skill-ln -a cursor -a windsurf morph-js-sdk
     ./scripts/morph-skill-ln -r /absolute/path/to/morph-doc -a claude
     ./scripts/morph-skill-ln --dry-run
     ./scripts/morph-skill-ln --unlink -a cursor morph-js-sdk
     ```

4. **Remove symlinks**: **`--unlink`**, with the same **`--agent`** as when linking; only deletes **symbolic links** (regular files/directories are skipped with a warning). **`--dry-run`** prints **`rm -f`** commands. For a single skill, **`skills/<id>/` does not need to exist**. See **`./scripts/morph-skill-ln --help`** for details.

5. When linking (without `--unlink`): **`mkdir -p`** the selected directories and **`ln -sfn`** to `<root>/skills/<id>`.

## Tool Path Mapping (in-repo)

| Built-in `--agent` | Links to (relative to repo root) |
|--------------------|----------------------------------|
| cursor | `.cursor/skills/<skill-id>/` |
| claude | `.claude/skills/<skill-id>/` |
| openclaw | `.openclaw/skills/<skill-id>/` |
| windsurf | `.windsurf/skills/<skill-id>/` (Windsurf Cascade workspace skills) |
| codex | `.codex/skills/<skill-id>/` |

## Common Pitfalls

- **Canonical directory** is still **`skills/<id>/`**; `.cursor/skills` etc. are **mirror links** for Agent discovery, aligned with **`--agent`** selection.
- **Batch mode** only enumerates `skills/morph-*/`; non-`morph-` prefixed directories must be linked with a **single `skill-id` argument**.
- **`--dry-run`** only prints commands, does not write to the filesystem.
- **`--unlink`** does not delete real directories under `skills/`, only removes links in agent directories.

## Self-Check

- [ ] Does it point to `skills/README.md` as the overview entry point?
- [ ] Does it explain `-r` / `MORPH_DOC_ROOT` and the **`--agent`** default (cursor + claude + openclaw + windsurf)?
- [ ] Does it list built-in agents and their in-repo paths (including **Windsurf → `.windsurf/skills`**)?
- [ ] Does it remind that `doc_skill_id` / `name` / directory name must match (see VISION and pairing tests)?
