---
name: morph-full-node-run-on-host
description: Guides running a Morph full node from source (geth + consensus node), hardware requirements, build, config, snapshot sync, and startup. Use when the user asks to run a Morph full node on bare metal, sync from snapshot, or troubleshoot host-based node setup. Canonical human-readable documentation lives in the morph-doc repository path below.
last_verified: 2026-04-20
verified_against:
  - docs/build-on-morph/developer-resources/node-operation/full-node/2-run-on-host.md
---

# Morph Full Node (Running from Source on Host)

## Authoritative Documentation (single source of truth)

Full steps, commands, and notes are in the doc:

`docs/build-on-morph/developer-resources/node-operation/full-node/2-run-on-host.md`

(Site route id: `build-on-morph/developer-resources/node-operation/full-node/run-on-host`)

## Agent Working Method (skill = execution playbook)

1. Confirm target network (mainnet / Hoodi testnet) and whether to sync from snapshot (recommended).
2. Check hardware: execution layer geth and consensus layer node run as separate processes; disk space must account for continuous archive growth.
3. Follow the doc in order: clone `morph` repo and checkout release → `make geth` → `make build` in the `node` directory → download data.zip, generate `jwt-secret.txt`.
4. Download and extract the corresponding snapshot; point data directories to the `geth-data` / `node-data` layout described in the doc.
5. Start geth first (with JWT, engine API), then start node; ports and RPC follow the doc.
6. If the user deviates from the doc path (e.g. missing C compiler, wrong path), troubleshoot against the doc commands one by one.

Do not fabricate download URLs or release tags not present in the doc; open the above doc to verify when in doubt.
