/**
 * Assert agents/morph-doc-agent.md: frontmatter, key conventions, discoverability.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const AGENT_PATH = path.join(ROOT, 'agents/morph-doc-agent.md');

assert.ok(fs.existsSync(AGENT_PATH), `morph-doc-agent should exist: ${AGENT_PATH}`);

const content = fs.readFileSync(AGENT_PATH, 'utf8');
const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
assert.ok(fm, 'should have YAML frontmatter');

const block = fm[1];
function field(name) {
  const m = new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(block);
  return m ? m[1].trim() : null;
}

assert.equal(field('name'), 'morph-doc-agent', 'frontmatter name');
const desc = field('description');
assert.ok(desc && desc.length > 20, 'description should be non-empty and substantive');
assert.match(desc, /SKILL|skill/i, 'description should mention SKILL/skill');
assert.match(content, /frontmatter|YAML/i, 'body should stress frontmatter/YAML');
assert.match(content, /skills\/<.*>\/SKILL\.md|skills\/morph-/i, 'should point to skills/<id>/SKILL.md path');
assert.match(
  content,
  /Doc-as-SKILL|SKILL\.md/i,
  'should reflect Doc-as-SKILL or SKILL.md'
);
assert.match(
  content,
  /existing skill|inventory|audit|Auditing|morph-doc-skill-inventory/i,
  'should describe existing-skill checks and point to morph-doc-skill-inventory tests'
);

console.log('morph-doc-agent: ok');
