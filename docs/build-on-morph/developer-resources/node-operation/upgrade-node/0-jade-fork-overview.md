---
title: "Jade Fork: zkTrie → MPT Migration"
lang: en-US
---

## What Is the Jade Fork

The **Jade Fork** is a network upgrade that migrates Morph's state storage from **zkTrie** to **MPT** (Merkle Patricia Trie). After the fork, all new blocks use MPT format. Nodes that have not upgraded will be unable to process blocks past the fork height.

### Why MPT

- **Ethereum compatibility** — MPT is the standard trie used by Ethereum, reducing divergence and simplifying tooling integration.
- **Ecosystem alignment** — Standard MPT enables broader client and infrastructure compatibility.

## Fork Schedule

| Network | Fork Time (UTC) |
|---------|-----------------|
| Hoodi   | 2026-03-25 06:00:00 |
| Mainnet | 2026-04-08 06:00:00 |

## Impact on Node Operators

This upgrade is **mandatory**. After the fork activates at the scheduled time, any node that has not been upgraded will stall at the fork height and stop syncing new blocks.

:::danger
zkTrie data is **not** compatible with MPT. You cannot reuse your existing zkTrie data directory for an MPT node. A fresh MPT data directory (or an MPT snapshot restore) is required.
:::

## Upgrade Path

Choose the path that matches your current setup:

### Fresh deployment (no existing node)

Follow the [Run a Full MPT Node](../full-node/3-run-mpt-node.md) guide directly. No migration steps are needed.

### Already running a node with `--morph-mpt`

Your node is already using MPT state storage. You only need to update your binaries to the latest version:

- **geth:** `ghcr.io/morph-l2/go-ethereum:2.2.1` or later
- **node:** `ghcr.io/morph-l2/node:0.5.2` or later

Then restart your node with the same startup command.

### Running a zkTrie node (most common)

You need to perform the full migration: stop the old node, prepare a new MPT data directory, and start with `--morph-mpt`. Follow the guide for your deployment method:

- **Host (source-built):** [Jade Fork Upgrade — Host](./3-jade-fork-upgrade-host.md)
- **Docker:** [Jade Fork Upgrade — Docker](./4-jade-fork-upgrade-docker.md)

## FAQ / Troubleshooting

### Can I reuse my zkTrie data directory?

**No.** zkTrie and MPT data formats are incompatible. You must prepare a fresh MPT data directory or restore from an MPT snapshot. See the [MPT snapshot naming](../full-node/3-run-mpt-node.md#mpt-snapshot-naming) section for details.

### What if I miss the fork time?

Your node will stop processing new blocks at the fork height. To recover, perform the full upgrade procedure — prepare an MPT data directory, restore from an MPT snapshot, and start with `--morph-mpt`. Your node will then sync forward from the snapshot.

### Can I roll back to zkTrie after upgrading?

**No.** The Jade Fork is a one-way upgrade. Once the network passes the fork height, all new blocks use MPT format. There is no supported path to revert to zkTrie.

### My node crashes after upgrading — how do I debug?

1. **Check `geth` logs** for errors related to state storage or trie access. Common causes:
   - Starting `geth` without the `--morph-mpt` flag
   - Using an old zkTrie data directory instead of a fresh MPT directory
2. **Verify binary versions** — ensure you are running `geth >= 2.2.1` and `node >= 0.5.2`.
3. **Verify data directory** — confirm you are pointing at the MPT data directory, not the old zkTrie one.
4. **Re-download the MPT snapshot** if the data appears corrupted.

### Where can I get help?

Join the [Morph Discord](https://discord.com/invite/L2Morph) and ask in the node-operators channel.
