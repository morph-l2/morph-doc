---
title: Run a full node
lang: en-US
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide will help you start a full node using [run-morph-node](https://github.com/morph-l2/run-morph-node).

:::tip Already running a node?
If you are upgrading an existing **zkTrie node**, do **not** redeploy from scratch. Follow the [Upgrade & Forks](../upgrade-node/0-jade-fork-overview.md) guide instead.
:::

## Hardware Requirements

| Resource | Minimum |
|----------|---------|
| CPU | 4+ cores |
| RAM | 32 GB |
| Disk | 1 TB SSD |
| Network | 25+ Mbit/s download |

## Quick Start

### 1. Clone the repository

<Tabs>
<TabItem value="docker" label="Docker">

```bash
git clone https://github.com/morph-l2/run-morph-node.git
cd run-morph-node/morph-node
```

</TabItem>
<TabItem value="binary" label="Binary">

```bash
git clone --recurse-submodules https://github.com/morph-l2/run-morph-node.git
cd run-morph-node/morph-node
make build
```

Building `geth` requires a C compiler (gcc / clang).

</TabItem>
</Tabs>

### 2. Download the snapshot

<Tabs>
<TabItem value="mainnet" label="Mainnet">

```bash
make download-and-decompress-mainnet-snapshot
```

</TabItem>
<TabItem value="hoodi" label="Hoodi">

```bash
make download-and-decompress-hoodi-snapshot
```

</TabItem>
</Tabs>

### 3. Set up the snapshot data

<Tabs>
<TabItem value="mainnet" label="Mainnet">

```bash
mv ./mpt-snapshot-*/geth ../mainnet/geth-data
mkdir -p ../mainnet/node-data/data
mv ./mpt-snapshot-*/data/* ../mainnet/node-data/data
```

</TabItem>
<TabItem value="hoodi" label="Hoodi">

```bash
mv ./mpt-snapshot-*/geth ../hoodi/geth-data
mkdir -p ../hoodi/node-data/data
mv ./mpt-snapshot-*/data/* ../hoodi/node-data/data
```

</TabItem>
</Tabs>

### 4. Run the node

<Tabs>
<TabItem value="docker" label="Docker — Mainnet">

```bash
make run-node
```

</TabItem>
<TabItem value="docker-hoodi" label="Docker — Hoodi">

```bash
make run-hoodi-node
```

</TabItem>
<TabItem value="binary" label="Binary — Mainnet">

```bash
make run-node-binary
```

</TabItem>
<TabItem value="binary-hoodi" label="Binary — Hoodi">

```bash
make run-hoodi-node-binary
```

</TabItem>
</Tabs>

To stop a binary-mode node:

```bash
make stop-binary
```

:::info Running a ZK (legacy) node?
Use `make run-zk-node` (Docker) or `make run-zk-node-binary` (Binary) instead.
:::

## Verify the Node

```bash
# Check geth peer connections
curl -X POST -H 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":74}' \
  localhost:8545

# Check consensus client sync status
curl http://localhost:26657/status
```

When `catching_up` is `false`, the node has finished syncing.

## Advanced Usage

### Customizing the data directory

By default, data is stored under `../mainnet` or `../hoodi`. To use a different path, set `MORPH_HOME` in the env file:

```bash
MORPH_HOME=/your/custom/path
```

### Customizing geth flags

Edit `morph-node/entrypoint-geth.sh` to change geth startup flags.

:::tip
`entrypoint-geth.sh` sets `--gcmode=archive` by default. Remove or change it to run a pruned node. Geth's default (without the flag) is full node mode.
:::

### Sync from genesis

You can skip the snapshot steps and run the node directly. This is much slower and **not recommended** for most operators.
