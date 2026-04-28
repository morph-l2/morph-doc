/**
 * Run __tests__/*.test.mjs in order (package.json invokes only this script to avoid long chains).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const TEST_DIR = path.join(ROOT, '__tests__');

/** @type {readonly string[]} */
export const TEST_FILES = [
  'run-tests-manifest.test.mjs',
  'build-toolchain-constraints.test.mjs',
  'doc-skill-pairing.test.mjs',
  'morph-doc-skill-inventory.test.mjs',
  'morph-contracts-skill-tokenlist.test.mjs',
  'skills-sidebar.test.mjs',
  'vision-md.test.mjs',
  'morph-js-sdk-skill.test.mjs',
  'morph-rails-skill.test.mjs',
  'morph-tx-cost-skill.test.mjs',
  'morph-doc-agent.test.mjs',
  'morph-dapp-agent.test.mjs',
  'morph-skill-ln.test.mjs',
  'morph-agent-ln.test.mjs',
  'morph-dapp-planning-skill.test.mjs',
  'morph-dapp-codegen-skill.test.mjs',
  'morph-dapp-code-review-skill.test.mjs',
  'morph-dapp-workflow-skill.test.mjs',
  'agent-driven-development-workflow-doc.test.mjs',
  'agents-sidebar.test.mjs',
  'examples-viem-alt-fee.test.mjs',
  'is-alt-fee.test.mjs',
  'markdown-actions-routes.test.mjs',
  'markdown-source-export.test.mjs',
  'mdx-navigation-pages.test.mjs',
];

function main() {
  for (const name of TEST_FILES) {
    const full = path.join(TEST_DIR, name);
    if (!fs.existsSync(full)) {
      console.error(`Missing test file: ${name}`);
      process.exit(1);
    }
    const r = spawnSync(process.execPath, [full], { stdio: 'inherit', cwd: ROOT });
    if (r.error) {
      console.error(r.error);
      process.exit(1);
    }
    if (r.status !== 0) {
      process.exit(r.status ?? 1);
    }
  }
}

const isMain =
  import.meta.url === pathToFileURL(path.resolve(process.argv[1] ?? '')).href;
if (isMain) {
  main();
}
