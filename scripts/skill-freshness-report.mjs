#!/usr/bin/env node
/**
 * Emit a machine-readable Skill freshness report for CI (skill-freshness-bot).
 *
 * Usage:
 *   node scripts/skill-freshness-report.mjs [--json] [--out <path>]
 *
 * Exit codes:
 *   0 — report written (warnings do not fail; see morph-doc-skill-inventory.test.mjs)
 *   1 — unexpected error
 *
 * Design: scripts/skill-freshness-bot.DESIGN.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildFreshnessReport } from './lib/skill-freshness.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function parseArgs(argv) {
  let json = false;
  let outPath = null;
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') {
      json = true;
    } else if (a === '--out' && argv[i + 1]) {
      outPath = argv[++i];
    } else if (a === '-h' || a === '--help') {
      console.log(`Usage: node scripts/skill-freshness-report.mjs [--json] [--out <path>]`);
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${a}`);
      process.exit(1);
    }
  }
  return { json, outPath };
}

function main() {
  const { json, outPath } = parseArgs(process.argv);
  const report = buildFreshnessReport(ROOT);
  const text = JSON.stringify(report, null, 2);

  if (outPath) {
    const abs = path.isAbsolute(outPath) ? outPath : path.join(ROOT, outPath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, `${text}\n`, 'utf8');
    if (!json) {
      console.log(`Wrote ${abs} (${report.warningCount} warning(s))`);
    }
  }

  if (json) {
    process.stdout.write(`${text}\n`);
  } else if (!outPath) {
    if (report.warningCount === 0) {
      console.log('skill-freshness-report: ok (%d skills)', report.skillCount);
    } else {
      console.warn(
        'skill-freshness-report: %d warning(s) (%d stale)',
        report.warningCount,
        report.staleCount
      );
      for (const w of report.warnings) {
        console.warn('  ⚠️', w.message);
      }
    }
  }
}

main();
