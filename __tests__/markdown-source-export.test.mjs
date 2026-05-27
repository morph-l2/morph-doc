/**
 * plugins/markdown-source-plugin.js must export cleaned .md for docs, skills, and agents into build/.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN = path.join(__dirname, '..', 'plugins', 'markdown-source-plugin.js');
const src = fs.readFileSync(PLUGIN, 'utf8');

assert.match(src, /MARKDOWN_EXPORT_SOURCES\s*=\s*\[/, 'MARKDOWN_EXPORT_SOURCES array exists');
for (const sub of ['docs', 'skills', 'agents']) {
  assert.ok(
    src.includes(`sourceSubdir: '${sub}'`) && src.includes(`outSubdir: '${sub}'`),
    `export config must include ${sub}`,
  );
}

console.log('markdown-source-export: ok');
