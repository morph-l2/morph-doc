---
title: Run a validator node
lang: en-US
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide covers running a Morph validator node using [run-morph-node](https://github.com/morph-l2/run-morph-node). If you are unfamiliar with validator duties, refer to the [optimistic zkEVM](../../../../how-morph-works/3-optimistic-zkevm.md) design overview.

:::note
The `validator.privateKey` flag is a required parameter but is currently unused — challenges from third-party addresses are not yet accepted. Use `0x0000000000000000000000000000000000000000000000000000000000000001`.
:::

## Prerequisites

A validator node requires Layer 1 RPC access. Set these values in `morph-node/.env` (mainnet) or `morph-node/.env_hoodi` (Hoodi) before starting:

```bash
L1_ETH_RPC=<your L1 execution client RPC URL>
L1_BEACON_CHAIN_RPC=<your L1 beacon chain RPC URL>
```

All other configuration is pre-set in the repository.

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

### 2. Configure L1 RPC URLs

Edit `.env` (mainnet) or `.env_hoodi` (Hoodi) and fill in your L1 RPC endpoints.

### 3. Download the snapshot

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

### 4. Set up the snapshot data

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

### 5. Run the validator

<Tabs>
<TabItem value="docker" label="Docker — Mainnet">

```bash
make run-validator
```

</TabItem>
<TabItem value="docker-hoodi" label="Docker — Hoodi">

```bash
make run-hoodi-validator
```

</TabItem>
<TabItem value="binary" label="Binary — Mainnet">

```bash
make run-validator-binary
```

</TabItem>
<TabItem value="binary-hoodi" label="Binary — Hoodi">

```bash
make run-hoodi-validator-binary
```

</TabItem>
</Tabs>

To stop a binary-mode node:

```bash
make stop-binary
```

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
