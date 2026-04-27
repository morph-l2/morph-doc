/**
 * VISION.md: existence, SKILL-style frontmatter, key section anchors (match VISION.md headings).
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const VISION = path.join(ROOT, 'VISION.md');

assert.ok(fs.existsSync(VISION), 'VISION.md exists');

const content = fs.readFileSync(VISION, 'utf8');
assert.match(content, /^---\r?\n/, 'VISION.md has YAML frontmatter opening');

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = m[1];
  const name = /^name:\s*(.+)$/m.exec(fm);
  const desc = /^description:\s*(.+)$/m.exec(fm);
  return {
    name: name ? name[1].trim().replace(/^["']|["']$/g, '') : null,
    description: desc ? desc[1].trim() : null,
  };
}

const fm = parseFrontmatter(content);
assert.ok(fm, 'VISION.md frontmatter parseable');
assert.equal(fm.name, 'morph-vision', 'VISION.md name is morph-vision');
assert.ok(fm.description && fm.description.length > 20, 'VISION.md description is non-trivial');

const headings = [
  'Documentation as SKILL',
  'External Brain',
  'Developer Toolchain',
  'Write Docs to the SKILL Standard',
  'Execution Steps',
  'Self-Check',
];
for (const h of headings) {
  assert.ok(
    content.includes(h),
    `VISION.md contains heading/phrase: ${h}`
  );
}

console.log('vision-md: ok');
