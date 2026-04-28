/**
 * MarkdownActionsDropdown + Root injection: eligible pathnames (docs + skills + agents plugins).
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { isMarkdownActionsPathname } = require('../src/utils/isMarkdownActionsPathname.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

assert.equal(isMarkdownActionsPathname('/docs/foo/bar'), true);
assert.equal(isMarkdownActionsPathname('/skills/README'), true);
assert.equal(isMarkdownActionsPathname('/skills/morphchain-bridge/SKILL'), true);
assert.equal(isMarkdownActionsPathname('/agents/morph-doc-agent'), true);
assert.equal(isMarkdownActionsPathname('/blog/post'), false);
assert.equal(isMarkdownActionsPathname('/'), false);
assert.equal(isMarkdownActionsPathname(''), false);

const rootSrc = fs.readFileSync(path.join(ROOT, 'src/theme/Root.js'), 'utf8');
const dropdownSrc = fs.readFileSync(
  path.join(ROOT, 'src/components/MarkdownActionsDropdown/index.js'),
  'utf8'
);
assert.ok(
  rootSrc.includes("from '../utils/isMarkdownActionsPathname'"),
  'Root.js should use isMarkdownActionsPathname'
);
assert.ok(
  dropdownSrc.includes("from '../../utils/isMarkdownActionsPathname'"),
  'MarkdownActionsDropdown should use isMarkdownActionsPathname'
);
assert.ok(
  !rootSrc.includes("pathname.startsWith('/docs/')"),
  'Root.js should not gate injection on /docs/ only'
);

console.log('markdown-actions-routes: ok');
