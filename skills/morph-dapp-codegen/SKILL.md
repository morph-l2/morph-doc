---
name: morph-dapp-codegen
description: "Morph dApp TDD codegen: take a planning document produced by morph-dapp-planning, write failing tests first, then implementation, looping tests + lint to green for Solidity / JS SDK / frontend code. Use ONLY when planning/<feature-id>.md already exists on disk — never use this skill for a fresh requirement that has no planning document yet (run morph-dapp-planning or morph-dapp-workflow first). Trigger when the user has an approved planning file and wants to run the Red→Green loop, land code against it, or backfill tests."
last_verified: 2026-04-30
verified_against:
  - docs/build-on-morph/sdk/js-sdk.mdx
  - docs/build-on-morph/developer-resources/1-contracts.md
  - skills/morph-js-sdk/SKILL.md
  - skills/morph-tx-cost/SKILL.md
---

# Morph dApp TDD Codegen

Land code against an approved planning document (from `morph-dapp-planning`). The flow is
deliberately minimal: **write tests → see them fail → write impl → see them pass →
run the full suite → wrap up**.

## When to use

- A planning file already exists (default: `planning/<feature-id>.md`).
- The work touches Morph contracts (Solidity / Hardhat / Foundry), the Morph JS SDK
  (viem / ethers / ethers v5), or components in the Morph doc site.

## Prerequisites

1. Read the planning document path and pull out `Target Files`, `Test Cases`, `Morph Constraints`,
   and `Self-Check`.
2. Confirm the toolchain for the target stack is ready:
   - **Solidity**: `forge --version` or `npx hardhat --version`
   - **JS/TS**: `node -v`, an `npm test` entry point exists
   - **In-repo morph-doc changes**: confirm `npm test` runs at the repo root
3. Clean working tree: `git status`. Commit or stash uncommitted changes so you can
   roll back.
4. Single stack per run: if the planning document spans multiple stacks, split the work into
   separate runs — never mix stacks in one commit.

## Execution Steps

### Phase 1 — Red: write failing tests first

1. Write at least one test function per Test Case in the planning document.
2. Cover: edge cases, error branches, and mocks/stubs for external dependencies (RPC /
   contract calls).
3. The build/parse step must pass:
   - Solidity: `forge build` or `npx hardhat compile`
   - TS: `tsc --noEmit` (or the project's existing script, e.g. `npm run build` /
     `npm run typecheck`)
4. Run tests and confirm **at least one case fails** (incremental refactors may stay
   green, but the output must explicitly call this out):
   - Solidity: `forge test` / `npx hardhat test`
   - JS/TS: `npm test` (the morph-doc project goes through
     `node scripts/run-tests.mjs`; new test files must be registered in `TEST_FILES`)
5. Commit the tests immediately with a message like
   `test: add failing tests for <feature-id>`.

### Phase 2 — Green: write the implementation

1. Touch only the impl files listed under `Target Files` in the planning document. Do not edit the
   tests on the side.
2. Strictly honor the planning document's **Morph Constraints**:
   - **Alt Fee paths** must pass `feeTokenID` for token gas; `feeLimit` is optional (pass when you need an explicit cap); non-Alt-Fee
     paths must NOT carry those fields.
   - **chainId / RPC** are never hard-coded — use chain objects exported by
     `@morph-network/chain` or `@morph-network/viem`. When both exist, pick the one
     the planning document calls for.
   - **Predeployed contract addresses** come only from
     `docs/build-on-morph/developer-resources/1-contracts.md` or
     `skills/morph-contracts`.
   - **Total gas estimates** shown to users must include the L1 data fee
     (`GasPriceOracle.getL1Fee`).
3. Iterate until the suite is green. On failure → fix the code (not the tests) →
   re-run.
4. Cap the inner loop at 5 retries. Still failing → stop and hand the failing stack
   trace back to the user.

### Phase 3 — Wrap up

1. Run static checks for the area:
   - Solidity: `forge fmt --check` or the project's lint
   - JS/TS: `npm run lint` (if defined)
   - In the morph-doc repo: `npm test` (covers skill / sidebar / pairing guards)
2. Walk the planning document's tail `Self-Check` list and tick each item ✅ or document why it is
   not covered.
3. Output a change summary in the chat (do NOT bake it into code comments):
   - Files changed
   - Tests added / updated
   - Diffs from the planning document, if any
4. **Do not auto commit** unless the user explicitly asks.

## Morph-specific codegen checklist

Walk this list before handing off; any unchecked item → self-correct first:

- [ ] Transaction signing goes through Morph adapters (`MorphSigner` /
      `@morph-network/viem`); do not hand-assemble Alt Fee fields with raw viem/ethers.
- [ ] RPC mocks in tests are decoupled from production RPC URLs; no private keys or
      mnemonics are written into test files.
- [ ] Every `"Mainnet"` / `"Hoodi"` literal carries a paired chainId or chain object
      reference.
- [ ] Any new env var introduced is documented in the example `.env` or README; **no
      real secrets are written to disk**.

## Self-Check

- Were tests written and seen to fail before the implementation existed (Red→Green)?
- Does each Test Case in the planning document map to a concrete test function?
- Are all Morph-specific values (`feeTokenID` / `feeLimit` / chainId / contract
  addresses) traceable to an authoritative source?
- Are added/changed files limited to the planning document's `Target Files` and the matching tests?
- Did `npm test` / `forge test` go fully green at the project root?

## Related Skills

- `morph-dapp-planning`: upstream — produces the planning document
- `morph-dapp-code-review`: downstream — review stage after coding
- `morph-js-sdk` / `morph-contracts` / `morph-tx-cost`: domain fact-tables
