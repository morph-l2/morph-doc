/**
 * Resolve the upstream anthropics/skill-creator checkout on the local machine.
 * @see https://github.com/anthropics/skills/tree/main/skills/skill-creator
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MORPH_DOC_ROOT = path.join(__dirname, '../..');

/** @returns {string[]} */
export function skillCreatorCandidateRoots() {
  const env = process.env.MORPH_SKILL_CREATOR_ROOT;
  const home = process.env.HOME || process.env.USERPROFILE || '';
  return [
    env,
    path.join(MORPH_DOC_ROOT, 'vendor', 'skill-creator'),
    home && path.join(home, '.claude', 'skills', 'skill-creator'),
    home && path.join(home, '.cursor', 'skills', 'skill-creator'),
    home && path.join(home, '.codex', 'skills', 'skill-creator'),
  ].filter(Boolean);
}

/**
 * @returns {{ root: string, runLoop: string, runEval: string, quickValidate: string, aggregateBenchmark: string } | null}
 */
export function resolveSkillCreatorInstall() {
  for (const root of skillCreatorCandidateRoots()) {
    const runLoop = path.join(root, 'scripts', 'run_loop.py');
    const runEval = path.join(root, 'scripts', 'run_eval.py');
    const skillMd = path.join(root, 'SKILL.md');
    if (fs.existsSync(runLoop) && fs.existsSync(skillMd)) {
      const quickValidate = path.join(root, 'scripts', 'quick_validate.py');
      const aggregateBenchmark = path.join(root, 'scripts', 'aggregate_benchmark.py');
      const required = { runLoop, runEval, quickValidate, aggregateBenchmark };
      const missing = Object.entries(required)
        .filter(([, p]) => !fs.existsSync(p))
        .map(([key]) => key);
      if (missing.length > 0) {
        throw new Error(
          `skill-creator install at ${root} is incomplete; missing: ${missing.join(', ')}`,
        );
      }
      return {
        root,
        runLoop,
        runEval,
        quickValidate,
        aggregateBenchmark,
      };
    }
  }
  return null;
}

/**
 * Trigger-eval JSON for description optimization (skill-creator run_loop).
 * @param {string} morphDocRoot
 * @param {string} skillId
 * @returns {string | null}
 */
export function resolveTriggerEvalSetPath(morphDocRoot, skillId) {
  const scripts = path.join(morphDocRoot, 'scripts');
  const candidates = [
    path.join(scripts, `skill-trigger-evals.${skillId}.json`),
    path.join(scripts, `skill-trigger-evals.${skillId}.example.json`),
    path.join(morphDocRoot, 'skills', skillId, 'evals', 'trigger.json'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/**
 * Behavioral eval set (skill-creator full eval loop).
 * @param {string} morphDocRoot
 * @param {string} skillId
 * @returns {string | null}
 */
export function resolveBehaviorEvalSetPath(morphDocRoot, skillId) {
  const candidates = [
    path.join(morphDocRoot, 'skills', skillId, 'evals', 'evals.json'),
    path.join(morphDocRoot, 'scripts', `skill-behavior-evals.${skillId}.json`),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}
