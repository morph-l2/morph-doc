/**
 * morph-skill-creator bridge: path resolution and CLI smoke.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  resolveSkillCreatorInstall,
  resolveTriggerEvalSetPath,
} from '../scripts/lib/skill-creator-path.mjs';
import {
  skillCreatorRequirementsPath,
  skillCreatorVenvDir,
} from '../scripts/lib/skill-creator-python.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const requirementsPath = skillCreatorRequirementsPath(ROOT);
assert.ok(fs.existsSync(requirementsPath), 'skill-creator-requirements.txt should exist');
assert.match(
  fs.readFileSync(requirementsPath, 'utf8'),
  /PyYAML/i,
  'skill-creator Python requirements should include PyYAML',
);
assert.equal(
  skillCreatorVenvDir(ROOT),
  path.join(ROOT, '.local', 'skill-creator-venv'),
  'skill-creator venv lives under .local/',
);

const evalPath = resolveTriggerEvalSetPath(ROOT, 'morph-js-sdk');
assert.ok(evalPath, 'morph-js-sdk trigger eval example should resolve');
assert.ok(evalPath.includes('skill-trigger-evals.morph-js-sdk'), evalPath);

const bridgeEval = resolveTriggerEvalSetPath(ROOT, 'morph-bridge');
assert.ok(bridgeEval, 'morph-bridge trigger eval example should resolve');
assert.ok(bridgeEval.includes('skill-trigger-evals.morph-bridge'), bridgeEval);

assert.equal(
  resolveTriggerEvalSetPath(ROOT, '__nonexistent-skill-for-test__'),
  null,
  'unknown skill id should resolve to no trigger eval set',
);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'morph-skill-creator-'));
const fakeCreator = path.join(tmp, 'skill-creator');
fs.mkdirSync(path.join(fakeCreator, 'scripts'), { recursive: true });
fs.writeFileSync(path.join(fakeCreator, 'SKILL.md'), '---\nname: skill-creator\n---\n', 'utf8');
fs.writeFileSync(path.join(fakeCreator, 'scripts', 'run_loop.py'), '# stub\n', 'utf8');
fs.writeFileSync(path.join(fakeCreator, 'scripts', 'run_eval.py'), '# stub\n', 'utf8');
fs.writeFileSync(path.join(fakeCreator, 'scripts', 'quick_validate.py'), '# stub\n', 'utf8');
fs.writeFileSync(
  path.join(fakeCreator, 'scripts', 'aggregate_benchmark.py'),
  '# stub\n',
  'utf8',
);

const prev = process.env.MORPH_SKILL_CREATOR_ROOT;
process.env.MORPH_SKILL_CREATOR_ROOT = fakeCreator;
assert.equal(resolveSkillCreatorInstall()?.root, fakeCreator);

const incomplete = path.join(tmp, 'skill-creator-incomplete');
fs.mkdirSync(path.join(incomplete, 'scripts'), { recursive: true });
fs.writeFileSync(path.join(incomplete, 'SKILL.md'), '---\nname: skill-creator\n---\n', 'utf8');
fs.writeFileSync(path.join(incomplete, 'scripts', 'run_loop.py'), '# stub\n', 'utf8');
fs.writeFileSync(path.join(incomplete, 'scripts', 'run_eval.py'), '# stub\n', 'utf8');
process.env.MORPH_SKILL_CREATOR_ROOT = incomplete;
assert.throws(
  () => resolveSkillCreatorInstall(),
  /incomplete|missing/i,
  'resolveSkillCreatorInstall should throw when helper scripts are missing',
);
process.env.MORPH_SKILL_CREATOR_ROOT = fakeCreator;
if (prev === undefined) delete process.env.MORPH_SKILL_CREATOR_ROOT;
else process.env.MORPH_SKILL_CREATOR_ROOT = prev;

const help = spawnSync(process.execPath, ['scripts/morph-skill-creator.mjs', '--help'], {
  cwd: ROOT,
  encoding: 'utf8',
});
assert.equal(help.status, 0, help.stderr || help.stdout);
assert.match(help.stdout, /desc-loop/);
assert.match(help.stdout, /run-eval/);

const missingEval = spawnSync(
  process.execPath,
  ['scripts/morph-skill-creator.mjs', 'run-eval', 'morph-tx-cost'],
  {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, MORPH_SKILL_CREATOR_ROOT: fakeCreator },
  },
);
assert.notEqual(missingEval.status, 0, 'run-eval should fail without trigger eval set');
assert.match(
  `${missingEval.stdout}${missingEval.stderr}`,
  /No trigger eval set/i,
);

const validate = spawnSync(
  process.execPath,
  ['scripts/morph-skill-creator.mjs', 'validate', 'morph-js-sdk'],
  { cwd: ROOT, encoding: 'utf8' },
);
assert.equal(validate.status, 0, validate.stderr || validate.stdout);

console.log('morph-skill-creator: ok');
