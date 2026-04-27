/**
 * Pin webpack to a range compatible with Docusaurus 3.1 + webpackbar (ProgressPlugin options).
 * Webpack 5.97+ validates ProgressPlugin strictly; webpackbar 5.0.x passes legacy fields (name, color, reporters).
 * @see https://github.com/webpack/webpack/issues — keep in sync with package.json pnpm.overrides.webpack
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PKG = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

const PINNED = '5.96.1';

assert.equal(
  PKG.pnpm?.overrides?.webpack,
  PINNED,
  `package.json pnpm.overrides.webpack must be ${PINNED} (webpackbar + Docusaurus build)`,
);
assert.equal(
  PKG.devDependencies?.webpack,
  PINNED,
  `package.json devDependencies.webpack must be ${PINNED} so install resolves a single copy`,
);
assert.match(
  PKG.devDependencies?.typescript ?? '',
  /^[~^]?5\.(4|5|6|7|8|9)\./,
  'typescript should be >=5.4 for viem/ox peer (package.json devDependencies.typescript)',
);

const lockPath = path.join(ROOT, 'pnpm-lock.yaml');
assert.ok(fs.existsSync(lockPath), 'pnpm-lock.yaml exists');
const lockHead = fs.readFileSync(lockPath, 'utf8').slice(0, 800);
assert.match(
  lockHead,
  new RegExp(`overrides:\\s*\\n\\s*webpack:\\s*${PINNED.replace(/\./g, '\\.')}`),
  'pnpm-lock.yaml must record webpack override',
);

console.log('build-toolchain-constraints: ok');
