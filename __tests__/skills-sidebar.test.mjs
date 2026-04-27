/**
 * sidebars-skills.js doc ids must match each skills/<id>/SKILL.md (avoid missing nav entries).
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, 'skills');
const SIDEBAR_FILE = path.join(ROOT, 'sidebars-skills.js');

const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
const expectedIds = entries
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort()
  .map((id) => `${id}/SKILL`);

const sidebarSrc = fs.readFileSync(SIDEBAR_FILE, 'utf8');
const listed = [...sidebarSrc.matchAll(/id:\s*['"]([^'"]+)['"]/g)]
  .map((m) => m[1])
  .filter((id) => id !== 'README');

listed.sort();
const sortedExpected = [...expectedIds].sort();

assert.deepEqual(
  listed,
  sortedExpected,
  'sidebars-skills.js Skill playbook doc ids must match skills/*/SKILL.md directories (update sidebar when adding a skill)'
);

console.log('skills-sidebar: ok (%d skills)', expectedIds.length);
