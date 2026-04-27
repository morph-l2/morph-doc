/**
 * Sanity check for skills/morph-dapp-planning/SKILL.md:
 * frontmatter shape, key sections, and Morph-specific anchors.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKILL_PATH = path.join(ROOT, 'skills/morph-dapp-planning/SKILL.md');

const content = fs.readFileSync(SKILL_PATH, 'utf8');

assert.match(content, /^---\r?\n[\s\S]*?\r?\n---/, 'should have YAML frontmatter');
assert.match(content, /^name:\s*morph-dapp-planning\s*$/m, 'name must equal directory');
assert.match(content, /Use when|当用户/i, 'description should include trigger phrasing');

for (const heading of [
  '## When to use',
  '## Execution Steps',
  '## Self-Check',
  '## Related Skills',
]) {
  assert.ok(content.includes(heading), `should include section: ${heading}`);
}

for (const anchor of [
  'planning/',
  'Product brief',
  'Figma',
  'Goals',
  'Test Cases',
  'Target Files',
  'Morph Constraints',
  'Open Questions',
  'feeTokenID',
  'feeLimit',
  '2818',
  '2910',
]) {
  assert.ok(
    content.includes(anchor),
    `morph-dapp-planning SKILL should mention ${anchor}`
  );
}

console.log('morph-dapp-planning-skill: ok');
