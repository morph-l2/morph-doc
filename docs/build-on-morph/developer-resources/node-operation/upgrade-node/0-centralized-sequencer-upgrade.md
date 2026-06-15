---
title: Upgrade to the centralized sequencer
lang: en-US
---

Morph has moved node operation to a **centralized sequencer** architecture. This page summarizes what changed for node operators and how to upgrade an existing node.

:::tip
If you are setting up a node from scratch, just follow [Run a full node](../full-node/1-run-in-docker.md) — it already reflects the centralized-sequencer setup. This page is for operators upgrading an existing node.
:::

## What changed

- **Single node type.** There is no longer a separate *validator node*. Every node runs the same way (`make run-node`) and verifies the chain against L1. The `validator` Docker Compose service and the `make run-validator` / `stop-validator` / `*-validator-binary` targets have been removed.
- **Batch verification is now configurable** via `DERIVATION_VERIFY_MODE` (see below). The previous validator behavior — deriving from L1 — is now an opt-in mode rather than a separate node.
- **Almost no new configuration.** Everything except the L1 beacon RPC endpoint uses per-network defaults baked into the binary, so for most operators upgrading the binary is enough.

## Environment variables

For most operators the **only** variable you may need to add is `L1_BEACON_CHAIN_RPC`. Everything else (rollup / deposit contract addresses, derivation heights) uses per-network defaults selected by the network flag — you don't need to set them.

| Variable | Required? | Notes |
|----------|-----------|-------|
| `L1_BEACON_CHAIN_RPC` | **Yes** | L1 beacon chain RPC endpoint. The node exits at startup without it — add it if your node doesn't already have one. |
| `DERIVATION_VERIFY_MODE` | Optional | Batch verification mode. Default `local` (rebuild blob from local L2 blocks and compare versioned hashes against L1). Set `layer1` to pull the L1 beacon blob and derive via the engine — **equivalent to the former validator node**. |

:::tip Were you running a validator?
A validator was simply a node that derives from L1. To keep that behavior, add a single variable — `DERIVATION_VERIFY_MODE=layer1`. Nothing else changes.
:::

Do **not** set `L1_SEQUENCER_CONTRACT` or `CONSENSUS_SWITCH_HEIGHT` — they use per-network hard-coded defaults; setting them (especially `CONSENSUS_SWITCH_HEIGHT=-1`) would override the built-in consensus-switch activation height.

## If your node is already running

This is an **in-place upgrade** — your existing data is preserved, so there is no need to re-download a snapshot or resync. In most cases you simply swap the binary/image and restart.

:::caution Upgrade before the consensus switch height
The network switches consensus from the Tendermint validator set to the centralized sequencer at a fixed L2 block height built into the new release. Upgrade in good time, before the chain reaches that height, so your node follows the switch without interruption.
:::

Steps:

1. **Pull the updated node image / binary** — bump the `node` image tag in `morph-node/docker-compose.yml` (Docker), or pull the new source and `make build` (binary).
2. **Make sure `L1_BEACON_CHAIN_RPC` is set** in your env file (`morph-node/.env` or `.env_hoodi`). A former validator already has it; a plain full node that ran without it must add it now. No other variables need changing.
3. **Former validators only:** add `DERIVATION_VERIFY_MODE=layer1` to keep deriving from L1. Otherwise the default (`local`) applies — nothing to set.
4. **Restart the node** (it resumes from your existing data):

   ```bash
   make stop-node && make run-node          # mainnet (Docker)
   make stop-node && make run-hoodi-node    # Hoodi (Docker)
   ```
5. **Confirm it is following the chain** — see [Verify](#verify) below.

## Verify

Check sync status as usual (see [Run a full node → Verify the Node](../full-node/1-run-in-docker.md#verify-the-node)). Every node verifies batches against L1; if it detects a mismatch you will see a log line such as:

```
root hash or withdrawal hash is not equal  originStateRootHash=0x... deriveStateRootHash=0x...
```
