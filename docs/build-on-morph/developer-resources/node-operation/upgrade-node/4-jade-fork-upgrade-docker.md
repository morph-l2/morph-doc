---
title: "Jade Fork Upgrade — Docker"
lang: en-US
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide walks you through **optionally migrating** an existing **Docker-based** Morph node from zkTrie to MPT storage.

:::note
This migration is **not required** to sync past the Jade Fork. Existing zkTrie nodes only need an image update to geth:2.2.1 / node:0.5.2 or later — see the general [Upgrade Node — Docker](./2-upgrade-node-docker.md) guide for that. Follow this guide only if you want to switch to MPT storage.
:::

:::caution
zkTrie data is **not** compatible with MPT. Do **not** reuse your old data directory. You must prepare a fresh MPT data directory or restore from an MPT snapshot.
:::

For a full overview of the Jade Fork and which upgrade path applies to you, see the [Jade Fork Overview](./0-jade-fork-overview.md).

## Prerequisites

- An existing Morph node running via Docker using the [`run-morph-node`](https://github.com/morph-l2/run-morph-node) repository
- Familiarity with the [Run a Full MPT Node with Docker](../full-node/3-run-mpt-node.md#run-a-full-mpt-node-with-docker) guide

## Step 1: Back Up Your Configuration

Note your current docker-compose settings and environment files before making changes:

```bash
cd run-morph-node/morph-node
cp docker-compose.yml docker-compose.yml.bak
```

## Step 2: Update Docker Image Versions

Update `morph-node/docker-compose.yml` to use the latest images:

```yaml title="morph-node/docker-compose.yml"
services:
  geth:
    image: ghcr.io/morph-l2/go-ethereum:2.2.1  # required for Jade Fork
    # ...

  node:
    image: ghcr.io/morph-l2/node:0.5.2  # required for Jade Fork
    # ...
```

## Step 3: Stop the Running Containers

```bash
make stop-node
```

If you are running a validator:

```bash
make stop-validator
```

## Step 4: Prepare the MPT Data Directory

:::warning
If `MORPH_HOME` already contains old zkTrie data, do **not** reuse it. Use a new empty directory, or back up the old data first and restore the MPT snapshot into a clean location.
:::

### Configure MPT environment overrides

Create or update `.env_mpt` with MPT-specific settings:

```bash title=".env_mpt"
# MPT-specific overrides
GETH_ENTRYPOINT_FILE=./entrypoint-geth-mpt.sh

# Use the published MPT snapshot names for the target network
MAINNET_MPT_SNAPSHOT_NAME=mpt-snapshot-20260312-1
HOODI_MPT_SNAPSHOT_NAME=mpt-snapshot-20260312-1
```

For details on how `.env_mpt` works with the base environment files, see the [Prepare the MPT environment overrides](../full-node/3-run-mpt-node.md#3-prepare-the-mpt-environment-overrides) section.

### Download the MPT snapshot

<Tabs>
<TabItem value="mainnet" label="Mainnet">

```bash
make download-and-decompress-mainnet-mpt-snapshot
```

</TabItem>
<TabItem value="hoodi" label="Hoodi">

```bash
make download-and-decompress-hoodi-mpt-snapshot
```

</TabItem>
</Tabs>

After downloading, set up the data directories as described in [Set up the snapshot data](../full-node/3-run-mpt-node.md#5-set-up-the-snapshot-data).

## Step 5: Run the MPT Node

<Tabs>
<TabItem value="mainnet" label="Mainnet">

```bash
make run-mainnet-mpt-node
```

</TabItem>
<TabItem value="hoodi" label="Hoodi">

```bash
make run-hoodi-mpt-node
```

</TabItem>
</Tabs>

These commands start `geth` with the MPT entrypoint and run the consensus client using the selected environment.

## Step 6: Verify

Check that `geth` is connected to peers:

```bash
curl -X POST -H 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":74}' \
  localhost:8545
```

Check the consensus client sync status:

```bash
curl http://localhost:26657/status
```

When `catching_up` becomes `false`, the node has finished syncing.
