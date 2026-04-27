---
name: morph-vision
description: "Morph documentation as the external brain for Morph-facing agents: docs-as-SKILL, developer toolchain (docs/, skills/, IDE agents, OpenClaw workspace), and how to write MDX so models instantiate reliable behavior. Use when defining or explaining the doc–skill contract, onboarding contributors to agent-ready documentation, or aligning Cursor / Claude Code / OpenClaw with this repository."
---

# Morph Documentation Agent Vision (VISION)

## Single Source of Truth

This file describes how **morph-doc** binds "human-readable documentation" to "executable Agent Skills", forming **Morph's External Brain**: the model does not rely on conversational memory but treats **`docs/` + `skills/`** inside the repository as the authoritative source.

- **Architecture & day-to-day operations:** [`AGENTS.md`](./AGENTS.md)
- **Flows and facts for specific topics:** `docs/**/*.mdx` / `docs/**/*.md` and the corresponding `skills/<skill-id>/SKILL.md`
- **Skills overview (directory conventions, division with `docs/`, symlinks & `morph-skill-ln`):** [`skills/README.md`](./skills/README.md)

This VISION does not repeat CLI commands or directory trees; it only defines **goals, contracts, and self-checks**.

---

## Vision: Documentation as SKILL

**Documentation as SKILL** means: developer-facing pages are written to satisfy the **Agent Skill contract**, so the same material can be read by humans and also used in model conversations as **routable, executable, self-checkable** instantiation instructions.

| Dimension | For humans | For models to "instantiate" |
|-----------|-----------|----------------------------|
| Facts & API | MDX body, tables, examples | Skill summary + pointer to MDX section, avoids duplicating long tables |
| Flow | Headings and section order | **Execution Steps** numbered steps, reduces guessing and skipping |
| Boundaries | Notes, limitations | Stated in **description** and **Self-Check**: "when not applicable" |

After writing and merging into the repo, the toolchain routes user questions to the correct behavior via **Skill name / `doc_skill_id` / description** — instead of reasoning from scratch each time.

---

## What "External Brain" Means for Morph

- **External**: relative to model weights and conversation context; authority lives in the **Git repository**, versioned, reviewable, and revertible.
- **Brain**: Agents (IDE, Claude Code, OpenClaw, etc.) **prioritize reading and following** `docs/` and `skills/` when answering Morph-related questions, rather than relying solely on training data or short context.
- **Morph agents**: assistants oriented toward the Morph ecosystem (developer support, SDK, nodes, bridge, Rails, etc.) — their consistency and safety boundaries are governed by **the documentation contract in this repo**.

---

## Developer Toolchain (How to Instantiate)

1. **Human docs (MDX/MD)**
   - Authoritative long-form content, demos, component references.
   - When pairing with a Skill, use `doc_skill_id: <matching skill directory name>` in the frontmatter.

2. **Skill (`skills/<skill-id>/SKILL.md`)**
   - **YAML**: `name` (matches directory name), `description` (third-person, trigger scenarios, capability boundary).
   - **Body**: execution playbook, single source of truth path, execution steps, self-check list; large tables can go in `references/` with instructions in the SKILL for when to open them.

3. **IDE / multi-tool reuse**
   - In-repo: canonical directory is **`skills/<skill-id>/`**; see [`skills/README.md`](./skills/README.md) to symlink to Cursor / Claude Code / OpenClaw global dirs.
   - **OpenClaw**: when the workspace points to this repo, sessions load [`AGENTS.md`](./AGENTS.md); the workspace `skills/` has high priority in OpenClaw (follow the OpenClaw version docs).

4. **Validation**
   - `doc_skill_id` matches `name` in `SKILL.md`; related test cases in `__tests__/doc-skill-pairing.test.mjs`.

---

## Write Docs to the SKILL Standard (Contributor Contract)

When writing or revising MDX, at minimum satisfy:

1. **Routable**: if the topic is suitable for Agent reuse, maintain a corresponding `skills/<id>/SKILL.md` with a `description` that covers how users will ask and which keywords it includes (chain IDs, package names, etc.).
2. **Single source of truth**: the Skill does not copy-paste the full MDX; use "read section X of `docs/...`" + minimal necessary extracts.
3. **Executable**: provide **Execution Steps** (prerequisites → steps → verification); avoid pure narrative with no actions.
4. **No fabricated fields**: Morph-specific fields (e.g. Alt Fee's `feeTokenID` / `feeLimit`) must match the documentation; do not invent exports or undocumented APIs.
5. **Testable**: for scripts, validation logic, or behaviors strongly tied to docs, add or update tests in `__tests__/`.
6. **Instantiation Self-Check**: keep a **Self-Check** checklist (3–7 items) at the end of the SKILL for the model to verify before delivering.

When generating Skills with a specialized sub-agent, follow the workflow in [`agents/morph-doc-agent.md`](./agents/morph-doc-agent.md): **single goal → single skill directory**, `name` matches the folder name.

---

## Pairing Policy (which docs need a Skill)

Not every MDX page benefits from a Skill. Follow this layered rule:

| Doc type | `doc_skill_id` required | Rationale |
|----------|------------------------|-----------|
| **Actionable** (deploy, run, integrate, bridge, Alt Fee) | **Yes** | Agents need routing + execution steps |
| **Fact tables** (contract addresses, RPC endpoints, chain IDs, token lists) | **Yes** | Agents need precise lookup with a canonical source |
| **Conceptual** (what is Optimistic Rollup, RVP mechanics) | Optional | Human-first content; agent routing adds limited value |
| **Narrative** (Vision, Roadmap, Mission) | No | No execution surface to expose |
| **Generated** (typedoc under `docs/build-on-morph/sdk/{classes,enumerations,functions,interfaces,type-aliases,variables}/`) | No | Re-generated output; manual frontmatter would be overwritten |

**Target**: 100% pairing for *actionable* and *fact-table* docs. Tracked by `__tests__/doc-skill-pairing.test.mjs`.

---

## Cross-Skill References (`Related Skills`)

Skills may reference siblings via a dedicated section, **without copying content**:

```markdown
## Related Skills

- `morph-contracts` — Contract addresses, when you need to look up Bridge gateways
- `morph-js-sdk` — JavaScript SDK, when picking Viem vs Ethers adapter
```

Rules:

1. **Pointer only**, never replicate the other Skill's body.
2. **No mandatory reciprocity** — A may reference B without B referencing A; acyclic by convention.
3. List each cross-reference with a one-line *when to open it* hint.

---

## Skill Verification Metadata (freshness contract)

Each `SKILL.md` declares when it was last human-verified and against which sources:

```yaml
---
name: morph-contracts
description: "…"
last_verified: 2026-04-20
verified_against:
  - morph-bridge/public/morph-list/src/mainnet/tokenList.json
  - docs/build-on-morph/developer-resources/1-contracts.md
---
```

- **`last_verified`** — ISO date (YYYY-MM-DD) of the most recent human re-read of the Skill against its sources.
- **`verified_against`** — list of paths whose content was cross-checked. Sibling-app paths (e.g. `morph-bridge/`) are valid when they are the canonical source of truth.
- **Decay threshold** — `last_verified` older than **90 days** emits a warning from `__tests__/morph-doc-skill-inventory.test.mjs`. The warning is informational (does not fail the run) so unrelated work is not blocked.
- **Protocol upgrades** — when a Morph fork or predeploy change lands, re-stamp affected Skills in the same PR that introduces the doc update.

Additional existing guard: `__tests__/morph-contracts-skill-tokenlist.test.mjs` enforces table↔JSON parity for `morph-contracts` (fact-table drift).

---

## Feedback Loop

Skill or MDX drift reports flow through a single GitHub Issue template (`.github/ISSUE_TEMPLATE/skill-feedback.yaml`) and the `skill-drift` label, triaged by the doc maintainer. The `MarkdownActionsDropdown` site component may link users directly to this template from any MDX page.

---

## Execution Steps (Maintainers)

1. Define topic and audience (chain, role: contract / node / SDK).
2. Land or update MDX in `docs/`; set `doc_skill_id` when a Skill is needed.
3. Create or update `skills/<skill-id>/SKILL.md` (frontmatter + playbook + self-check).
4. Run tests (including `doc-skill` pairing and project scripts).
5. If global toolchain changes are needed, update symlink instructions in `skills/README.md`.

---

## Self-Check

- [ ] Does the long-form content for this topic still live only in `docs/`, with the Skill providing only summaries and pointers?
- [ ] Does `doc_skill_id` (if present) match `name` in `skills/<id>/SKILL.md`?
- [ ] Does `description` allow the model to route to this Skill even when the user doesn't state all keywords?
- [ ] Are Morph-specific concepts and common pitfalls documented to prevent the model from applying Ethereum mainnet assumptions?
- [ ] Does executable code match the package versions, chain names, and value ranges in the documentation?

---

## Relationship to Related Files

| File | Role |
|------|------|
| [`AGENTS.md`](./AGENTS.md) | In-repo Agent operations handbook (commands, directories, tests, secrets) |
| [`CLAUDE.md`](./CLAUDE.md) | Claude Code entry point, points to `AGENTS.md` |
| [`VISION.md`](./VISION.md) (this file) | Doc–Skill vision and contract; does not replace topic-specific SKILLs |
| [`agents/morph-doc-agent.md`](./agents/morph-doc-agent.md) | Sub-agent instructions for generating/revising a Skill from "one goal" |
