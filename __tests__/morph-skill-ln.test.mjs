/**
 * morph-skill-ln: script exists, runs, --dry-run output matches expectations.
 */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const REPO_CURSOR_SKILLS = path.join(ROOT, '.cursor', 'skills').replace(/\\/g, '/');
const REPO_CLAUDE_SKILLS = path.join(ROOT, '.claude', 'skills').replace(/\\/g, '/');
const REPO_OPENCLAW_SKILLS = path.join(ROOT, '.openclaw', 'skills').replace(/\\/g, '/');
const REPO_WINDSURF_SKILLS = path.join(ROOT, '.windsurf', 'skills').replace(/\\/g, '/');
const SCRIPT = path.join(ROOT, 'scripts', 'morph-skill-ln');

assert.ok(fs.existsSync(SCRIPT), 'scripts/morph-skill-ln should exist');

function run(args, env = {}) {
  const r = spawnSync('bash', [SCRIPT, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
  return { status: r.status, stdout: r.stdout ?? '', stderr: r.stderr ?? '' };
}

const help = run(['--help']);
assert.equal(help.status, 0, '--help should succeed');
assert.match(help.stdout, /morph-skill-ln/, '--help should include script name');
assert.match(help.stdout, /--root|-r/, 'should document path options');
assert.match(help.stdout, /--agent|-a/, 'should document --agent');
assert.match(help.stdout, /--unlink/, 'should document --unlink');

const dry = run(['--dry-run'], { MORPH_DOC_ROOT: ROOT });
assert.equal(dry.status, 0, '--dry-run should succeed');
assert.match(dry.stdout, /ln -sfn/m, 'dry-run should print ln -sfn');
assert.ok(dry.stdout.includes(REPO_CURSOR_SKILLS), 'default should include cursor');
assert.ok(dry.stdout.includes(REPO_CLAUDE_SKILLS), 'default should include claude');
assert.ok(dry.stdout.includes(REPO_OPENCLAW_SKILLS), 'default should include openclaw');
assert.ok(dry.stdout.includes(REPO_WINDSURF_SKILLS), 'default should include windsurf');

const dryCursorOnly = run(['--dry-run', '-a', 'cursor'], {
  MORPH_DOC_ROOT: ROOT,
});
assert.equal(dryCursorOnly.status, 0);
assert.ok(dryCursorOnly.stdout.includes(REPO_CURSOR_SKILLS));
assert.doesNotMatch(dryCursorOnly.stdout, /\.claude\/skills/m);
assert.doesNotMatch(dryCursorOnly.stdout, /\.openclaw\/skills/m);
assert.doesNotMatch(dryCursorOnly.stdout, /\.windsurf\/skills/m);

const dryClaudeOnly = run(['--dry-run', '--root', ROOT, '--agent', 'claude']);
assert.equal(dryClaudeOnly.status, 0);
assert.ok(dryClaudeOnly.stdout.includes(REPO_CLAUDE_SKILLS));
assert.doesNotMatch(dryClaudeOnly.stdout, /\.cursor\/skills/m);

const dryOpenclawOnly = run(['--dry-run', '--root', ROOT, '-a', 'openclaw']);
assert.equal(dryOpenclawOnly.status, 0);
assert.ok(dryOpenclawOnly.stdout.includes(REPO_OPENCLAW_SKILLS));
assert.doesNotMatch(dryOpenclawOnly.stdout, /\.cursor\/skills/m);

const dryWindsurfOnly = run(['--dry-run', '--root', ROOT, '--agent', 'windsurf']);
assert.equal(dryWindsurfOnly.status, 0);
assert.ok(dryWindsurfOnly.stdout.includes(REPO_WINDSURF_SKILLS));
assert.doesNotMatch(dryWindsurfOnly.stdout, /\.cursor\/skills/m);

const dryWindsurfPath = run([
  '--dry-run',
  '--root',
  ROOT,
  '--agent',
  '.windsurf/skills',
]);
assert.equal(dryWindsurfPath.status, 0);
assert.ok(dryWindsurfPath.stdout.includes(REPO_WINDSURF_SKILLS));

const dryMulti = run([
  '--dry-run',
  '--agent',
  'cursor',
  '--agent',
  'codex',
  '--root',
  ROOT,
]);
assert.equal(dryMulti.status, 0);
assert.ok(dryMulti.stdout.includes(REPO_CURSOR_SKILLS));
assert.match(dryMulti.stdout, /\.codex\/skills/m);

const bad = run(['--nope']);
assert.notEqual(bad.status, 0, 'unknown flag should be non-zero');

const badAgent = run(['--dry-run', '--agent', 'not-a-valid-name-xyz']);
assert.notEqual(badAgent.status, 0, 'unknown builtin name without path-like token should fail');

const badRoot = run(['--root']);
assert.notEqual(badRoot.status, 0, '--root without path should fail');

const badAgentArg = run(['--agent']);
assert.notEqual(badAgentArg.status, 0, '--agent without value should fail');

const single = run(['--dry-run', 'morph-js-sdk'], { MORPH_DOC_ROOT: ROOT });
assert.equal(single.status, 0);
assert.match(single.stdout, /morph-js-sdk/m, 'single-skill dry-run should mention id');

// --unlink: temp symlink in repo; dry-run / real delete (skip if symlinks disallowed)
const UNLINK_TEST_ID = 'zzz-morph-skill-ln-unlink-test';
const cursorSkillsDir = path.join(ROOT, '.cursor', 'skills');
const unlinkTarget = path.join(cursorSkillsDir, UNLINK_TEST_ID);
const morphJsSdk = path.join(ROOT, 'skills', 'morph-js-sdk');
let symlinkOk = false;
try {
  fs.mkdirSync(cursorSkillsDir, { recursive: true });
  try {
    fs.unlinkSync(unlinkTarget);
  } catch {
    // ignore
  }
  fs.symlinkSync(morphJsSdk, unlinkTarget);
  symlinkOk = true;
} catch (e) {
  if (e && (e.code === 'EPERM' || e.code === 'EACCES')) {
    console.warn(
      'morph-skill-ln: skip unlink integration (symlink not permitted in this environment)'
    );
  } else {
    throw e;
  }
}

if (symlinkOk) {
  const dryUnlink = run(['--unlink', '--dry-run', '-a', 'cursor', UNLINK_TEST_ID], {
    MORPH_DOC_ROOT: ROOT,
  });
  assert.equal(dryUnlink.status, 0);
  assert.match(dryUnlink.stdout, /rm -f/m, 'unlink dry-run should print rm -f');
  assert.ok(fs.lstatSync(unlinkTarget).isSymbolicLink(), 'dry-run should not remove symlink');

  const realUnlink = run(['--unlink', '-a', 'cursor', UNLINK_TEST_ID], {
    MORPH_DOC_ROOT: ROOT,
  });
  assert.equal(realUnlink.status, 0);
  assert.ok(!fs.existsSync(unlinkTarget), 'unlink should remove symlink');
}

const unlinkMissing = run(['--unlink', '-a', 'cursor', 'nonexistent-skill-xyz'], {
  MORPH_DOC_ROOT: ROOT,
});
assert.notEqual(unlinkMissing.status, 0, 'unlink with no symlink should fail');

console.log('morph-skill-ln: ok');
