/**
 * Assert morph-rails SKILL.md has frontmatter, key routing, and topic skill references.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKILL_PATH = path.join(ROOT, 'skills/morph-rails/SKILL.md');

const content = fs.readFileSync(SKILL_PATH, 'utf8');

assert.match(
  content,
  /^---\r?\nname:\s*morph-rails\r?\n/,
  'frontmatter name should be morph-rails'
);
assert.ok(content.includes('description:'), 'should include description field');
assert.ok(
  content.includes('docs/morph-rails/0-overview.md'),
  'should cite 0-overview as source of truth'
);
assert.ok(
  content.includes('docs/about-morph/morph-rails.md'),
  'should cite about-morph morph-rails'
);
assert.ok(
  content.includes('docs/morph-rails/agentic-payment/1-x402-facilitator.md'),
  'should route x402 details to 1-x402-facilitator doc'
);
assert.ok(
  content.includes('docs/about-morph/10-altfeetx.md'),
  'should route AltFee signing to 10-altfeetx doc'
);
assert.ok(
  content.includes('morph-js-sdk'),
  'should route to morph-js-sdk'
);
assert.ok(content.includes('## Self-Check'), 'should include Self-Check section');

console.log('morph-rails-skill: ok');
