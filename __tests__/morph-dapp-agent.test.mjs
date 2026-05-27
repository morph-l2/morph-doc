/**
 * Assert agents/morph-dapp-agent.md: frontmatter, default SKILL set existence,
 * routing rules, no auto-commit promise, pointer-only orchestration.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const AGENT_PATH = path.join(ROOT, 'agents/morph-dapp-agent.md');
const SKILLS_DIR = path.join(ROOT, 'skills');

assert.ok(fs.existsSync(AGENT_PATH), `morph-dapp-agent should exist: ${AGENT_PATH}`);

const content = fs.readFileSync(AGENT_PATH, 'utf8');
const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
assert.ok(fm, 'should have YAML frontmatter');

const block = fm[1];
function field(name) {
  const m = new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(block);
  return m ? m[1].trim() : null;
}

assert.equal(field('name'), 'morph-dapp-agent', 'frontmatter name must equal file stem');
const model = field('model');
assert.ok(model && model.length > 0, 'frontmatter should declare a default model');

const desc = field('description');
assert.ok(desc && desc.length > 40, 'description should be non-empty and substantive');
assert.match(desc, /Morph/, 'description should mention Morph');
assert.match(
  desc,
  /end[- ]to[- ]end|pipeline|planning|review/i,
  'description should convey end-to-end delivery scope',
);
assert.match(
  desc,
  /Use when|trigger|when the user/i,
  'description should include trigger phrasing so IDE routing can match it',
);

const REQUIRED_CHILD_SKILLS = [
  'morph-dapp-workflow',
  'morph-dapp-planning',
  'morph-dapp-codegen',
  'morph-dapp-code-review',
];

for (const skill of REQUIRED_CHILD_SKILLS) {
  assert.ok(
    content.includes(skill),
    `agent must reference child SKILL by name: ${skill}`,
  );
  assert.ok(
    fs.existsSync(path.join(SKILLS_DIR, skill, 'SKILL.md')),
    `child SKILL must exist on disk: skills/${skill}/SKILL.md`,
  );
}

assert.match(
  content,
  /Routing rules|Routing|路由/i,
  'agent should document explicit routing rules so single-step requests bypass the workflow',
);

assert.match(
  content,
  /pointer[- ]only|never inline|do not inline|never replicate/i,
  'agent must declare pointer-only orchestration (no SKILL-body copying)',
);

assert.ok(
  /never auto[\s-]?(commit|push)|do not auto[\s-]?(commit|push)|no auto[\s-]?(commit|push)/i.test(
    content,
  ),
  'agent must explicitly forbid auto commit/push',
);

assert.match(
  content,
  /morph-doc-agent/i,
  'agent should delineate scope against the sibling morph-doc-agent',
);

console.log('morph-dapp-agent: ok');
