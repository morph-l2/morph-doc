/**
 * Example trigger-eval sets for skill-creator description optimization.
 * Files: scripts/skill-trigger-evals.*.example.json — array of { query, should_trigger }.
 * @see skills/README.md "Tuning description trigger rates"
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SCRIPTS = path.join(ROOT, 'scripts');

const files = fs
  .readdirSync(SCRIPTS)
  .filter((f) => f.startsWith('skill-trigger-evals.') && f.endsWith('.example.json'))
  .sort();

assert.ok(files.length > 0, 'expected at least one scripts/skill-trigger-evals.*.example.json');

for (const name of files) {
  const full = path.join(SCRIPTS, name);
  const raw = fs.readFileSync(full, 'utf8');
  let data;
  assert.doesNotThrow(() => {
    data = JSON.parse(raw);
  }, `valid JSON: ${name}`);

  assert.ok(Array.isArray(data), `${name} should be a JSON array`);
  assert.ok(
    data.length >= 20,
    `${name} should have at least 20 rows (skill-creator description optimization set)`,
  );

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    assert.ok(row && typeof row === 'object', `${name}[${i}] should be an object`);
    assert.equal(
      typeof row.query,
      'string',
      `${name}[${i}].query should be a string`,
    );
    assert.ok(
      row.query.trim().length >= 20,
      `${name}[${i}].query should be substantive (>=20 chars)`,
    );
    assert.equal(
      typeof row.should_trigger,
      'boolean',
      `${name}[${i}].should_trigger should be boolean`,
    );
  }

  const positive = data.filter((r) => r.should_trigger === true).length;
  const negative = data.filter((r) => r.should_trigger === false).length;
  assert.ok(positive >= 8, `${name} should include at least 8 should_trigger: true`);
  assert.ok(negative >= 8, `${name} should include at least 8 should_trigger: false`);
}

console.log('skill-trigger-eval-examples: ok (%d example file(s))', files.length);
