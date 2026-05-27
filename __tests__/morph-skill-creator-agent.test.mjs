/**
 * agents/morph-skill-creator-agent.md frontmatter and routing pointers.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const AGENT_PATH = path.join(ROOT, 'agents/morph-skill-creator-agent.md');

assert.ok(fs.existsSync(AGENT_PATH), AGENT_PATH);

const content = fs.readFileSync(AGENT_PATH, 'utf8');
const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
assert.ok(fm, 'YAML frontmatter');

const block = fm[1];
function field(name) {
  const m = new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(block);
  return m ? m[1].trim() : null;
}

assert.equal(field('name'), 'morph-skill-creator-agent');
assert.ok(field('model')?.length > 0);
const desc = field('description');
assert.ok(desc && desc.length > 20);
assert.match(desc, /skill-creator|eval/i);
assert.match(desc, /Use when|when the user/i);
assert.match(content, /morph-skill-creator\/SKILL\.md|skills\/morph-skill-creator/);
assert.match(content, /morph-doc-agent/);
assert.match(content, /skills\/README\.md|skill-ln/i);
assert.match(content, /npm test/);

console.log('morph-skill-creator-agent: ok');
