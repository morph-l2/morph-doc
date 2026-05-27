#!/usr/bin/env node
/**
 * Bridge morph-doc Skills to anthropics/skill-creator (eval, description loop, validate).
 *
 * Usage:
 *   node scripts/morph-skill-creator.mjs check
 *   node scripts/morph-skill-creator.mjs install
 *   node scripts/morph-skill-creator.mjs validate <skill-id>
 *   node scripts/morph-skill-creator.mjs run-eval <skill-id> [-- ...run_eval.py flags]
 *   node scripts/morph-skill-creator.mjs desc-loop <skill-id> [-- ...run_loop.py flags]
 *
 * Requires Python 3 for upstream scripts; run-eval and desc-loop need `claude` CLI (see skill-creator SKILL.md).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  resolveBehaviorEvalSetPath,
  resolveSkillCreatorInstall,
  resolveTriggerEvalSetPath,
  skillCreatorCandidateRoots,
} from './lib/skill-creator-path.mjs';
import {
  ensureSkillCreatorPython,
  pythonCanImportYaml,
  skillCreatorVenvDir,
} from './lib/skill-creator-python.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function resolvePython() {
  try {
    return ensureSkillCreatorPython(ROOT);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

function usage() {
  console.log(`Usage:
  node scripts/morph-skill-creator.mjs check
  node scripts/morph-skill-creator.mjs install
  node scripts/morph-skill-creator.mjs validate <skill-id>
  node scripts/morph-skill-creator.mjs run-eval <skill-id> [-- extra run_eval.py args]
  node scripts/morph-skill-creator.mjs desc-loop <skill-id> [-- extra run_loop.py args]

Environment:
  MORPH_SKILL_CREATOR_ROOT       Path to anthropics skill-creator checkout
  MORPH_SKILL_CREATOR_MODEL      Model for claude -p (default: claude-sonnet-4-20250514)
  MORPH_SKILL_CREATOR_RUN_EVAL_OUT  Optional JSON output path for run-eval

Upstream: https://github.com/anthropics/skills/tree/main/skills/skill-creator
`);
}

function run(cmd, args, options = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd: options.cwd ?? ROOT, env: process.env });
  if (r.error) {
    console.error(r.error.message);
    process.exit(1);
  }
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

function cmdCheck() {
  const install = resolveSkillCreatorInstall();
  if (!install) {
    console.error('skill-creator not found. Candidates:');
    for (const c of skillCreatorCandidateRoots()) {
      console.error(`  - ${c}`);
    }
    console.error('\nRun: npm run skill-creator:install');
    console.error('Or clone https://github.com/anthropics/skills/tree/main/skills/skill-creator');
    process.exit(1);
  }
  console.log('skill-creator: ok');
  console.log(`  root: ${install.root}`);
  console.log(`  run_loop: ${install.runLoop}`);
  console.log(`  run_eval: ${install.runEval}`);

  const claude = spawnSync('claude', ['--version'], { encoding: 'utf8' });
  if (claude.status === 0) {
    console.log(`  claude CLI: ${(claude.stdout || '').trim()}`);
  } else {
    console.warn(
      '  claude CLI: not found (run-eval and desc-loop need it; use hand-edits + npm test otherwise)',
    );
  }

  const py = spawnSync('python3', ['--version'], { encoding: 'utf8' });
  if (py.status === 0) {
    console.log(`  python3: ${(py.stdout || '').trim()}`);
  } else {
    console.error('  python3: not found');
    process.exit(1);
  }

  const venvPy = path.join(skillCreatorVenvDir(ROOT), 'bin', 'python3');
  if (pythonCanImportYaml(venvPy)) {
    console.log(`  PyYAML: ok (venv ${skillCreatorVenvDir(ROOT)})`);
  } else if (pythonCanImportYaml('python3')) {
    console.log('  PyYAML: ok (system python3)');
  } else {
    console.warn(
      `  PyYAML: not ready — run: npm run skill-creator:install (creates ${skillCreatorVenvDir(ROOT)})`,
    );
  }
}

function cmdInstall() {
  const script = path.join(ROOT, 'scripts', 'morph-skill-creator-install.sh');
  run('bash', [script]);
  const dest = path.join(ROOT, 'vendor', 'skill-creator');
  if (resolveSkillCreatorInstall()) {
    console.log(`\nAdd to your shell profile (optional):\n  export MORPH_SKILL_CREATOR_ROOT="${dest}"`);
  }
}

function assertSkillId(skillId) {
  const skillDir = path.join(ROOT, 'skills', skillId);
  const skillMd = path.join(skillDir, 'SKILL.md');
  if (!fs.existsSync(skillMd)) {
    console.error(`No skills/${skillId}/SKILL.md`);
    process.exit(1);
  }
  return skillDir;
}

function requireSkillCreatorInstall() {
  const install = resolveSkillCreatorInstall();
  if (!install) {
    console.error('skill-creator not installed. Run: npm run skill-creator:install');
    process.exit(1);
  }
  if (!fs.existsSync(install.runEval)) {
    console.error(`skill-creator run_eval.py not found at ${install.runEval}`);
    process.exit(1);
  }
  return install;
}

function resolveTriggerEvalOrExit(skillId) {
  const skillDir = assertSkillId(skillId);
  const evalSet = resolveTriggerEvalSetPath(ROOT, skillId);
  if (!evalSet) {
    console.error(
      `No trigger eval set for ${skillId}. Add one of:\n` +
        `  scripts/skill-trigger-evals.${skillId}.json\n` +
        `  scripts/skill-trigger-evals.${skillId}.example.json (copy from morph-js-sdk example)\n` +
        `  skills/${skillId}/evals/trigger.json`,
    );
    process.exit(1);
  }
  return { skillDir, evalSet };
}

function requireClaudeCli() {
  const claude = spawnSync('claude', ['--version'], { encoding: 'utf8' });
  if (claude.status !== 0) {
    console.error(
      'claude CLI is required (runs `claude -p` per eval query). Install Claude Code and ensure `claude` is on PATH.',
    );
    process.exit(1);
  }
}

function defaultSkillCreatorModel() {
  return process.env.MORPH_SKILL_CREATOR_MODEL || 'claude-sonnet-4-20250514';
}

function cmdValidate(skillId) {
  assertSkillId(skillId);
  console.log('Running morph-doc guards (npm test subset via inventory + pairing)…');
  run(process.execPath, [
    path.join(ROOT, '__tests__', 'morph-doc-skill-inventory.test.mjs'),
  ]);
  run(process.execPath, [path.join(ROOT, '__tests__', 'doc-skill-pairing.test.mjs')]);

  const install = resolveSkillCreatorInstall();
  if (!install) {
    console.warn('\nSkipping upstream quick_validate.py (skill-creator not installed).');
    return;
  }

  const python = resolvePython();

  console.log('\nRunning upstream quick_validate.py (Anthropic frontmatter rules)…');
  const r = spawnSync(python, [install.quickValidate, path.join(ROOT, 'skills', skillId)], {
    encoding: 'utf8',
    cwd: install.root,
  });
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  if (r.status !== 0) {
    const detail = [r.stderr, r.stdout].filter(Boolean).join('\n').trim();
    const morphMetadataOnly =
      /last_verified/i.test(detail) && /verified_against/i.test(detail);
    if (morphMetadataOnly) {
      console.warn(
        '\nNote: upstream quick_validate rejects Morph `last_verified` / `verified_against`.',
        '\nTreat morph inventory + npm test as authoritative for Morph metadata.',
      );
    } else {
      throw new Error(
        `upstream quick_validate failed (exit ${r.status ?? 'unknown'})${detail ? `:\n${detail}` : ''}`,
      );
    }
  } else {
    console.log('upstream quick_validate: ok');
  }
}

function cmdRunEval(skillId, extraArgs) {
  const { skillDir, evalSet } = resolveTriggerEvalOrExit(skillId);
  const install = requireSkillCreatorInstall();
  requireClaudeCli();
  const python = resolvePython();
  const model = defaultSkillCreatorModel();

  const hasOutFlag = extraArgs.some((a) => a === '--out' || a.startsWith('--out='));
  const outPath =
    process.env.MORPH_SKILL_CREATOR_RUN_EVAL_OUT ||
    (!hasOutFlag
      ? path.join(ROOT, '.local', 'skill-run-eval', skillId, 'results.json')
      : null);

  const args = [
    '-m',
    'scripts.run_eval',
    '--eval-set',
    evalSet,
    '--skill-path',
    skillDir,
    '--model',
    model,
    '--runs-per-query',
    '1',
    '--verbose',
    ...extraArgs,
  ];

  console.log('Running description trigger eval (claude -p per query)…');
  console.log(`  eval-set: ${evalSet}`);
  console.log(`  skill-path: ${skillDir}`);
  console.log(`  model: ${model}`);
  if (outPath) {
    console.log(`  out: ${outPath}`);
  }

  let stdout = '';
  const r = spawnSync(python, args, {
    cwd: install.root,
    encoding: 'utf8',
    env: process.env,
  });
  if (r.stdout) {
    process.stdout.write(r.stdout);
    stdout = r.stdout;
  }
  if (r.stderr) process.stderr.write(r.stderr);
  if (r.error) {
    console.error(r.error.message);
    process.exit(1);
  }

  if (outPath && stdout.trim()) {
    const abs = path.isAbsolute(outPath) ? outPath : path.join(ROOT, outPath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, `${stdout.trim()}\n`, 'utf8');
    console.log(`\nWrote ${abs}`);
  }

  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

function cmdDescLoop(skillId, extraArgs) {
  const { skillDir, evalSet } = resolveTriggerEvalOrExit(skillId);
  const install = requireSkillCreatorInstall();
  requireClaudeCli();
  const python = resolvePython();

  const resultsDir =
    process.env.MORPH_SKILL_CREATOR_RESULTS_DIR ||
    path.join(ROOT, '.local', 'skill-desc-opt', skillId);

  fs.mkdirSync(resultsDir, { recursive: true });

  const model = defaultSkillCreatorModel();

  const args = [
    install.runLoop,
    '--eval-set',
    evalSet,
    '--skill-path',
    skillDir,
    '--model',
    model,
    '--runs-per-query',
    '1',
    '--results-dir',
    resultsDir,
    '--verbose',
    ...extraArgs,
  ];

  console.log('Running description optimization loop…');
  console.log(`  eval-set: ${evalSet}`);
  console.log(`  skill-path: ${skillDir}`);
  console.log(`  results-dir: ${resultsDir}`);
  console.log(`  model: ${model}`);

  run(python, args, { cwd: install.root });

  const runDirs = fs
    .readdirSync(resultsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
  const latestRun = runDirs.at(-1);
  const resultsFile = latestRun
    ? path.join(resultsDir, latestRun, 'results.json')
    : path.join(resultsDir, 'results.json');
  if (fs.existsSync(resultsFile)) {
    const data = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
    if (data.best_description) {
      console.log('\n--- best_description (merge into SKILL.md manually, then npm test) ---\n');
      console.log(data.best_description);
    }
  }

  const behaviorEval = resolveBehaviorEvalSetPath(ROOT, skillId);
  if (!behaviorEval) {
    console.log(
      `\nTip: add skills/${skillId}/evals/evals.json for behavioral evals (see scripts/skill-behavior-evals.template.json).`,
    );
  }
}

function main() {
  const [command, skillId, ...rest] = process.argv.slice(2);
  if (!command || command === '-h' || command === '--help') {
    usage();
    process.exit(command ? 0 : 1);
  }

  switch (command) {
    case 'check':
      cmdCheck();
      break;
    case 'install':
      cmdInstall();
      break;
    case 'validate':
      if (!skillId) {
        usage();
        process.exit(1);
      }
      cmdValidate(skillId);
      break;
    case 'run-eval': {
      if (!skillId) {
        usage();
        process.exit(1);
      }
      const sep = rest.indexOf('--');
      const extra = sep >= 0 ? rest.slice(sep + 1) : [];
      cmdRunEval(skillId, extra);
      break;
    }
    case 'desc-loop': {
      if (!skillId) {
        usage();
        process.exit(1);
      }
      const sep = rest.indexOf('--');
      const extra = sep >= 0 ? rest.slice(sep + 1) : [];
      cmdDescLoop(skillId, extra);
      break;
    }
    default:
      console.error(`Unknown command: ${command}`);
      usage();
      process.exit(1);
  }
}

main();
