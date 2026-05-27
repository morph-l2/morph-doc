/**
 * morph-agent-ln: script exists, runs, --dry-run output matches expectations.
 * Mirrors __tests__/morph-skill-ln.test.mjs but targets agents/<name>.md → .cursor/agents etc.
 */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const REPO_CURSOR_AGENTS = path.join(ROOT, '.cursor', 'agents').replace(/\\/g, '/');
const REPO_CLAUDE_AGENTS = path.join(ROOT, '.claude', 'agents').replace(/\\/g, '/');
const REPO_OPENCLAW_AGENTS = path.join(ROOT, '.openclaw', 'agents').replace(/\\/g, '/');
const REPO_WINDSURF_AGENTS = path.join(ROOT, '.windsurf', 'agents').replace(/\\/g, '/');
const SCRIPT = path.join(ROOT, 'scripts', 'morph-agent-ln');

assert.ok(fs.existsSync(SCRIPT), 'scripts/morph-agent-ln should exist');
const st = fs.statSync(SCRIPT);
assert.ok((st.mode & 0o111) !== 0, 'scripts/morph-agent-ln should be executable');

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
assert.match(help.stdout, /morph-agent-ln/, '--help should include script name');
assert.match(help.stdout, /--root|-r/, 'should document path options');
assert.match(help.stdout, /--agent|-a/, 'should document --agent');
assert.match(help.stdout, /--unlink/, 'should document --unlink');
assert.match(help.stdout, /agents\/morph-\*\.md/, '--help should mention batch glob');

const dry = run(['--dry-run'], { MORPH_DOC_ROOT: ROOT });
assert.equal(dry.status, 0, '--dry-run should succeed');
assert.match(dry.stdout, /ln -sfn/m, 'dry-run should print ln -sfn');
assert.ok(dry.stdout.includes(REPO_CURSOR_AGENTS), 'default should include cursor agents path');
assert.ok(dry.stdout.includes(REPO_CLAUDE_AGENTS), 'default should include claude agents path');
assert.ok(dry.stdout.includes(REPO_OPENCLAW_AGENTS), 'default should include openclaw agents path');
assert.ok(dry.stdout.includes(REPO_WINDSURF_AGENTS), 'default should include windsurf agents path');
assert.match(dry.stdout, /morph-doc-agent\.md/, 'batch dry-run should emit morph-doc-agent.md');
assert.match(dry.stdout, /morph-dapp-agent\.md/, 'batch dry-run should emit morph-dapp-agent.md');
assert.doesNotMatch(dry.stdout, /\.cursor\/skills|\.claude\/skills/, 'must not target skills dirs');

const dryCursorOnly = run(['--dry-run', '-a', 'cursor'], {
  MORPH_DOC_ROOT: ROOT,
});
assert.equal(dryCursorOnly.status, 0);
assert.ok(dryCursorOnly.stdout.includes(REPO_CURSOR_AGENTS));
assert.doesNotMatch(dryCursorOnly.stdout, /\.claude\/agents/m);
assert.doesNotMatch(dryCursorOnly.stdout, /\.openclaw\/agents/m);
assert.doesNotMatch(dryCursorOnly.stdout, /\.windsurf\/agents/m);

const dryClaudeOnly = run(['--dry-run', '--root', ROOT, '--agent', 'claude']);
assert.equal(dryClaudeOnly.status, 0);
assert.ok(dryClaudeOnly.stdout.includes(REPO_CLAUDE_AGENTS));
assert.doesNotMatch(dryClaudeOnly.stdout, /\.cursor\/agents/m);

const dryWindsurfPath = run([
  '--dry-run',
  '--root',
  ROOT,
  '--agent',
  '.windsurf/agents',
]);
assert.equal(dryWindsurfPath.status, 0);
assert.ok(dryWindsurfPath.stdout.includes(REPO_WINDSURF_AGENTS));

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
assert.ok(dryMulti.stdout.includes(REPO_CURSOR_AGENTS));
assert.match(dryMulti.stdout, /\.codex\/agents/m);

const bad = run(['--nope']);
assert.notEqual(bad.status, 0, 'unknown flag should be non-zero');

const badAgent = run(['--dry-run', '--agent', 'not-a-valid-name-xyz']);
assert.notEqual(badAgent.status, 0, 'unknown builtin name without path-like token should fail');

const badRoot = run(['--root']);
assert.notEqual(badRoot.status, 0, '--root without path should fail');

const badAgentArg = run(['--agent']);
assert.notEqual(badAgentArg.status, 0, '--agent without value should fail');

const single = run(['--dry-run', 'morph-dapp-agent'], { MORPH_DOC_ROOT: ROOT });
assert.equal(single.status, 0);
assert.match(single.stdout, /morph-dapp-agent\.md/m, 'single dry-run should mention the file');
assert.doesNotMatch(single.stdout, /morph-doc-agent\.md/m, 'single mode should not link others');

const singleWithExt = run(['--dry-run', 'morph-dapp-agent.md'], { MORPH_DOC_ROOT: ROOT });
assert.equal(singleWithExt.status, 0);
assert.match(singleWithExt.stdout, /morph-dapp-agent\.md/m, 'trailing .md is accepted');

const singleMissing = run(['--dry-run', 'does-not-exist-agent'], {
  MORPH_DOC_ROOT: ROOT,
});
assert.notEqual(singleMissing.status, 0, 'missing source agent should fail');

// --unlink: temp symlink in repo; dry-run / real delete (skip if symlinks disallowed)
const UNLINK_TEST_NAME = 'zzz-morph-agent-ln-unlink-test';
const cursorAgentsDir = path.join(ROOT, '.cursor', 'agents');
const unlinkTarget = path.join(cursorAgentsDir, `${UNLINK_TEST_NAME}.md`);
const morphDappAgent = path.join(ROOT, 'agents', 'morph-dapp-agent.md');
let symlinkOk = false;
try {
  fs.mkdirSync(cursorAgentsDir, { recursive: true });
  try {
    fs.unlinkSync(unlinkTarget);
  } catch {
    // ignore
  }
  fs.symlinkSync(morphDappAgent, unlinkTarget);
  symlinkOk = true;
} catch (e) {
  if (e && (e.code === 'EPERM' || e.code === 'EACCES')) {
    console.warn(
      'morph-agent-ln: skip unlink integration (symlink not permitted in this environment)',
    );
  } else {
    throw e;
  }
}

if (symlinkOk) {
  const dryUnlink = run(['--unlink', '--dry-run', '-a', 'cursor', UNLINK_TEST_NAME], {
    MORPH_DOC_ROOT: ROOT,
  });
  assert.equal(dryUnlink.status, 0);
  assert.match(dryUnlink.stdout, /rm -f/m, 'unlink dry-run should print rm -f');
  assert.ok(fs.lstatSync(unlinkTarget).isSymbolicLink(), 'dry-run should not remove symlink');

  const realUnlink = run(['--unlink', '-a', 'cursor', UNLINK_TEST_NAME], {
    MORPH_DOC_ROOT: ROOT,
  });
  assert.equal(realUnlink.status, 0);
  assert.ok(!fs.existsSync(unlinkTarget), 'unlink should remove symlink');
}

const unlinkMissing = run(['--unlink', '-a', 'cursor', 'nonexistent-agent-xyz'], {
  MORPH_DOC_ROOT: ROOT,
});
assert.notEqual(unlinkMissing.status, 0, 'unlink with no symlink should fail');

console.log('morph-agent-ln: ok');
