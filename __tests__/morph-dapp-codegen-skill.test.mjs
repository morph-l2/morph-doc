/**
 * Sanity check for skills/morph-dapp-codegen/SKILL.md:
 * frontmatter shape, TDD red/green flow, and Morph-specific guardrails.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKILL_PATH = path.join(ROOT, 'skills/morph-dapp-codegen/SKILL.md');

const content = fs.readFileSync(SKILL_PATH, 'utf8');

assert.match(content, /^---\r?\n[\s\S]*?\r?\n---/, 'should have YAML frontmatter');
assert.match(content, /^name:\s*morph-dapp-codegen\s*$/m, 'name must equal directory');
assert.match(content, /Use when|当用户/i, 'description should include trigger phrasing');

for (const heading of [
  '## When to use',
  '## Prerequisites',
  '## Execution Steps',
  '## Self-Check',
  '## Related Skills',
]) {
  assert.ok(content.includes(heading), `should include section: ${heading}`);
}

for (const phase of ['Phase 1', 'Phase 2', 'Phase 3']) {
  assert.ok(content.includes(phase), `should describe ${phase}`);
}

for (const anchor of [
  'feeTokenID',
  'feeLimit',
  '@morph-network/chain',
  'GasPriceOracle',
  'morph-dapp-planning',
  'morph-dapp-code-review',
]) {
  assert.ok(
    content.includes(anchor),
    `morph-dapp-codegen SKILL should mention ${anchor}`
  );
}

console.log('morph-dapp-codegen-skill: ok');
