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

A **binary update** is mandatory. After the fork activates at the scheduled time, any node running binaries older than **morph-v2.2.1** will stall at the fork height and stop syncing new blocks.

Existing zkTrie nodes that update their binaries can continue to process new MPT-format blocks without changing their storage format — just as MPT nodes could process zkTrie blocks before the fork. However, MPT storage is recommended for all new deployments.

:::danger
If you choose to migrate to MPT storage, zkTrie data is **not** compatible with MPT. You cannot reuse your existing zkTrie data directory for an MPT node. A fresh MPT data directory (or an MPT snapshot restore) is required.
:::

## Upgrade Path

Choose the path that matches your current setup:

### Fresh deployment (no existing node)

Follow the [Run a Full MPT Node](../full-node/3-run-mpt-node.md) guide directly. MPT is recommended for all new deployments.

### Already running a node with `--morph-mpt`

Your node is already using MPT state storage. You only need to update your binaries to the latest version:

- **geth:** `ghcr.io/morph-l2/go-ethereum:2.2.1` or later
- **node:** `ghcr.io/morph-l2/node:0.5.2` or later

Then restart your node with the same startup command.

### Running a zkTrie node — binary update only

If you want to keep your zkTrie storage, simply update your binaries to **morph-v2.2.1** or later and restart. Your node will continue to sync new blocks normally.

### Running a zkTrie node — migrate to MPT storage (optional)

If you want to switch to MPT storage, you need to: stop the old node, prepare a new MPT data directory, and start with `--morph-mpt`. Follow the guide for your deployment method:

- **Host (source-built):** [Jade Fork Upgrade — Host](./3-jade-fork-upgrade-host.md)
- **Docker:** [Jade Fork Upgrade — Docker](./4-jade-fork-upgrade-docker.md)

## FAQ / Troubleshooting

### Can I reuse my zkTrie data directory?

**No.** zkTrie and MPT data formats are incompatible. You must prepare a fresh MPT data directory or restore from an MPT snapshot. See the [MPT snapshot naming](../full-node/3-run-mpt-node.md#mpt-snapshot-naming) section for details.

### What if I miss the fork time?

Your node will stop processing new blocks at the fork height. To recover, update your binaries to **morph-v2.2.1** or later and restart with the same startup command. Your node will resume syncing from where it stopped.

If you also want to migrate to MPT storage at this point, follow the [Jade Fork Upgrade — Host](./3-jade-fork-upgrade-host.md) or [Jade Fork Upgrade — Docker](./4-jade-fork-upgrade-docker.md) guide instead.

### Can I roll back from MPT storage to zkTrie?

**No.** If you have migrated your node to MPT storage (i.e. you are running with `--morph-mpt`), there is no supported path to revert to zkTrie data. The migration is one-way.

If you only updated your binaries and are still running a zkTrie node, no rollback is needed — you can downgrade the binary if necessary, though this is not recommended.

### My node crashes after upgrading — how do I debug?

First, determine which upgrade path you took:

**Binary update only (zkTrie node):**
1. **Verify binary versions** — ensure you are running `geth >= 2.2.1` and `node >= 0.5.2`.
2. **Check `geth` logs** for startup errors. Make sure you are using the same startup command as before — do not add `--morph-mpt` to a zkTrie node.

**Migrated to MPT storage:**
1. **Check `geth` logs** for errors related to state storage or trie access. Common causes:
   - Missing `--morph-mpt` flag in the startup command
   - Accidentally pointing at the old zkTrie data directory
2. **Verify binary versions** — ensure you are running `geth >= 2.2.1` and `node >= 0.5.2`.
3. **Verify the data directory** — confirm `--datadir` points at the fresh MPT data directory, not the old zkTrie one.
4. **Re-download the MPT snapshot** if the data appears corrupted.

### Where can I get help?

Join the [Morph Discord](https://discord.com/invite/L2Morph) and ask in the node-operators channel.
