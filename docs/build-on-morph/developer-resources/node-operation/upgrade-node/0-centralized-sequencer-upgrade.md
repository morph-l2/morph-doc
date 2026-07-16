---
title: Upgrade to the centralized sequencer
lang: en-US
---

Morph has moved node operation to a **centralized sequencer** architecture. This page summarizes what changed for node operators and how to upgrade an existing node.

:::tip
If you are setting up a node from scratch, just follow [Run a full node](../full-node/1-run-in-docker.md) — it already reflects the centralized-sequencer setup. This page is for operators upgrading an existing node.
:::

## What changed

- **Single node type.** There is no longer a separate *validator node* — every node runs the same binary and verifies the chain against L1. Your existing `run-morph-node` validator commands still work unchanged; a validator is now simply the single node running in `layer1` mode.
- **Batch verification is now configurable** via `DERIVATION_VERIFY_MODE` (see below). The previous validator behavior — deriving from L1 — is now an opt-in mode rather than a separate node.
- **Almost no new configuration.** Everything except the L1 beacon RPC endpoint uses per-network defaults baked into the binary, so for most operators upgrading the binary is enough.

## Environment variables

For most operators the **only** variable you may need to add is `L1_BEACON_CHAIN_RPC`. Everything else (rollup / deposit contract addresses, derivation heights) uses per-network defaults selected by the network flag — you don't need to set them.

| Variable | Required? | Notes |
|----------|-----------|-------|
| `L1_BEACON_CHAIN_RPC` | **Yes** | L1 beacon chain RPC endpoint. The node exits at startup without it — add it if your node doesn't already have one. |
| `DERIVATION_VERIFY_MODE` | Optional | Batch verification mode. Default `local` (rebuild blob from local L2 blocks and compare versioned hashes against L1). Set `layer1` to pull the L1 beacon blob and derive via the engine — **equivalent to the former validator node**. |

:::tip Were you running a validator?
If your node already passes the old `--validator` flag, **you don't need to change anything — just upgrade the binary.** `--validator` is now a deprecated alias for `--derivation.verify-mode=layer1`, so it keeps deriving from L1 exactly as before (it only logs a deprecation warning). Migrate to `DERIVATION_VERIFY_MODE=layer1` when convenient, as `--validator` will be removed in a future release.
:::

Do **not** set `L1_SEQUENCER_CONTRACT` or `MORPH_NODE_SEQUENCER_UPGRADE_TIME` — they use per-network hard-coded defaults selected by `--mainnet` / `--hoodi`. Overriding `MORPH_NODE_SEQUENCER_UPGRADE_TIME` moves the consensus-switch activation away from the network default (and a value `<= 0` disables the timestamp-triggered switch entirely).

## Activation schedule

The switch from the Tendermint validator set to the centralized sequencer triggers at a fixed L2 block **timestamp** baked into the release and selected by the network flag — you do **not** need to set it yourself. It is a fixed point in time; these values do not change:

| Network | Activation (UTC) | `MORPH_NODE_SEQUENCER_UPGRADE_TIME` (Unix ms) | Start flag |
|---------|------------------|-----------------------------------------------|------------|
| Mainnet | 2026-07-28 06:00:00 | `1785218400000` | `--mainnet` |
| Hoodi   | 2026-07-21 06:00:00 | `1784613600000` | `--hoodi`   |

Target versions: node **v0.6.0** · go-ethereum **morph-v2.2.4**. Upgrade to these (or newer) before the activation time for your network.

## If your node is already running

This is an **in-place upgrade** — your existing data is preserved, so there is no need to re-download a snapshot or resync. In most cases you simply swap the binary/image and restart.

:::caution Upgrade before the switch time
The network switches consensus from the Tendermint validator set to the centralized sequencer at a fixed L2 block **timestamp** built into the new release (see [Activation schedule](#activation-schedule) for the exact time per network). Upgrade in good time, before the chain reaches that timestamp, so your node follows the switch without interruption.
:::

Steps:

1. **Pull the updated node image / binary** — bump the `node` image tag in `morph-node/docker-compose.yml` (Docker), or pull the new source and `make build` (binary).
2. **Make sure `L1_BEACON_CHAIN_RPC` is set** in your env file (`morph-node/.env` or `.env_hoodi`). A former validator already has it; a plain full node that ran without it must add it now. No other variables need changing.
3. **Former validators:** nothing to change — the existing `--validator` flag still selects L1 derivation (it now aliases `DERIVATION_VERIFY_MODE=layer1`). For new setups, prefer `DERIVATION_VERIFY_MODE=layer1`. Plain full nodes need nothing here; the default is `local`.
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
