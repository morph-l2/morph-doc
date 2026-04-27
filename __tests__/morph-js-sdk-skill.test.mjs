/**
 * Assert morph-js-sdk SKILL.md has a minimal-example section and key identifiers aligned with docs.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKILL_PATH = path.join(ROOT, 'skills/morph-js-sdk/SKILL.md');

const content = fs.readFileSync(SKILL_PATH, 'utf8');

assert.ok(content.includes('## Minimal Example'), 'SKILL should include a Minimal Example section');
assert.ok(content.includes('morphHoodiTestnet'), 'Viem snippet should include morphHoodiTestnet');
assert.ok(content.includes('MorphSigner'), 'Ethers snippet should include MorphSigner');
assert.ok(content.includes('feeTokenID'), 'examples should include feeTokenID');
assert.ok(content.includes('feeLimit'), 'examples should include feeLimit');
assert.match(content, /```typescript\n[\s\S]*```\n[\s\S]*```typescript/, 'should include at least two typescript fenced blocks');

console.log('morph-js-sdk-skill: ok');
