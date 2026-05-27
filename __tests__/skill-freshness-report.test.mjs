/**
 * Locks skill-freshness-report JSON schema and shared date parsing.
 */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildFreshnessReport,
  collectFreshnessWarnings,
  parseIsoDate,
} from '../scripts/lib/skill-freshness.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

assert.equal(parseIsoDate('not-a-date'), null);

const fixedNow = Date.UTC(2026, 4, 20); // 2026-05-20
const report = buildFreshnessReport(ROOT, { now: fixedNow });

assert.equal(report.schema, 'morph-doc/skill-freshness-report/v1');
assert.equal(typeof report.generatedAt, 'string');
assert.equal(report.thresholdDays, 90);
assert.ok(report.skillCount > 0);
assert.equal(report.skillIds.length, report.skillCount);
assert.equal(report.warningCount, report.warnings.length);
assert.equal(
  report.staleCount,
  report.warnings.filter((w) => w.code === 'stale').length
);

for (const w of report.warnings) {
  assert.ok(w.skillId && typeof w.skillId === 'string');
  assert.ok(
    ['missing_last_verified', 'invalid_last_verified', 'future_last_verified', 'stale'].includes(
      w.code,
    ),
  );
  assert.ok(w.message.includes(w.skillId));
}

// Synthetic temp skill dir: stale last_verified
const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'morph-freshness-'));
const tmpSkills = path.join(tmpRoot, 'skills', 'tmp-stale-skill');
fs.mkdirSync(tmpSkills, { recursive: true });
fs.writeFileSync(
  path.join(tmpSkills, 'SKILL.md'),
  `---
name: tmp-stale-skill
description: "Use when testing skill freshness bot stale detection in CI."
last_verified: 2026-01-01
---
# tmp
`,
  'utf8'
);

const { warnings } = collectFreshnessWarnings(path.join(tmpRoot, 'skills'), {
  now: fixedNow,
  thresholdDays: 90,
});
assert.equal(warnings.length, 1);
assert.equal(warnings[0].code, 'stale');
assert.equal(warnings[0].skillId, 'tmp-stale-skill');
assert.ok(warnings[0].ageDays > 90);

const tmpFuture = fs.mkdtempSync(path.join(os.tmpdir(), 'morph-freshness-future-'));
const tmpFutureSkill = path.join(tmpFuture, 'skills', 'tmp-future-skill');
fs.mkdirSync(tmpFutureSkill, { recursive: true });
fs.writeFileSync(
  path.join(tmpFutureSkill, 'SKILL.md'),
  `---
name: tmp-future-skill
description: "Use when testing skill freshness future last_verified detection in CI."
last_verified: 2099-01-01
---
# tmp
`,
  'utf8',
);
const { warnings: futureWarnings } = collectFreshnessWarnings(path.join(tmpFuture, 'skills'), {
  now: fixedNow,
});
assert.equal(futureWarnings.length, 1);
assert.equal(futureWarnings[0].code, 'future_last_verified');
assert.equal(futureWarnings[0].skillId, 'tmp-future-skill');
assert.ok(futureWarnings[0].ageDays < 0);
fs.rmSync(tmpFuture, { recursive: true, force: true });

const badOut = spawnSync(
  process.execPath,
  ['scripts/skill-freshness-report.mjs', '--out', '--json'],
  { cwd: ROOT, encoding: 'utf8' },
);
assert.notEqual(badOut.status, 0, '--out without a path should fail');
assert.match(`${badOut.stdout}${badOut.stderr}`, /--out requires/i);

fs.rmSync(tmpRoot, { recursive: true, force: true });

console.log('skill-freshness-report: ok');
