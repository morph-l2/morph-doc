/**
 * CONTRIBUTING.md: exists and retains the team norm section for the Morph
 * knowledge base (Skill as connector) plus pointers to AGENTS/VISION.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CONTRIBUTING = path.join(ROOT, 'CONTRIBUTING.md');

assert.ok(fs.existsSync(CONTRIBUTING), 'CONTRIBUTING.md exists');

const content = fs.readFileSync(CONTRIBUTING, 'utf8');

assert.match(
  content,
  /## Morph knowledge base: Skills as connectors/,
  'CONTRIBUTING.md has the Morph knowledge base / Skill connector section heading',
);

const requiredSubstrings = [
  'CLAUDE.md',
  'AGENTS.md',
  'VISION.md',
  'doc_skill_id',
  'npm test',
  '`docs/`',
  '`skills/`',
  'Related Skills',
  'sidebars-skills.js',
  'Three layers',
  'Working with Claude Code',
];
for (const s of requiredSubstrings) {
  assert.ok(
    content.includes(s),
    `CONTRIBUTING.md contains expected fragment: ${s}`,
  );
}

console.log('contributing-md: ok');
