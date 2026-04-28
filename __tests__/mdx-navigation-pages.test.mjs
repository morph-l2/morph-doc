/**
 * With `markdown.format: 'detect'` (docusaurus.config.js), only `.mdx` is compiled as MDX.
 * Navigation pages use `import` + `<Card />`; they must stay `.mdx` or components won't render.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const MDX_NAV_PAGES = [
  'docs/build-on-morph/0-developer-navigation-page.mdx',
  'docs/about-morph/0-user-navigation-page.mdx',
];

for (const rel of MDX_NAV_PAGES) {
  const abs = path.join(ROOT, rel);
  assert.ok(fs.existsSync(abs), `expected ${rel} to exist`);
  assert.ok(rel.endsWith('.mdx'), `${rel} must use .mdx for MDX (import/JSX)`);
  const raw = fs.readFileSync(abs, 'utf8');
  assert.ok(
    raw.includes("from '@site/src/components/Card'") || raw.includes('from "@site/src/components/Card"'),
    `${rel} must import Card from @site/src/components/Card`,
  );
  assert.ok(raw.includes('<CardGroup'), `${rel} must render CardGroup`);
}

console.log('mdx-navigation-pages: ok');
