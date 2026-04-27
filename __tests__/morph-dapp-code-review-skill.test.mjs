/**
 * Sanity check for skills/morph-dapp-code-review/SKILL.md:
 * frontmatter, four review dimensions, output schema, Morph-specific checks.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKILL_PATH = path.join(ROOT, 'skills/morph-dapp-code-review/SKILL.md');

const content = fs.readFileSync(SKILL_PATH, 'utf8');

assert.match(content, /^---\r?\n[\s\S]*?\r?\n---/, 'should have YAML frontmatter');
assert.match(content, /^name:\s*morph-dapp-code-review\s*$/m, 'name must equal directory');
assert.match(content, /Use when|当用户/i, 'description should include trigger phrasing');

for (const heading of [
  '## When to use',
  '## Dimension Checklist',
  '## Execution Steps',
  '## Output Format',
  '## Self-Check',
  '## Related Skills',
]) {
  assert.ok(content.includes(heading), `should include section: ${heading}`);
}

for (const dim of [
  '### 1. Security',
  '### 2. Performance',
  '### 3. Code Quality',
  '### 4. Planning compliance',
]) {
  assert.ok(content.includes(dim), `should describe dimension: ${dim}`);
}

for (const sev of ['P0', 'P1', 'P2']) {
  assert.ok(content.includes(sev), `should mention severity ${sev}`);
}

for (const anchor of [
  'feeTokenID',
  '2818',
  '2910',
  'GasPriceOracle',
  'read-only',
]) {
  assert.ok(
    content.includes(anchor),
    `morph-dapp-code-review SKILL should mention ${anchor}`
  );
}

console.log('morph-dapp-code-review-skill: ok');
