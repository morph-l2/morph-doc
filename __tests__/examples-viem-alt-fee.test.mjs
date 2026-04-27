/**
 * examples/viem-alt-fee layout and dry-run smoke test.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const EXAMPLE_DIR = path.join(ROOT, "examples", "viem-alt-fee");
const SCRIPT = path.join(EXAMPLE_DIR, "send-alt-fee.mjs");

for (const f of ["package.json", "send-alt-fee.mjs", ".env.example"]) {
  assert.ok(
    fs.existsSync(path.join(EXAMPLE_DIR, f)),
    `expected examples/viem-alt-fee/${f}`
  );
}

const check = spawnSync(process.execPath, ["--check", SCRIPT], {
  encoding: "utf8",
});
assert.equal(check.status, 0, check.stderr || "node --check send-alt-fee.mjs");

const dry = spawnSync(
  process.execPath,
  [SCRIPT],
  {
    cwd: EXAMPLE_DIR,
    encoding: "utf8",
    env: { ...process.env, MORPH_DRY_RUN: "1" },
  }
);
assert.equal(dry.status, 0, dry.stderr || dry.stdout);
assert.ok(dry.stdout.includes("dry-run"), "dry-run output should mention mode");
assert.ok(dry.stdout.includes("feeTokenID"), "dry-run output should include feeTokenID");

console.log("examples-viem-alt-fee: ok");
