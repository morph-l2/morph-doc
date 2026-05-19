/**
 * Enumerate skills/<id>/SKILL.md: assert frontmatter, name matches directory, description is usable.
 * Aligns with agents/morph-doc-agent.md auditing / existing-skill checks.
 *
 * Also emits freshness warnings (non-failing) when last_verified is missing
 * or older than the decay threshold. See VISION.md § Skill Verification Metadata.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, 'skills');

const DECAY_THRESHOLD_DAYS = 90;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const block = m[1];
  function field(name) {
    const line = new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(block);
    if (!line) return null;
    let v = line[1].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    return v;
  }
  return { block, field };
}

function parseIsoDate(value) {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, y, mo, d] = match;
  const year = Number(y);
  const month = Number(mo);
  const day = Number(d);
  const dt = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(dt.getTime())) return null;
  // Reject normalized overflow dates (e.g. 2026-02-31 → 2026-03-03)
  if (
    dt.getUTCFullYear() !== year ||
    dt.getUTCMonth() + 1 !== month ||
    dt.getUTCDate() !== day
  ) {
    return null;
  }
  return dt;
}

assert.equal(parseIsoDate('2026-02-31'), null, 'parseIsoDate rejects overflow calendar day');
assert.equal(parseIsoDate('2026-02-29'), null, 'parseIsoDate rejects non-leap Feb 29');
assert.ok(parseIsoDate('2024-02-29'), 'parseIsoDate accepts leap-day when valid');
assert.ok(parseIsoDate('2026-05-14'), 'parseIsoDate accepts valid YYYY-MM-DD');
assert.equal(parseIsoDate('2026-13-01'), null, 'parseIsoDate rejects invalid month');
assert.equal(parseIsoDate('2026/05/14'), null, 'parseIsoDate rejects non-ISO separators');

const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
// `morph-skill/` mirrors github.com/morph-l2/morph-skill as flat .md siblings
// (index.md + per-skill .md), not the <id>/SKILL.md convention enforced here.
const skillDirs = entries
  .filter((e) => e.isDirectory() && e.name !== 'morph-skill')
  .map((e) => e.name);

assert.ok(skillDirs.length > 0, 'skills/ should contain at least one skill directory');

const freshnessWarnings = [];
const now = Date.now();

for (const id of skillDirs) {
  const skillPath = path.join(SKILLS_DIR, id, 'SKILL.md');
  assert.ok(
    fs.existsSync(skillPath),
    `each skill directory should have SKILL.md: skills/${id}/SKILL.md`
  );

  const content = fs.readFileSync(skillPath, 'utf8');
  const fm = parseFrontmatter(content);
  assert.ok(fm, `skills/${id}/SKILL.md should have YAML frontmatter`);

  const name = fm.field('name');
  const description = fm.field('description');

  assert.equal(
    name,
    id,
    `SKILL frontmatter name should match directory: skills/${id}`
  );
  assert.ok(
    description && description.length >= 20,
    `skills/${id}/SKILL.md description should be non-empty and substantive (≥20 chars)`
  );
  assert.match(
    description,
    /use when|when the user|当用户|用于|适用于/i,
    `skills/${id}/SKILL.md description should include trigger phrasing (e.g. "Use when…")`
  );

  const lastVerifiedRaw = fm.field('last_verified');
  if (!lastVerifiedRaw) {
    freshnessWarnings.push(
      `skills/${id}/SKILL.md missing last_verified (see VISION.md § Skill Verification Metadata)`
    );
    continue;
  }
  const lastVerified = parseIsoDate(lastVerifiedRaw);
  if (!lastVerified) {
    freshnessWarnings.push(
      `skills/${id}/SKILL.md last_verified is not an ISO date (YYYY-MM-DD): ${lastVerifiedRaw}`
    );
    continue;
  }
  const ageDays = Math.floor((now - lastVerified.getTime()) / MS_PER_DAY);
  if (ageDays > DECAY_THRESHOLD_DAYS) {
    freshnessWarnings.push(
      `skills/${id}/SKILL.md last_verified is ${ageDays} days old (threshold ${DECAY_THRESHOLD_DAYS}); re-verify against sources`
    );
  }
}

if (freshnessWarnings.length > 0) {
  console.warn('morph-doc-skill-inventory: freshness warnings (non-fatal)');
  for (const w of freshnessWarnings) {
    console.warn('  ⚠️', w);
  }
}

console.log('morph-doc-skill-inventory: ok (%d skills)', skillDirs.length);
