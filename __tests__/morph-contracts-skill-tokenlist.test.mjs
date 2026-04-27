/**
 * Keep skills/morph-contracts/SKILL.md in sync with morph-bridge mainnet tokenList.json
 * when the bridge repo is present (sibling: ../morph-bridge/...).
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKILL_PATH = path.join(ROOT, 'skills', 'morph-contracts', 'SKILL.md');
const TOKEN_LIST_PATH = path.join(
  ROOT,
  '..',
  'morph-bridge',
  'public',
  'morph-list',
  'src',
  'mainnet',
  'tokenList.json',
);

function normAddr(a) {
  return String(a).trim().toLowerCase();
}

function main() {
  if (!fs.existsSync(TOKEN_LIST_PATH)) {
    console.log(
      'morph-contracts-skill-tokenlist: skip (no morph-bridge tokenList at %s)',
      TOKEN_LIST_PATH,
    );
    return;
  }

  const raw = fs.readFileSync(TOKEN_LIST_PATH, 'utf8');
  const data = JSON.parse(raw);
  assert.ok(Array.isArray(data.tokens), 'tokenList.json should have tokens[]');

  const skill = fs.readFileSync(SKILL_PATH, 'utf8');
  const skillLower = skill.toLowerCase();

  for (const t of data.tokens) {
    const cid = String(t.chainId);
    if (cid !== '1' && cid !== '2818') continue;
    const addr = normAddr(t.address);
    assert.match(addr, /^0x[0-9a-f]{40}$/, `token address shape: ${t.symbol}`);
    assert.ok(
      skillLower.includes(addr),
      `SKILL.md should include L1/L2 address ${addr} (${t.symbol}, chainId ${cid}) from tokenList.json`,
    );
  }

  assert.ok(
    skill.includes('tokenList.json') && skill.includes('morph-bridge'),
    'SKILL.md should reference morph-bridge tokenList.json as canonical bridge list',
  );

  console.log(
    'morph-contracts-skill-tokenlist: ok (%d tokens checked)',
    data.tokens.length,
  );
}

main();
