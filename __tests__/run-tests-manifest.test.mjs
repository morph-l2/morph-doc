/**
 * Ensure every __tests__/*.test.mjs is listed in scripts/run-tests.mjs TEST_FILES
 * so new tests are not omitted from `pnpm test`.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEST_FILES } from '../scripts/run-tests.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const onDisk = fs
  .readdirSync(__dirname)
  .filter((f) => f.endsWith('.test.mjs'))
  .sort();
const listed = [...TEST_FILES].sort();

assert.deepEqual(
  onDisk,
  listed,
  '__tests__/*.test.mjs must match TEST_FILES in scripts/run-tests.mjs',
);
