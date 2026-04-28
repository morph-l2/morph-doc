---
name: morph-full-node-run-in-docker
description: Guides running a Morph full node via run-morph-node (Docker or binary), hardware requirements, snapshot sync, and startup. Use when the user asks to run a Morph full node (Docker or bare metal), sync from snapshot, or troubleshoot node setup. Canonical human-readable documentation lives in the morph-doc repository path below.
last_verified: 2026-04-28
verified_against:
  - docs/build-on-morph/developer-resources/node-operation/full-node/1-run-in-docker.md
---

# Morph Full Node (Docker or Binary via run-morph-node)

## Authoritative Documentation (single source of truth)

Primary guide (covers both Docker and binary with tabs):

`docs/build-on-morph/developer-resources/node-operation/full-node/1-run-in-docker.md`

(Site route id: `build-on-morph/developer-resources/node-operation/full-node/run-in-docker`)

## Agent Working Method (skill = execution playbook)

1. **Existing zkTrie node?** → Direct user to the zkTrie → MPT migration guide at `docs/build-on-morph/developer-resources/node-operation/upgrade-node/0-zktrie-to-mpt-migration.md` instead of a fresh install.
2. Confirm target network (mainnet / Hoodi) and deployment method (Docker recommended; binary if Docker unavailable).
3. Check hardware: 4+ CPU cores, 32 GB RAM, 1 TB SSD, 25+ Mbit/s download.
4. Clone `run-morph-node` (with `--recurse-submodules` for binary); `cd run-morph-node/morph-node`.
5. Set `L1_ETH_RPC` and `L1_BEACON_CHAIN_RPC` in `.env` (mainnet) or `.env_hoodi` (Hoodi).
6. Optionally select a snapshot version by updating `MAINNET_MPT_SNAPSHOT_NAME` / `HOODI_MPT_SNAPSHOT_NAME` in the env file.
7. Download and decompress snapshot: `make download-and-decompress-mainnet-snapshot` (or hoodi variant); move `geth-data` and `node-data` into place per the doc.
8. Start the node:
   - Docker mainnet: `make run-node` / Docker Hoodi: `make run-hoodi-node`
   - Binary mainnet: `make run-node-binary` / Binary Hoodi: `make run-hoodi-node-binary`
   - Stop: `make stop-node` (Docker) or `make stop-binary` (binary)
9. Verify: `curl localhost:8545` for geth peers; `curl localhost:26657/status` — synced when `catching_up` is `false`.

Do not fabricate snapshot names, make targets, or URLs not present in the doc; open the primary doc to verify when in doubt.
