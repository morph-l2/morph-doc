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
import {
  collectFreshnessWarnings,
  parseFrontmatter,
  parseIsoDate,
} from '../scripts/lib/skill-freshness.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, 'skills');

assert.equal(parseIsoDate('2026-02-31'), null, 'parseIsoDate rejects overflow calendar day');
assert.equal(parseIsoDate('2026-02-29'), null, 'parseIsoDate rejects non-leap Feb 29');
assert.ok(parseIsoDate('2024-02-29'), 'parseIsoDate accepts leap-day when valid');
assert.ok(parseIsoDate('2026-05-14'), 'parseIsoDate accepts valid YYYY-MM-DD');
assert.equal(parseIsoDate('2026/05/14'), null, 'parseIsoDate rejects non-ISO separators');
assert.equal(parseIsoDate('2026-13-01'), null, 'parseIsoDate rejects invalid month');

const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
const skillDirs = entries
  .filter((e) => e.isDirectory() && e.name !== 'morph-skill')
  .map((e) => e.name);

assert.ok(skillDirs.length > 0, 'skills/ should contain at least one skill directory');

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
}

const { warnings: freshnessWarnings } = collectFreshnessWarnings(SKILLS_DIR);

if (freshnessWarnings.length > 0) {
  console.warn('morph-doc-skill-inventory: freshness warnings (non-fatal)');
  for (const w of freshnessWarnings) {
    console.warn('  ⚠️', w.message);
  }
}

console.log('morph-doc-skill-inventory: ok (%d skills)', skillDirs.length);
