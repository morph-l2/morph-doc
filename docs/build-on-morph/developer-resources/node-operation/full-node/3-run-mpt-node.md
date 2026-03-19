---
title: Run a Full MPT Node on Morph
lang: en-US
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This document explains how to run a full Morph node in **MPT** mode.

For new full-node deployments, using the MPT startup path is recommended. Follow this guide to prepare an MPT-compatible data directory, restore from an MPT snapshot if needed, and start `geth` with `--morph-mpt`.

:::caution
If you previously ran a node with `zkTrie`, do **not** start an MPT node directly on the old data directory.

`zkTrie` data and `MPT` data should be treated as incompatible for node startup. To run an MPT node safely:

- Prepare a fresh MPT data directory, **or**
- Restore from an MPT snapshot

Do **not** reuse the old zkTrie `geth` data directory for `--morph-mpt`.
:::

## Overview

Morph supports running full nodes with **MPT** (Merkle Patricia Trie) state storage.

The **Jade** fork is the time-based point at which blocks use MPT format instead of zkTrie format.

| Network | Jade Fork Time |
|---------|---------------|
| Hoodi   | 2026-03-25 06:00:00 UTC |
| Mainnet | 2026-04-08 06:00:00 UTC |

When running an MPT node:

- Start `geth` with `--morph-mpt`
- Use an MPT-compatible data directory
- Use dedicated MPT snapshots published with the `mpt-snapshot-*` prefix

### MPT Snapshot Naming

MPT snapshots use dedicated links and do **not** use the standard `snapshot-*` naming pattern.

| Type | Naming Pattern | Example |
|------|---------------|---------|
| Standard snapshot | `snapshot-YYYYMMDD-N` | `snapshot-20260312-1` |
| MPT snapshot | `mpt-snapshot-YYYYMMDD-N` | `mpt-snapshot-20260312-1` |

Use the dedicated MPT snapshot URL pattern:

```
https://snapshot.morphl2.io/<network>/mpt-snapshot-YYYYMMDD-N.tar.gz
```

Examples:

- `https://snapshot.morphl2.io/mainnet/mpt-snapshot-20260312-1.tar.gz`
- `https://snapshot.morphl2.io/hoodi/mpt-snapshot-20260312-1.tar.gz`

### Recommended Versions

| Component | Image |
|-----------|-------|
| geth | `ghcr.io/morph-l2/go-ethereum:2.2.1` |
| node | `ghcr.io/morph-l2/node:0.5.2` |

A Morph release that includes MPT support and Jade fork configuration is required. **morph-v2.2.1** or later is recommended.

## Run a Full MPT Node with Docker

This section follows the same general flow as the existing [Docker docs](./run-in-docker), but uses the MPT-specific startup path.

Reference materials:

- [Run a full node with docker](./run-in-docker)
- [`run-morph-node`](https://github.com/morph-l2/run-morph-node)

### Quick Start

#### 1. Clone the repository

```bash
git clone https://github.com/morph-l2/run-morph-node.git
cd run-morph-node/morph-node
```

#### 2. Use the latest geth image

Make sure the `geth` service uses the latest recommended Morph geth image:

```yaml
image: ghcr.io/morph-l2/go-ethereum:2.2.1
```

If your local checkout still uses an older tag, update `morph-node/docker-compose.yml` before starting the node.

#### 3. Prepare the MPT environment overrides

The Docker MPT flow uses `.env_mpt` as an override on top of `.env` for mainnet or `.env_hoodi` for Hoodi.

Example `.env_mpt`:

```bash
# MPT-specific overrides
GETH_ENTRYPOINT_FILE=./entrypoint-geth-mpt.sh

# Use the published MPT snapshot names for the target network
MAINNET_MPT_SNAPSHOT_NAME=mpt-snapshot-20260312-1
HOODI_MPT_SNAPSHOT_NAME=mpt-snapshot-20260312-1
```

:::caution
For MPT nodes, the snapshot name **must** use the `mpt-snapshot-*` prefix. Do not use the standard `snapshot-*` name here.
:::

#### 4. Download and decompress the MPT snapshot

<Tabs>
<TabItem value="mainnet" label="Mainnet">

```bash
make download-and-decompress-mainnet-mpt-snapshot
```

This downloads from:

```
https://snapshot.morphl2.io/mainnet/mpt-snapshot-20260312-1.tar.gz
```

</TabItem>
<TabItem value="hoodi" label="Hoodi">

```bash
make download-and-decompress-hoodi-mpt-snapshot
```

This downloads from:

```
https://snapshot.morphl2.io/hoodi/mpt-snapshot-20260312-1.tar.gz
```

</TabItem>
</Tabs>

#### 5. Set up the snapshot data

:::warning
If `MORPH_HOME` already contains old zkTrie data, do **not** reuse it directly for an MPT node. Use a new empty directory, or back up the old data first and restore the MPT snapshot into a clean location.
:::

After downloading, place the decompressed data under the directory specified by `MORPH_HOME`. For example, if the snapshot folder is named `mpt-snapshot-20260312-1`:

```bash
mv ./mpt-snapshot-20260312-1/geth ${MORPH_HOME}/geth-data
mkdir -p ${MORPH_HOME}/node-data/data
mv ./mpt-snapshot-20260312-1/data/* ${MORPH_HOME}/node-data/data
```

The directory structure should look like this:

```
└── ${MORPH_HOME}
    ├── geth-data
    │   ├── static-nodes.json
    │   └── geth
    └── node-data
        ├── config
        │   ├── config.toml
        │   └── genesis.json
        └── data
```

#### 6. Run the node

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

### Advanced Usage

#### Customizing the data directory

The host directories mounted by Docker are controlled by the environment files.

Example:

```bash
MORPH_HOME=../mainnet
MORPH_FLAG=morph
JWT_SECRET_FILE=${MORPH_HOME}/jwt-secret.txt
GETH_ENTRYPOINT_FILE=./entrypoint-geth-mpt.sh
```

If you customize `MORPH_HOME`, make sure the `geth-data` and `node-data` directories exist under that location and contain the required config files.

For testnet, use `.env_hoodi` together with `.env_mpt`.

#### Customizing parameters

To customize the execution client startup command, edit:

```
morph-node/entrypoint-geth-mpt.sh
```

To customize consensus-layer parameters, edit:

```
mainnet/node-data/config/config.toml   # for mainnet
hoodi/node-data/config/config.toml     # for Hoodi
```

:::tip
The current reference MPT entrypoint still uses `--gcmode=archive` by default. If you want to run a pruned MPT node, customize the `geth` flags in `entrypoint-geth-mpt.sh` after validating your operational requirements.
:::

### Verify the node

Check whether `geth` is connected to peers:

```bash
curl -X POST -H 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":74}' \
  localhost:8545
```

Check the consensus client status:

```bash
curl http://localhost:26657/status
```

When `catching_up` becomes `false`, the node has finished catching up.

## Run a Full MPT Node from Source

This section follows the same general flow as the existing [source-based docs](./run-on-host), but uses the MPT-specific startup path.

Reference materials:

- [Run a full node from source](./run-on-host)

### Hardware Requirements

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

:::note
MPT mode does not require archive-only operation in Morph's CLI configuration. However, the reference commands below still use `--gcmode=archive` by default for consistency with the current scripts.
:::

### Build Executable Binaries

#### 1. Clone Morph

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

**morph-v2.2.1** or later is recommended.

#### 2. Build geth

A C compiler is required to build `geth`.

```bash
make geth
```

#### 3. Build the node

```bash
cd ~/.morph/morph/node
make build
```

### Config Preparation

#### 1. Download config files and create the data directory

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

#### 2. Create the shared JWT secret

```bash
cd ~/.morph
openssl rand -hex 32 > jwt-secret.txt
```

### Start the Node

Mainnet and Hoodi MPT nodes are best started from an MPT snapshot.

#### Sync from Snapshot (Recommended)

First build the binaries and prepare the config files as shown above. Then download an MPT snapshot.

**Download the MPT snapshot**

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

**Set up the snapshot data**

:::warning
If `~/.morph/geth-data` or `~/.morph/node-data` already contains old zkTrie data, do **not** reuse it directly for an MPT node. Use a new clean directory, or back up the old data first and restore the MPT snapshot into a clean location.
:::

Move the snapshot data into the prepared data directories:

```bash
mkdir -p ~/.morph/node-data/data
mv mpt-snapshot-20260312-1/geth ~/.morph/geth-data
mv mpt-snapshot-20260312-1/data/* ~/.morph/node-data/data
```

**Start the execution client**

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

**Start the consensus client**

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

**Check sync status**

```bash
curl http://localhost:26657/status
```

When `catching_up` becomes `false`, the node has finished catching up.

#### Sync from Genesis Block

You can also start an MPT node from genesis without downloading a snapshot.

In that case:

- Prepare a fresh MPT data directory
- Start `geth` with `--morph-mpt`
- Start the consensus client after `geth` is running

:::tip
This method is much slower than restoring from an MPT snapshot and is **not recommended** for most operators.
:::
