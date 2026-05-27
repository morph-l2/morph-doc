/**
 * skills/README.md: symlink docs stay aligned with morph-skill-ln behavior.
 * @see scripts/morph-skill-ln
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const README = path.join(ROOT, 'skills', 'README.md');
const SCRIPT = path.join(ROOT, 'scripts', 'morph-skill-ln');

const content = fs.readFileSync(README, 'utf8');
const help = fs.readFileSync(SCRIPT, 'utf8');

assert.match(content, /## IDE discovery paths \(in-repo mirrors\)/);
assert.match(content, /project-local/i);
assert.match(content, /npm run skill-ln/);
assert.match(content, /npm run agent-ln/);
assert.match(
  content,
  /at least \*\*8\*\* `should_trigger: true` and \*\*8\*\* `false`/i,
  'eval set minimum should match skill-trigger-eval-examples.test.mjs',
);
assert.match(content, /skill-trigger-eval-examples\.test\.mjs/);
assert.match(content, /Using Morph skills from another repository/);
assert.match(content, /\$\{HOME\}\/\.cursor\/skills/);

assert.doesNotMatch(
  content,
  /symlink the corresponding directory to the global skills path/i,
  'removed misleading global-only symlink instruction',
);
assert.doesNotMatch(
  content,
  /## Correspondence with `doc_skill_id`/,
  'doc_skill_id is documented once under What is skills/',
);

assert.match(help, /inside the morph-doc repo/i, 'script help should say project-local');

assert.match(
  content,
  /defaults to \*\*cursor \+ claude \+ openclaw \+ windsurf\*\*/,
);
assert.match(content, /morph-\*\//);

console.log('skills-readme: ok');
