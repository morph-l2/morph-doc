---
title: "Jade Fork Upgrade — Host"
lang: en-US
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide walks you through upgrading an existing **host-based (source-built)** Morph node from zkTrie to MPT for the Jade Fork.

:::caution
zkTrie data is **not** compatible with MPT. Do **not** reuse your old data directory. You must prepare a fresh MPT data directory or restore from an MPT snapshot.
:::

For a full overview of the Jade Fork and which upgrade path applies to you, see the [Jade Fork Overview](./0-jade-fork-overview.md).

## Prerequisites

- An existing Morph node running from source
- Familiarity with the [Run a Full MPT Node from Source](../full-node/3-run-mpt-node.md#run-a-full-mpt-node-from-source) guide

## Step 1: Back Up Your Configuration

Before making any changes, back up your current configuration files and note your startup command:

```bash
cp -r ~/.morph/node-data/config ~/.morph/node-data/config.bak
cp ~/.morph/jwt-secret.txt ~/.morph/jwt-secret.txt.bak
```

## Step 2: Build New Binaries

Compile **morph-v2.2.1** or later, which includes MPT support and the Jade fork configuration.

```bash
cd ~/.morph/morph
git fetch origin
git checkout v2.2.1  # or the latest release

# Build geth
make geth

# Build node
cd node && make build
```

For more details on building from source, see the [Build Executable Binaries](../full-node/3-run-mpt-node.md#build-executable-binaries) section.

## Step 3: Stop the Running Node

```bash
# Stop morphnode
pid=$(ps -ef | grep morphnode | grep -v grep | awk '{print $2}')
kill $pid

# Stop geth
pid=$(ps -ef | grep geth | grep -v grep | awk '{print $2}')
kill $pid
```

## Step 4: Prepare the MPT Data Directory

:::warning
Do **not** start the MPT node on your old zkTrie data directory. Use a fresh directory.
:::

Download and restore an MPT snapshot. See [MPT Snapshot Naming](../full-node/3-run-mpt-node.md#mpt-snapshot-naming) for how snapshot URLs are structured.

<Tabs>
<TabItem value="mainnet" label="Mainnet">

```bash
cd ~/.morph
wget -q --show-progress https://snapshot.morphl2.io/mainnet/mpt-snapshot-20260312-1.tar.gz
tar -xzvf mpt-snapshot-20260312-1.tar.gz
```

</TabItem>
<TabItem value="hoodi" label="Hoodi">

```bash
cd ~/.morph
wget -q --show-progress https://snapshot.morphl2.io/hoodi/mpt-snapshot-20260312-1.tar.gz
tar -xzvf mpt-snapshot-20260312-1.tar.gz
```

</TabItem>
</Tabs>

If a newer MPT snapshot is available, replace `mpt-snapshot-20260312-1` with the latest published name.

Set up the data directories:

```bash
mkdir -p ~/.morph/node-data/data
mv mpt-snapshot-20260312-1/geth ~/.morph/geth-data
mv mpt-snapshot-20260312-1/data/* ~/.morph/node-data/data
```

For the full directory structure and more details, see [Set up the snapshot data](../full-node/3-run-mpt-node.md#sync-from-snapshot-recommended).

## Step 5: Start the Node with `--morph-mpt`

Start `geth` with the `--morph-mpt` flag. This is the key difference from a standard startup.

<Tabs>
<TabItem value="mainnet" label="Mainnet">

```bash
./morph/go-ethereum/build/bin/geth --morph \
    --morph-mpt \
    --datadir "./geth-data" \
    --http --http.api=web3,debug,eth,txpool,net,engine,morph \
    --authrpc.addr localhost \
    --authrpc.vhosts="localhost" \
    --authrpc.port 8551 \
    --authrpc.jwtsecret=./jwt-secret.txt \
    --gcmode=archive \
    --log.filename=./geth.log
```

</TabItem>
<TabItem value="hoodi" label="Hoodi">

```bash
./morph/go-ethereum/build/bin/geth --morph-hoodi \
    --morph-mpt \
    --datadir "./geth-data" \
    --http --http.api=web3,debug,eth,txpool,net,engine,morph \
    --authrpc.addr localhost \
    --authrpc.vhosts="localhost" \
    --authrpc.port 8551 \
    --authrpc.jwtsecret=./jwt-secret.txt \
    --gcmode=archive \
    --log.filename=./geth.log
```

</TabItem>
</Tabs>

Then start the consensus client:

```bash
./morph/node/build/bin/morphnode --home ./node-data \
    --l2.jwt-secret ./jwt-secret.txt \
    --l2.eth http://localhost:8545 \
    --l2.engine http://localhost:8551 \
    --log.filename ./node.log
```

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
