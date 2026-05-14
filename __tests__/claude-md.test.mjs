/**
 * CLAUDE.md: mandatory self-check section for docs/skills PRs (aligned with CONTRIBUTING).
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CLAUDE = path.join(ROOT, 'CLAUDE.md');

assert.ok(fs.existsSync(CLAUDE), 'CLAUDE.md exists');

const content = fs.readFileSync(CLAUDE, 'utf8');

assert.match(
  content,
  /## Mandatory self-check \(docs \/ skills PRs\)/,
  'CLAUDE.md has the mandatory self-check heading',
);

const selfCheckKeys = [
  '**Pairing:**',
  '**Connector contract:**',
  '**Freshness:**',
  '**Inventory:**',
  '**Routing (if you touched discovery):**',
];
for (const key of selfCheckKeys) {
  assert.ok(
    content.includes(key),
    `CLAUDE.md self-check includes labeled item: ${key}`,
  );
}

assert.ok(
  content.includes('[`CONTRIBUTING.md`](./CONTRIBUTING.md)'),
  'CLAUDE.md self-check links to CONTRIBUTING.md',
);

console.log('claude-md: ok');
