# skill-freshness-bot — CI design sketch

Elevate **Skill Verification Metadata** from `VISION.md` (`last_verified` / `verified_against` / 90-day decay) from a **non-blocking `npm test` warn** to **auditable, deduplicated GitHub automation**, while keeping a clear split from the existing human `skill-drift` feedback loop.

---

## 1. Goals and non-goals

### Goals

| # | Goal |
|---|------|
| G1 | **Same source as existing tests**: The bot and `__tests__/morph-doc-skill-inventory.test.mjs` share the same freshness logic (`scripts/lib/skill-freshness.mjs`) so thresholds and parsing do not drift. |
| G2 | **Do not block ordinary PRs**: `npm test` still fails only on inventory frontmatter hard asserts; freshness overage remains **warn-only** (per `VISION.md`). |
| G3 | **Scheduled visibility**: On `main`, scheduled runs produce a report and **open/update** a single tracking Issue (not one spam Issue per Skill). |
| G4 | **Evolvable**: Report JSON schema is versioned; later you can attach `verified_against` file hashes, on-chain probes, etc., without changing the bot entrypoint. |

### Non-goals (this phase)

- Do not auto-update `last_verified` or auto-merge PRs (human re-verify required).
- Do not add freshness failure to PR required checks (avoid blocking unrelated PRs).
- Do not replace the `skill-drift` template (factual errors found by humans still use `.github/ISSUE_TEMPLATE/skill-feedback.yaml`).

---

## 2. Relationship to existing components

```text
┌─────────────────────────────────────────────────────────────────┐
│  PR / local: npm test                                           │
│    morph-doc-skill-inventory.test.mjs                           │
│      • frontmatter / name / description → assert (fatal)        │
│      • last_verified decay → console.warn (non-fatal)           │
│              ▲                                                  │
│              │ scripts/lib/skill-freshness.mjs (shared)           │
│              ▼                                                  │
│  Scheduled / manual: skill-freshness-bot (GitHub Actions)        │
│    scripts/skill-freshness-report.mjs --json --out report.json  │
│      → artifact + single tracking Issue (label: skill-freshness)  │
└─────────────────────────────────────────────────────────────────┘

Human drift reports ──► skill-drift label (skill-feedback.yaml)
Bot staleness rollup ──► skill-freshness label (bot-managed Issue)
```

| Component | Role |
|-----------|------|
| `scripts/lib/skill-freshness.mjs` | Single source of truth: parse `last_verified`, 90-day threshold, exclude `morph-skill/` |
| `scripts/skill-freshness-report.mjs` | CI entry: emit `morph-doc/skill-freshness-report/v1` JSON |
| `__tests__/skill-freshness-report.test.mjs` | Lock schema and boundary date parsing |
| `.github/workflows/skill-freshness-bot.yml` | Scheduled / `workflow_dispatch` run report + Issue |
| `skill-drift` | Human: wrong facts, routing failures, snippets that do not run |
| `skill-freshness` | Machine: batch “time to re-verify” queue |

---

## 3. Report JSON schema (v1)

Output from `skill-freshness-report.mjs`:

```json
{
  "schema": "morph-doc/skill-freshness-report/v1",
  "generatedAt": "2026-05-20T12:00:00.000Z",
  "thresholdDays": 90,
  "skillCount": 18,
  "warningCount": 3,
  "staleCount": 2,
  "warnings": [
    {
      "skillId": "morph-contracts",
      "code": "stale",
      "message": "skills/morph-contracts/SKILL.md last_verified is 95 days old ...",
      "ageDays": 95,
      "lastVerified": "2026-04-20"
    }
  ],
  "skillIds": ["morph-bridge", "..."]
}
```

**`code` enum**

| code | Meaning | Maintainer action |
|------|---------|-------------------|
| `missing_last_verified` | Field missing | Add YAML + `verified_against` |
| `invalid_last_verified` | Not `YYYY-MM-DD` | Fix the date |
| `stale` | Exceeds `thresholdDays` | Re-read against `verified_against` and re-stamp |

---

## 4. GitHub Actions workflow (Phase 1)

File: `.github/workflows/skill-freshness-bot.yml`

### Triggers

| Event | Purpose |
|-------|---------|
| `schedule: cron '0 9 * * 1'` | Scan `main` every Monday 09:00 UTC |
| `workflow_dispatch` | Maintainer manual re-run |

**Do not run the bot on `pull_request`** (avoid noise; PRs still rely on local/CI `npm test` warns).

### Job steps

1. `checkout` (`main`)
2. `setup-node` (align with repo `.nvmrc` / package engines; LTS recommended)
3. `node scripts/skill-freshness-report.mjs --json --out .local/skill-freshness-report.json`
4. `actions/upload-artifact` — retain report for 30 days
5. **Issue sync** (`actions/github-script` or `peter-evans/create-or-update-issue`):
   - If `warningCount === 0`: close the matching open Issue (if any)
   - If `warningCount > 0`: create or update **one** Issue:
     - Title: `[skill-freshness] Weekly re-verify queue (N warnings)`
     - Labels: `skill-freshness`, `bot`
     - Body: table of `skillId | code | lastVerified | ageDays | message`, link to re-stamp guidance in `VISION.md` and `CONTRIBUTING.md`

### Permissions

```yaml
permissions:
  contents: read
  issues: write
```

Uses `GITHUB_TOKEN`; no PAT unless Phase 2 reads sibling app paths inside `verified_against` across repos.

---

## 5. Issue body template (example)

```markdown
## Skill freshness report

| Skill | Code | last_verified | Age (days) |
|-------|------|---------------|------------|
| morph-contracts | stale | 2026-04-20 | 95 |

**Threshold:** 90 days (`VISION.md` § Skill Verification Metadata)

### Maintainer checklist

- [ ] Re-read each Skill against `verified_against` paths
- [ ] Update `last_verified` to today (UTC date) in the same PR as any fact fix
- [ ] Run `npm test`

Report artifact: run #${RUN_ID}
Generated: ${generatedAt}
```

---

## 6. Phase 2+ (optional evolution)

| Phase | Capability | Notes |
|-------|------------|-------|
| **2a** | `verified_against` existence check | Report adds `missing_source` (path does not exist in repo) |
| **2b** | In-repo file hash | Record `sha256` for in-repo paths; source changed but Skill not re-stamped → `source_changed` warning |
| **2c** | External canonical | Like `morph-contracts-skill-tokenlist.test.mjs`, CI fetches `morph-bridge/.../tokenList.json` for comparison (needs multi-repo checkout or submodule) |
| **3** | Draft PR bot | Only update checkboxes in Issue body / assign CODEOWNERS; do not auto-edit YAML |

**Principle:** Phase 2+ extends via `skill-freshness-report/v2` schema; do not casually expand `npm test` hard-failure scope.

---

## 7. Local commands

```bash
# Human-readable warn list (same as inventory test)
node scripts/skill-freshness-report.mjs

# JSON for CI / bot
node scripts/skill-freshness-report.mjs --json --out .local/skill-freshness-report.json

# Full test suite (includes schema lock)
npm test
```

---

## 8. Operations and deduplication

- **Repo labels (one-time)**: Create `skill-freshness` and `bot` labels in GitHub (or create manually on first bot failure); the Issues API does not create unknown labels automatically.
- **Single tracking Issue**: Search by title prefix `[skill-freshness] Weekly` + label `skill-freshness` (including closed); if found, `update` and `reopen` instead of opening a new Issue each week.
- **Merge strategy with skill-drift**: Bot Issue lists only “stale”; factual errors are fixed via human `skill-drift` PRs. You do not need to clear all stale items before closing the bot Issue (re-verify in batches).
- **CODEOWNERS**: Optional owners on `skills/**/SKILL.md`; bot Issue can @ the team.

---

## 9. Acceptance criteria (Phase 1 done)

- [ ] `npm test` passes, and inventory vs report warning counts match for the same repo snapshot
- [ ] `workflow_dispatch` produces artifact + Issue (or update) on GitHub
- [ ] When `warningCount === 0`, bot leaves no open freshness Issue
- [ ] Docs: optional small PR adding one sentence in `VISION.md` Feedback Loop pointing to this bot

---

## 10. Risks

| Risk | Mitigation |
|------|------------|
| Timezone shifts `ageDays` by 1 day | Use UTC calendar-day parsing everywhere (already implemented) |
| Issue noise | Single Issue rollup + filter by `skill-freshness` label |
| Logic diverges from inventory | Mandatory shared `scripts/lib/skill-freshness.mjs` |
| Fork PR abuse of `issues: write` | Workflow only on `schedule` + `workflow_dispatch` on default branch |
