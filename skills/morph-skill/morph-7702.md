---
name: morph-7702
version: 1.0.0
description: "EIP-7702 EOA delegation on Morph L2 — check delegation status, sign offline authorization, send single calls or atomic batches via tx type 0x04, and revoke delegation. Use when the user asks about EIP-7702, atomic multi-call (e.g. approve + swap), or delegating an EOA. Mutually exclusive with alt-fee."
last_verified: 2026-05-19
verified_against:
  - https://github.com/morph-l2/morph-skill/blob/main/skills/morph-7702/SKILL.md
upstream_repo: https://github.com/morph-l2/morph-skill
---

# Morph EIP-7702

EIP-7702 EOA delegation and atomic batch calls on Morph L2 via tx type `0x04`.

## Canonical reference

[`skills/morph-7702/SKILL.md` ↗](https://github.com/morph-l2/morph-skill/blob/main/skills/morph-7702/SKILL.md)

## When to use

- Check whether an EOA is delegated
- Sign a 7702 authorization offline (no tx sent)
- Send a single delegated call
- Execute an atomic batch of calls (e.g. approve + swap in one tx)
- Revoke a delegation (return EOA to normal)

## Capability summary

| Command | Flags | Purpose |
|---|---|---|
| `7702-delegate` | `--address 0xEOA` | Check whether an EOA has been delegated |
| `7702-authorize` | `--private-key 0x… --delegate 0xDelegateContract` | Sign authorization offline (no tx) |
| `7702-send` | `--delegate 0x… --to 0x… --data 0x… [--value <eth>] [--gas <n>] --private-key 0x…` | Single delegated call |
| `7702-batch` | `--delegate 0x… --calls '[{"to":"0x…","value":"0","data":"0x…"}, …]' --private-key 0x…` | Atomic batch of calls |
| `7702-revoke` | `--private-key 0x…` | Revoke delegation (sets delegate to `address(0)`) |

`--calls` is a JSON array of `{to, value, data}` objects.

## Delegation detection

Delegated EOAs have on-chain code starting with `0xef0100` followed by the
20-byte delegate address. Authorization hash format:

```
keccak256(0x05 || RLP([chainId, contract, nonce]))
```

For self-delegation, the auth `nonce` must be `tx_nonce + 1` (geth rule).

## Critical caveats (from upstream)

- **EIP-7702 and alt-fee are mutually exclusive** — cannot use both in a
  single transaction (tx type `0x04` vs `0x7f`)
- This skill **does not assume a default Morph delegate contract** — the user
  / agent supplies `--delegate`
- `7702-revoke` clears delegation — the EOA returns to a normal EOA until
  re-delegated
- `7702-authorize` is offline — returns a signed authorization without sending
  any tx
- [BGW ↗](https://github.com/morph-l2/morph-skill/blob/main/docs/social-wallet-integration.md)
  (Social Login Wallet) users cannot sign 7702 transactions through this skill
  directly

## Safety rules

1. Always confirm with the user before executing `7702-send`, `7702-batch`,
   or `7702-revoke` — display target, calls, values before signing
2. EIP-7702 and alt-fee (`0x7f`) are mutually exclusive
3. `7702-revoke` clears delegation
4. Private keys are used locally for signing only — never sent to any API
5. `7702-authorize` is offline

## Cross-skill integration

- [morph-dex](./morph-dex) — get swap calldata from `dex-quote --recipient
  <EOA>`, then pass to `7702-batch` for atomic approve + swap
- [morph-altfee](./morph-altfee) — **mutually exclusive** with this skill;
  pick one tx type per transaction
- [morph-identity](./morph-identity) — `agent-register` calldata can be
  bundled into a `7702-batch` to combine registration with other operations
- [morph-x402](./morph-x402) — note that EIP-7702 delegated EOAs using legacy
  SimpleDelegation may fail x402 settlement; check with `7702-delegate` first
