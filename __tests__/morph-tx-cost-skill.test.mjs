/**
 * Assert morph-tx-cost SKILL.md has frontmatter, key doc references, and related skill routing.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKILL_PATH = path.join(ROOT, 'skills/morph-tx-cost/SKILL.md');

const content = fs.readFileSync(SKILL_PATH, 'utf8');

assert.match(
  content,
  /^---\r?\nname:\s*morph-tx-cost\r?\n/,
  'frontmatter name should be morph-tx-cost'
);
assert.ok(content.includes('description:'), 'should include description field');
assert.ok(
  content.includes(
    'docs/build-on-morph/build-on-morph/4-understand-transaction-cost-on-morph.md'
  ),
  'should cite understand-transaction-cost doc as source of truth'
);
assert.ok(
  content.includes('l1Fee + l2Fee'),
  'should mention l1Fee + l2Fee (insufficient funds semantics or copy)'
);
assert.ok(
  content.includes('getL1Fee'),
  'should mention GasPriceOracle getL1Fee'
);
assert.ok(
  content.includes('docs/about-morph/10-altfeetx.md'),
  'should route token gas / AltFee to 10-altfeetx doc'
);
assert.ok(
  content.includes('morph-js-sdk'),
  'should route to morph-js-sdk'
);
assert.ok(content.includes('## Self-Check'), 'should include Self-Check section');

console.log('morph-tx-cost-skill: ok');
