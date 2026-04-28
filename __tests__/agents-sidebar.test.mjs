/**
 * sidebars-agents.js doc ids must match agents/*.md (top-level only).
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const AGENTS_DIR = path.join(ROOT, 'agents');
const SIDEBAR_FILE = path.join(ROOT, 'sidebars-agents.js');

const mdFiles = fs
  .readdirSync(AGENTS_DIR)
  .filter((f) => f.endsWith('.md'))
  .sort();

const expectedIds = mdFiles.map((f) => path.basename(f, '.md')).sort();

const sidebarSrc = fs.readFileSync(SIDEBAR_FILE, 'utf8');
const listed = [...sidebarSrc.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
listed.sort();

assert.deepEqual(
  listed,
  expectedIds,
  'sidebars-agents.js doc ids must match agents/*.md (update sidebar when adding an agent doc)',
);

console.log('agents-sidebar: ok (%d pages)', expectedIds.length);
