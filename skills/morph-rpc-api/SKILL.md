---
name: morph-rpc-api
description: "Morph-exclusive JSON-RPC API methods not present in standard Ethereum: morph_getBlockByNumber, morph_getBlockByHash, morph_estimateL1DataFee, morph_getNumSkippedTransactions, morph_getSkippedTransaction(Hashes), morph_getRollupBatchByIndex, morph_GetBlockTraceByNumberOrHash. Use when the user needs Morph-specific RPC calls, extra block fields (withdrawTrieRoot, batchHash, nextL1MsgIndex, rowConsumption), L1 data fee estimates, skipped transaction queries, rollup batch data, or block traces for ZK proof rollers."
last_verified: 2026-05-09
verified_against:
  - docs/build-on-morph/developer-resources/3-morph-json-rpc-api-methods.md
---

# Morph JSON-RPC API Methods (Execution Playbook)

## Authoritative Documentation (single source of truth)

`docs/build-on-morph/developer-resources/3-morph-json-rpc-api-methods.md`

Site route id: `build-on-morph/developer-resources/morph-json-rpc-api-methods`

Standard Ethereum RPC (not covered here): `https://ethereum.org/en/developers/docs/apis/json-rpc/`

RPC endpoints: see `morph-contracts` skill (or `docs/build-on-morph/developer-resources/1-contracts.md`).

## Morph-Exclusive Methods

| Method | Purpose |
|--------|---------|
| `morph_getBlockByNumber` | Like `eth_getBlockByNumber` + extra fields |
| `morph_getBlockByHash` | Like `eth_getBlockByHash` + extra fields |
| `morph_estimateL1DataFee` | Estimate L1 data fee (wei) for a tx |
| `morph_getNumSkippedTransactions` | Count of skipped transactions |
| `morph_getSkippedTransactionHashes` | Hashes of skipped txs in index range |
| `morph_getSkippedTransaction` | Full skipped tx object by hash |
| `morph_getRollupBatchByIndex` | Full rollup batch by index |
| `morph_GetBlockTraceByNumberOrHash` | Block trace for ZK proof rollers |

## Extra Fields on morph_getBlock*

| Field | Type | Description |
|-------|------|-------------|
| `withdrawTrieRoot` | DATA, 32B | Root of the withdraw trie (proves user withdrawals) |
| `batchHash` | DATA, 32B | Hash of the latest batch; non-zero means this block is a batch point |
| `nextL1MsgIndex` | QUANTITY | Next expected L1 message nonce after this block |
| `rowConsumption` | array | Per-circuit row counts used to generate ZK proof (halo2 schema) |

## Execution Steps

1. Use the Morph RPC endpoint for the target network (see `morph-contracts` for URLs).
2. All methods follow standard JSON-RPC 2.0 format: `{"jsonrpc":"2.0","method":"<method>","params":[...],"id":1}`.
3. For `morph_estimateL1DataFee`: pass a `TransactionArgs` object (same shape as `eth_call`) plus a block tag as params.
4. For `morph_getSkippedTransactionHashes`: pass `[fromIndex, toIndex]` (inclusive).
5. For `morph_getRollupBatchByIndex`: pass `[batchIndex]`; response includes `chunks`, `signatures`, `prevStateRoot`, `postStateRoot`, `withdrawRoot`.
6. For `morph_GetBlockTraceByNumberOrHash`: pass block number/hash and optional `tracerConfig`; used by rollers to generate ZK proofs — do not use for regular block data.

## Key Pitfalls

- Standard `eth_*` methods are also supported — only use `morph_*` when you need the extra Morph-specific fields or functionality.
- `morph_getSkippedTransactionHashes` appears twice in the source doc: the second entry actually documents `morph_getRollupBatchByIndex` (doc inconsistency — use the method name from the heading).
- `rowConsumption` is an array of `{name, row_number}` objects (circuit names: evm, state, bytecode, copy, keccak, tx, rlp, exp, mod_exp, pi, poseidon, sig, ecc, mpt).

## Related Skills

- `morph-contracts` — RPC endpoint URLs for Mainnet and Hoodi Testnet

## Self-Check

- [ ] Method names prefixed with `morph_` (not `eth_`) for Morph-exclusive functionality.
- [ ] RPC endpoint URL sourced from `morph-contracts` skill, not guessed.
- [ ] Extra block fields (`withdrawTrieRoot`, `batchHash`, `nextL1MsgIndex`, `rowConsumption`) only exist on `morph_getBlock*` responses.
- [ ] `morph_estimateL1DataFee` returns wei as a QUANTITY hex string.
- [ ] Roller use case (`morph_GetBlockTraceByNumberOrHash`) distinguished from normal block queries.
