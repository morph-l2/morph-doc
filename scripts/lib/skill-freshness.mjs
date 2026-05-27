/**
 * Shared Skill freshness checks (VISION.md § Skill Verification Metadata).
 * Used by __tests__/morph-doc-skill-inventory.test.mjs and scripts/skill-freshness-report.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';

export const DECAY_THRESHOLD_DAYS = 90;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Directories under skills/ excluded from inventory-style checks. */
export const SKILLS_EXCLUDE_DIRS = new Set(['morph-skill']);

/** @typedef {'missing_last_verified' | 'invalid_last_verified' | 'stale'} FreshnessCode */

/**
 * @typedef {object} FreshnessWarning
 * @property {string} skillId
 * @property {FreshnessCode} code
 * @property {string} message
 * @property {number | null} ageDays
 * @property {string | null} lastVerified
 */

export function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const block = m[1];
  function field(name) {
    const line = new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(block);
    if (!line) return null;
    let v = line[1].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    return v;
  }
  return { block, field };
}

export function parseIsoDate(value) {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, y, mo, d] = match;
  const year = Number(y);
  const month = Number(mo);
  const day = Number(d);
  const dt = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(dt.getTime())) return null;
  if (
    dt.getUTCFullYear() !== year ||
    dt.getUTCMonth() + 1 !== month ||
    dt.getUTCDate() !== day
  ) {
    return null;
  }
  return dt;
}

/**
 * @param {string} skillsDir Absolute path to skills/
 * @param {{ now?: number, thresholdDays?: number }} [options]
 * @returns {{ skillIds: string[], warnings: FreshnessWarning[] }}
 */
export function collectFreshnessWarnings(skillsDir, options = {}) {
  const now = options.now ?? Date.now();
  const thresholdDays = options.thresholdDays ?? DECAY_THRESHOLD_DAYS;

  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  const skillIds = entries
    .filter((e) => e.isDirectory() && !SKILLS_EXCLUDE_DIRS.has(e.name))
    .map((e) => e.name)
    .sort();

  /** @type {FreshnessWarning[]} */
  const warnings = [];

  for (const skillId of skillIds) {
    const skillPath = path.join(skillsDir, skillId, 'SKILL.md');
    if (!fs.existsSync(skillPath)) {
      continue;
    }
    const content = fs.readFileSync(skillPath, 'utf8');
    const fm = parseFrontmatter(content);
    if (!fm) {
      continue;
    }

    const lastVerifiedRaw = fm.field('last_verified');
    if (!lastVerifiedRaw) {
      warnings.push({
        skillId,
        code: 'missing_last_verified',
        message: `skills/${skillId}/SKILL.md missing last_verified (see VISION.md § Skill Verification Metadata)`,
        ageDays: null,
        lastVerified: null,
      });
      continue;
    }

    const lastVerified = parseIsoDate(lastVerifiedRaw);
    if (!lastVerified) {
      warnings.push({
        skillId,
        code: 'invalid_last_verified',
        message: `skills/${skillId}/SKILL.md last_verified is not an ISO date (YYYY-MM-DD): ${lastVerifiedRaw}`,
        ageDays: null,
        lastVerified: lastVerifiedRaw,
      });
      continue;
    }

    const ageDays = Math.floor((now - lastVerified.getTime()) / MS_PER_DAY);
    if (ageDays < 0) {
      warnings.push({
        skillId,
        code: 'future_last_verified',
        message: `skills/${skillId}/SKILL.md last_verified is in the future: ${lastVerifiedRaw}`,
        ageDays,
        lastVerified: lastVerifiedRaw,
      });
      continue;
    }
    if (ageDays > thresholdDays) {
      warnings.push({
        skillId,
        code: 'stale',
        message: `skills/${skillId}/SKILL.md last_verified is ${ageDays} days old (threshold ${thresholdDays}); re-verify against sources`,
        ageDays,
        lastVerified: lastVerifiedRaw,
      });
    }
  }

  return { skillIds, warnings };
}

/**
 * @param {string} root Repo root (parent of skills/)
 * @param {{ now?: number, thresholdDays?: number }} [options]
 */
export function buildFreshnessReport(root, options = {}) {
  const skillsDir = path.join(root, 'skills');
  const { skillIds, warnings } = collectFreshnessWarnings(skillsDir, options);
  const generatedAt = new Date(options.now ?? Date.now()).toISOString();

  return {
    schema: 'morph-doc/skill-freshness-report/v1',
    generatedAt,
    thresholdDays: options.thresholdDays ?? DECAY_THRESHOLD_DAYS,
    skillCount: skillIds.length,
    warningCount: warnings.length,
    staleCount: warnings.filter((w) => w.code === 'stale').length,
    warnings,
    skillIds,
  };
}
