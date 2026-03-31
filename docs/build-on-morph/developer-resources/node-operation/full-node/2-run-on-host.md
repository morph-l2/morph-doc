---
title: Run a full node from source
lang: en-US
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide outlines the steps to start a Morph node from source. The example assumes the home directory is `~/.morph`.

New deployments use **MPT** (Merkle Patricia Trie) state storage by default.

### Recommended Versions

**morph-v2.2.1** or later is recommended.

## Hardware Requirements

Running a Morph node requires two processes:

| Process | Description |
|---------|-------------|
| `geth`  | Morph execution layer |
| `node`  | Morph consensus layer |

Recommended hardware:

- Fast CPU with 4+ cores
- 32GB+ RAM
- High-performance SSD with at least 1TB of free space
- 25+ MBit/sec download bandwidth

## Build Executable Binaries

### 1. Clone Morph

```bash
mkdir -p ~/.morph
cd ~/.morph
git clone https://github.com/morph-l2/morph.git
```

Check out a release that includes MPT support and the Jade fork configuration.

```bash
cd morph
git checkout ${RELEASE_VERSION}
```

### 2. Build geth

A C compiler is required to build `geth`.

```bash
make geth
```

### 3. Build the node

```bash
cd ~/.morph/morph/node
make build
```

## Config Preparation

### 1. Download config files and create the data directory

<Tabs>
<TabItem value="mainnet" label="Mainnet">

```bash
cd ~/.morph
wget https://raw.githubusercontent.com/morph-l2/run-morph-node/main/mainnet/data.zip
unzip data.zip
```

</TabItem>
<TabItem value="hoodi" label="Hoodi">

```bash
cd ~/.morph
wget https://raw.githubusercontent.com/morph-l2/run-morph-node/main/hoodi/data.zip
unzip data.zip
```

</TabItem>
</Tabs>

### 2. Create the shared JWT secret

```bash
cd ~/.morph
openssl rand -hex 32 > jwt-secret.txt
```

## Start the Node

Mainnet and Hoodi MPT nodes are best started from an MPT snapshot.

### Sync from Snapshot (Recommended)

First build the binaries and prepare the config files as shown above. Then download an MPT snapshot.

#### Download the MPT snapshot

Use the dedicated MPT snapshot links, **not** the standard `snapshot-*` links.

<Tabs>
<TabItem value="mainnet" label="Mainnet">

```bash
wget -q --show-progress https://snapshot.morphl2.io/mainnet/mpt-snapshot-20260312-1.tar.gz
tar -xzvf mpt-snapshot-20260312-1.tar.gz
```

</TabItem>
<TabItem value="hoodi" label="Hoodi">

```bash
wget -q --show-progress https://snapshot.morphl2.io/hoodi/mpt-snapshot-20260312-1.tar.gz
tar -xzvf mpt-snapshot-20260312-1.tar.gz
```

</TabItem>
</Tabs>

If a newer MPT snapshot is available, replace `mpt-snapshot-20260312-1` with the latest published value.

#### Set up the snapshot data

Move the snapshot data into the prepared data directories:

```bash
mkdir -p ~/.morph/node-data/data
mv mpt-snapshot-20260312-1/geth ~/.morph/geth-data
mv mpt-snapshot-20260312-1/data/* ~/.morph/node-data/data
```

#### Start the execution client

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

Follow the `geth` log:

```bash
tail -f geth.log
```

Check whether `geth` is connected to peers:

```bash
curl -X POST -H 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":74}' \
  localhost:8545
```

#### Start the consensus client

```bash
./morph/node/build/bin/morphnode --home ./node-data \
    --l2.jwt-secret ./jwt-secret.txt \
    --l2.eth http://localhost:8545 \
    --l2.engine http://localhost:8551 \
    --log.filename ./node.log
```

Follow the node log:

```bash
tail -f node.log
```

#### Check sync status

```bash
curl http://localhost:26657/status
```

When `catching_up` becomes `false`, the node has finished catching up.

### Sync from Genesis Block

You can also start an MPT node from genesis without downloading a snapshot.

In that case:

- Prepare a fresh MPT data directory
- Start `geth` with `--morph-mpt`
- Start the consensus client after `geth` is running

:::tip
This method is much slower than restoring from an MPT snapshot and is **not recommended** for most operators.
:::

## MPT Snapshot Naming

MPT snapshots use dedicated links and do **not** use the standard `snapshot-*` naming pattern.

| Type | Naming Pattern | Example |
|------|---------------|---------|
| Standard snapshot | `snapshot-YYYYMMDD-N` | `snapshot-20260312-1` |
| MPT snapshot | `mpt-snapshot-YYYYMMDD-N` | `mpt-snapshot-20260312-1` |

Use the dedicated MPT snapshot URL pattern:

```
https://snapshot.morphl2.io/<network>/mpt-snapshot-YYYYMMDD-N.tar.gz
```
