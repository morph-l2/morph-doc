---
title: "zkTrie -> MPT Migration"
lang: en-US
---

This page focuses on one task: migrating a node from **zkTrie** state storage to **MPT**.

## What changes with MPT

- **State format changes** from zkTrie to MPT.
- **Data is not reusable** across formats.
- **Migration is one-way** for data directories.

::::danger
Do **not** reuse an existing zkTrie data directory for an MPT node. Prepare a fresh MPT data directory or restore from an MPT snapshot.
::::

## Pick your path

### 1) Fresh deployment

If you are deploying a new node, use the full node guide directly (MPT is the default path):

- [Run a full node](../full-node/1-run-in-docker.md)

### 2) Existing zkTrie node, binary update only

If you want to keep zkTrie storage for now, update binaries and restart using the same startup command.

- **Host:** [Upgrade node running on the host](./1-upgrade-node-host.md)
- **Docker:** [Upgrade node running from docker](./2-upgrade-node-docker.md)

### 3) Existing zkTrie node, migrate to MPT

If you want to switch storage to MPT:

1. Stop the current node.
2. Prepare a fresh MPT data directory (or restore an MPT snapshot).
3. Start the node with MPT configuration.

For setup details, follow:

- [Run a full node](../full-node/1-run-in-docker.md)

## Quick checks

- **Can I reuse zkTrie data?** No.
- **Can I roll back MPT data to zkTrie?** No, there is no supported data rollback path.
- **Where are snapshot versions and matching heights?** See [Snapshot Information](https://github.com/morph-l2/run-morph-node?tab=readme-ov-file#snapshot-information).
