/**
 * Sanity check for skills/morph-dapp-workflow/SKILL.md:
 * frontmatter (incl. metadata.orchestrates), three-stage flow,
 * pointers to child skills, no auto-commit promise.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKILL_PATH = path.join(ROOT, 'skills/morph-dapp-workflow/SKILL.md');
const SKILLS_DIR = path.join(ROOT, 'skills');

const content = fs.readFileSync(SKILL_PATH, 'utf8');

assert.match(content, /^---\r?\n[\s\S]*?\r?\n---/, 'should have YAML frontmatter');
assert.match(content, /^name:\s*morph-dapp-workflow\s*$/m, 'name must equal directory');
assert.match(content, /Use when|当用户/i, 'description should include trigger phrasing');

const ORCHESTRATES = [
  'morph-dapp-planning',
  'morph-dapp-codegen',
  'morph-dapp-code-review',
];

for (const child of ORCHESTRATES) {
  assert.ok(
    content.includes(child),
    `workflow should reference child skill: ${child}`
  );
  assert.ok(
    fs.existsSync(path.join(SKILLS_DIR, child, 'SKILL.md')),
    `orchestrated child must exist on disk: skills/${child}/SKILL.md`
  );
}

assert.match(
  content,
  /metadata:\s*\r?\n\s*orchestrates:/,
  'frontmatter should declare metadata.orchestrates'
);

for (const stage of ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4']) {
  assert.ok(content.includes(stage), `should describe ${stage}`);
}

assert.ok(
  /never auto[\s-]?(commit|push)|do not auto[\s-]?(commit|push)|no auto[\s-]?(commit|push)/i.test(
    content
  ),
  'workflow must explicitly forbid auto commit/push'
);

console.log('morph-dapp-workflow-skill: ok');
