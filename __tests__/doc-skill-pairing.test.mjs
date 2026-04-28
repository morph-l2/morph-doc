/**
 * Doc ↔ skill pairing: assert doc frontmatter doc_skill_id matches
 * skills/<id>/SKILL.md name (canonical repo-root paths).
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const PAIRS = [
  {
    docRelative:
      'docs/build-on-morph/developer-resources/node-operation/full-node/1-run-in-docker.md',
    expectedId: 'morph-full-node-run-in-docker',
  },
  {
    docRelative: 'docs/build-on-morph/sdk/js-sdk.mdx',
    expectedId: 'morph-js-sdk',
  },
  {
    docRelative: 'docs/build-on-morph/developer-resources/1-contracts.md',
    expectedId: 'morph-contracts',
  },
  {
    docRelative: 'docs/morph-rails/0-overview.md',
    expectedId: 'morph-rails',
  },
  {
    docRelative:
      'docs/build-on-morph/build-on-morph/4-understand-transaction-cost-on-morph.md',
    expectedId: 'morph-tx-cost',
  },
  {
    docRelative:
      'docs/build-on-morph/build-on-morph/7-agent-driven-development-workflow.md',
    expectedId: 'morph-dapp-workflow',
  },
];

function parseFrontmatterField(content, field) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = m[1];
  const line = new RegExp(`^${field}:\\s*(.+)$`, 'm').exec(fm);
  return line ? line[1].trim().replace(/^["']|["']$/g, '') : null;
}

function readSkillName(skillPath) {
  const content = fs.readFileSync(skillPath, 'utf8');
  return parseFrontmatterField(content, 'name');
}

for (const { docRelative, expectedId } of PAIRS) {
  const docPath = path.join(ROOT, docRelative);
  assert.ok(fs.existsSync(docPath), `doc should exist: ${docRelative}`);

  const docContent = fs.readFileSync(docPath, 'utf8');
  const docSkillId = parseFrontmatterField(docContent, 'doc_skill_id');
  assert.equal(
    docSkillId,
    expectedId,
    `${docRelative} doc_skill_id should be ${expectedId}`
  );

  const skillPath = path.join(ROOT, 'skills', expectedId, 'SKILL.md');
  assert.ok(fs.existsSync(skillPath), `SKILL.md should exist: ${expectedId}`);

  const skillName = readSkillName(skillPath);
  assert.equal(
    skillName,
    expectedId,
    `SKILL name should match doc_skill_id: ${expectedId}`
  );
}

console.log('doc-skill-pairing: ok (%d pairs)', PAIRS.length);
