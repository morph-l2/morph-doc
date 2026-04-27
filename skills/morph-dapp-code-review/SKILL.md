---
name: morph-dapp-code-review
description: "Morph dApp code review: review Solidity, JS SDK, and frontend diffs across four dimensions — Security / Performance / Code Quality / Planning compliance — with Morph-specific checks (Alt Fee fields, predeployed contract addresses, chainId, L1 data fee). Use when the user wants to review a Morph-related diff or PR, asks for security/perf/quality feedback, or wants to verify implementation against a planning document. Trigger when reviewing Morph dApp changes, requesting multi-dimension feedback, or aligning implementation with planning output. Not for generating implementation (see morph-dapp-codegen)."
last_verified: 2026-04-23
verified_against:
  - docs/build-on-morph/sdk/js-sdk.mdx
  - docs/build-on-morph/developer-resources/1-contracts.md
  - docs/build-on-morph/build-on-morph/4-understand-transaction-cost-on-morph.md
  - skills/morph-js-sdk/SKILL.md
  - skills/morph-contracts/SKILL.md
  - skills/morph-tx-cost/SKILL.md
---

# Morph dApp Code Review

Review a Morph-related change set (diff / PR / working tree) across 4 dimensions and
add Morph-specific risk checks. **Read-only — never modify code in this skill.**

## When to use

- The user supplies a PR link, a commit range, or wants the current working tree
  `git diff` reviewed.
- The user asks for **per-dimension** feedback (security / performance / quality /
  planning compliance).
- The change touches Morph contracts, the JS SDK, L1↔L2 bridge flows, or Alt Fee
  paths.

## Input identification

When no explicit base is given, fall back in this order:

1. User-provided `--base <ref> --head <ref>` → `git diff <base>...<head>`
2. Current branch vs `origin/main` / `main`: `git diff origin/main...HEAD`
3. No comparable base → `git diff` + `git status` of the working tree

Stack identification:

| File signal | Dimension to apply |
|---|---|
| `*.sol` + `foundry.toml` / `hardhat.config.*` | Solidity dimension |
| `*.ts/*.js` + `package.json` containing `viem` / `ethers` / `@morph-network/*` | JS SDK dimension |
| `*.tsx/*.jsx` + Next.js / React deps | Frontend dimension |
| `*.md/*.mdx` + `skills/` / `docs/` | Doc/skill dimension (apply `morph-doc-agent` lens) |

## Dimension Checklist

Each dimension lists generic checks first, then Morph-specific checks. Tag each
finding **P0 (must fix, blocks merge) / P1 (recommended) / P2 (optional)**.

### 1. Security

Generic:
- Unvalidated external input; SQL/command injection; unsafe deserialization
- Private keys / mnemonics / API keys written into code or logs
- Insecure randomness (`Math.random` for keys)
- Reentrancy, integer overflow, `tx.origin` auth (Solidity)
- `delegatecall` to untrusted addresses (Solidity)

Morph-specific:
- Are **predeployed contract addresses** sourced from
  `docs/build-on-morph/developer-resources/1-contracts.md`, not copied from a public
  block explorer?
- Do **L1↔L2 bridge flows** handle message receipts and replay protection?
- Do **Alt Fee** calls verify that `feeTokenID` actually exists in the Token Registry?
- Mainnet (chainId `2818`) and Hoodi (`2910`) confused → wrong-chain risk

### 2. Performance

Generic:
- Algorithmic complexity, N+1 calls, network IO inside loops
- Large objects never released; long-lived closures holding big buffers
- Frontend: missing code-splitting / lazy loading; gratuitous re-renders

Morph-specific:
- Repeated `eth_gasPrice` / `GasPriceOracle.getL1Fee` per transaction — should be
  batched or cached
- Bridge flows polling without backoff — risk of hammering RPC

### 3. Code Quality

Generic:
- Confusing names, long functions, magic numbers
- Swallowed errors (`catch (_) {}`), error messages without context
- `any` overuse, unused/missing exports
- Test quality: weak assertions, no error branches, no edge cases

Morph-specific:
- Hard-coded `chainId: 2818` literals or RPC URLs instead of importing chain objects
  from `@morph-network/chain` / `@morph-network/viem`
- Alt Fee fields injected into a non-Alt-Fee path, or vice versa
- Real keys / mnemonics shown in plain example code

### 4. Planning compliance

Run only when the user provides a planning document path or there is a `planning/<feature-id>.md`
in-repo:

- Are planning `Goals` covered by the code? (mark each COVERED / MISSING / DEVIATED)
- Are planning `Test Cases` represented in the test files?
- Did the change add unauthorized files outside `Target Files`?
- Can each item in the planning document's `Self-Check` be backed by code evidence?
- Are 🔴 items in `Open Questions` still unresolved? (still unresolved → P0)

## Execution Steps

1. **Collect the diff**: pick the diff per "Input identification". Count files and
   lines; if it exceeds ~5000 lines, ask the user to chunk it — do not stuff context.
2. **Identify stack and planning presence**: decide which dimensions apply.
3. **Walk each dimension**: for every hit, record `file:line` + short description +
   severity + suggestion.
4. **Cross-dimension dedup**: collapse same `file + function` findings into the
   highest-severity entry.
5. **Emit the report** (format below).
6. **Never run `git commit` or `git push` from this skill** — stay read-only.

## Output Format

```markdown
# Morph dApp Code Review

## Summary
- Scope: <base> → <head>, N files / M lines diffed
- Stack: <contracts | js-sdk | frontend | docs>
- Planning compared: <yes / no, planning path>
- Findings: P0×X / P1×Y / P2×Z

## P0 (blocking)
- [security] file:line — description — suggestion
- ...

## P1 (recommended)
- ...

## P2 (optional)
- ...

## Per-Dimension
### Security
### Performance
### Code Quality
### Planning compliance
- Goal coverage table
- Uncovered test cases
```

## Self-Check

- Does every finding cite `file:line` and a one-line fix suggestion?
- Did Morph-specific items (Alt Fee / chainId / predeployed addresses / L1 fee) all
  get walked?
- When no planning document exists, is "planning compliance not run" stated honestly?
- Is the P0 count proportional to the change size (avoid both under-reviewing and
  false-positive piling)?
- Was the run kept fully read-only (no writes to the repo)?

## Related Skills

- `morph-dapp-planning`: source document for the planning-compliance dimension
- `morph-dapp-codegen`: implementation stage — review feedback feeds back into its
  Phase 2
- `morph-js-sdk` / `morph-contracts` / `morph-tx-cost`: fact-tables backing the
  dimension checks
