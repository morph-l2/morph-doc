/**
 * Sanity check for docs/build-on-morph/build-on-morph/7-agent-driven-development-workflow.md:
 * this page is the human-readable *entry dispatcher* for every Morph dApp Agent Skill
 * in this repo. Guard its key routing anchors so it does not silently degrade to a
 * single-skill companion page.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DOC_PATH = path.join(
  ROOT,
  'docs/build-on-morph/build-on-morph/7-agent-driven-development-workflow.md'
);

const content = fs.readFileSync(DOC_PATH, 'utf8');

assert.match(content, /^---\r?\n[\s\S]*?\r?\n---/, 'should have YAML frontmatter');
assert.match(
  content,
  /^doc_skill_id:\s*morph-dapp-workflow\s*$/m,
  'doc_skill_id must pair with morph-dapp-workflow'
);

for (const heading of [
  '## Pick your entry Skill',
  '## Quick decision tree',
  '## The end-to-end path: morph-dapp-workflow',
  '### Stage 1',
  '### Stage 2',
  '### Stage 3',
  '## Driving the flow from your IDE',
  '## See also',
]) {
  assert.ok(content.includes(heading), `dispatcher doc should include section: ${heading}`);
}

const DISPATCH_TARGETS = [
  '/skills/morph-dapp-workflow/SKILL',
  '/skills/morph-dapp-planning/SKILL',
  '/skills/morph-dapp-codegen/SKILL',
  '/skills/morph-dapp-code-review/SKILL',
  '/skills/morph-js-sdk/SKILL',
  '/skills/morph-contracts/SKILL',
  '/skills/morph-tx-cost/SKILL',
  '/skills/morph-rails/SKILL',
  '/skills/morph-skill-ln/SKILL',
  '/skills/morph-full-node-run-in-docker/SKILL',
];
for (const link of DISPATCH_TARGETS) {
  assert.ok(
    content.includes(link),
    `dispatcher doc must link to every routable Skill; missing ${link}`
  );
}

for (const anchor of [
  'morph-dapp-workflow',
  'feeTokenID',
  'feeLimit',
  '2818',
  '2910',
  'GasPriceOracle',
  'P0',
]) {
  assert.ok(content.includes(anchor), `dispatcher doc should mention ${anchor}`);
}

console.log('agent-driven-development-workflow-doc: ok');
