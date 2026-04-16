---
title: Run a validator node
lang: en-US
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide covers running a Morph validator node using [run-morph-node](https://github.com/morph-l2/run-morph-node). If you are unfamiliar with validator duties, refer to the [optimistic zkEVM](../../../../how-morph-works/3-optimistic-zkevm.md) design overview.

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

</TabItem>
</Tabs>

### 2. Configure L1 RPC endpoints

A validator requires L1 access to fetch rollup data. Set the following in `morph-node/.env` (mainnet) or `morph-node/.env_hoodi` (Hoodi):

```bash
L1_ETH_RPC=<your L1 execution client RPC URL>
L1_BEACON_CHAIN_RPC=<your L1 beacon chain RPC URL>
```

### 3. Select a snapshot version (optional)

The default snapshot is pre-configured in `morph-node/.env` / `morph-node/.env_hoodi`. To use a different version, update the following variables in the env file before downloading:

```bash
# Snapshot name (find available versions in the repo README)
MAINNET_MPT_SNAPSHOT_NAME=mpt-snapshot-YYYYMMDD-N    # mainnet
HOODI_MPT_SNAPSHOT_NAME=mpt-snapshot-YYYYMMDD-N      # Hoodi

# Heights must match your snapshot — find the correct values in the repo README
DERIVATION_START_HEIGHT=<height matching your snapshot>
L1_MSG_START_HEIGHT=<height matching your snapshot>
MORPH_NODE_DERIVATION_BASE_HEIGHT=<base height matching your snapshot>
```

See [Snapshot Information](https://github.com/morph-l2/run-morph-node?tab=readme-ov-file#snapshot-information) for available snapshots and their corresponding height values.

### 4. Download the snapshot

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

### 5. Set up the snapshot data

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

### 6. Run the validator

<Tabs>
<TabItem value="docker" label="Docker — Mainnet">

```bash
make run-validator

# To stop:
make stop-validator

# To remove containers:
make rm-validator
```

</TabItem>
<TabItem value="docker-hoodi" label="Docker — Hoodi">

```bash
make run-hoodi-validator

# To stop:
make stop-validator

# To remove containers:
make rm-validator
```

</TabItem>
<TabItem value="binary" label="Binary — Mainnet">

```bash
make run-validator-binary

# To stop:
make stop-binary
```

</TabItem>
<TabItem value="binary-hoodi" label="Binary — Hoodi">

```bash
make run-hoodi-validator-binary

# To stop:
make stop-binary
```

</TabItem>
</Tabs>

## Verify the Node

```bash
# Check sync status
curl http://localhost:26657/status
```

When `catching_up` is `false`, the node is in sync. If the validator detects a state root mismatch, you will see a log line like:

```
root hash or withdrawal hash is not equal  originStateRootHash=0x... deriveStateRootHash=0x...
```

This means the validator found an inconsistency between the sequencer submission and its own derivation.

