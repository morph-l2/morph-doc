---
title: Run a full node with Docker
lang: en-US
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide will help you start a full node running in a Docker container using [run-morph-node](https://github.com/morph-l2/run-morph-node).

New deployments use **MPT** (Merkle Patricia Trie) state storage by default.

### Recommended Versions

| Component | Image |
|-----------|-------|
| geth | `ghcr.io/morph-l2/go-ethereum:2.2.1` |
| node | `ghcr.io/morph-l2/node:0.5.2` |

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/morph-l2/run-morph-node.git
cd run-morph-node/morph-node
```

### 2. Check the geth image version

Make sure the `geth` service in `morph-node/docker-compose.yml` uses the latest recommended image:

```yaml
image: ghcr.io/morph-l2/go-ethereum:2.2.1
```

If your local checkout uses an older tag, update it before starting the node.

### 3. Prepare the MPT environment overrides

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

### 4. Download and decompress the MPT snapshot

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

### 5. Set up the snapshot data

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

### 6. Run the node

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

## Advanced Usage

### Customizing the data directory

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

### Customizing parameters

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

## Verify the Node

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

Examples:

- `https://snapshot.morphl2.io/mainnet/mpt-snapshot-20260312-1.tar.gz`
- `https://snapshot.morphl2.io/hoodi/mpt-snapshot-20260312-1.tar.gz`
