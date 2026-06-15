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
- **Some environment variables are now required for every node** (previously only the validator set them).

## Environment variables

### New

| Variable | Default | Purpose |
|----------|---------|---------|
| `DERIVATION_VERIFY_MODE` | `local` | Batch verification mode. `local` rebuilds the blob from local L2 blocks and compares versioned hashes against L1 (no beacon fetch on the happy path). `layer1` pulls the L1 beacon blob, decodes it, and derives blocks via the engine — **equivalent to the former validator node**. Leave empty for the default. |

:::tip Want the old validator behavior?
If you previously ran a validator node to derive from L1, set `DERIVATION_VERIFY_MODE=layer1` in your env file. Otherwise the default (`local`) is sufficient for most operators.
:::

### Now required for all nodes

These were only needed by the validator before; every node needs them now:

| Variable | Purpose |
|----------|---------|
| `L1_BEACON_CHAIN_RPC` | L1 beacon chain RPC endpoint. |
| `L1MESSAGEQUEUE_CONTRACT` | Deposit (L1 message queue) contract address. |
| `DERIVATION_START_HEIGHT` | Must match your snapshot (see the run-morph-node README). |
| `L2_BASE_HEIGHT` | Must match your snapshot. |

### Not operator configuration

Do **not** set `L1_SEQUENCER_CONTRACT` or `CONSENSUS_SWITCH_HEIGHT`. These use per-network hard-coded defaults in the binary. Setting them (especially `CONSENSUS_SWITCH_HEIGHT=-1`) would override the built-in consensus-switch activation height.

## If your node is already running

This is an **in-place upgrade** — your existing MPT data is preserved, so there is no need to re-download a snapshot or resync from scratch. You swap the node image/binary, adjust the env file, and restart.

:::caution Upgrade before the consensus switch height
The network switches consensus from the Tendermint validator set to the centralized sequencer at a fixed L2 block height that is built into the new release. A node still running the **old** binary when the chain reaches that height will stop following the chain correctly. **Upgrade before the network reaches the switch height** to avoid downtime.
:::

Steps:

1. **Pull the updated node image / binary** that includes the centralized-sequencer changes — bump the `node` image tag in `morph-node/docker-compose.yml` (Docker), or pull the new source and `make build` (binary).
2. **Stop your current node:**

   ```bash
   make stop-node     # Docker
   # or: make stop-binary   (binary mode)
   ```

   If you were running a validator, stop it — there is no separate validator service anymore; you will start a single node.
3. **Update your env file** (`morph-node/.env` or `.env_hoodi`) to include the variables now required for all nodes (`L1_BEACON_CHAIN_RPC`, `L1MESSAGEQUEUE_CONTRACT`, `DERIVATION_START_HEIGHT`, `L2_BASE_HEIGHT`). If you previously ran a plain full node without `L1_BEACON_CHAIN_RPC`, add it now.
4. **(Optional) choose a verification mode.** Set `DERIVATION_VERIFY_MODE=layer1` to keep the former validator's L1-derivation behavior; otherwise leave it unset for the default (`local`).
5. **Restart the node** (it resumes from your existing data):

   ```bash
   make run-node        # mainnet
   make run-hoodi-node  # Hoodi
   ```
6. **Confirm it is following the chain** — see [Verify](#verify) below.

## Verify

Check sync status as usual (see [Run a full node → Verify the Node](../full-node/1-run-in-docker.md#verify-the-node)). Every node verifies batches against L1; if it detects a mismatch you will see a log line such as:

```
root hash or withdrawal hash is not equal  originStateRootHash=0x... deriveStateRootHash=0x...
```
