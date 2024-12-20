---
title: Run a validator with docker
lang: en-US
---

This guide will help you start a validator node running in the docker container using [run-morph-node](https://github.com/morph-l2/run-morph-node)

### Quick Start

**1. Clone the dockerfile repository**

```bash
git clone https://github.com/morph-l2/run-morph-node.git
```

**2. Update `morph-node/.env`**

The `morph-node/.env` file defines the environment variables required for deploying a validator node. Below is an example configuration:

```js title="morph-node/.env"
// General settings
MORPH_HOME=../mainnet
MORPH_FLAG=morph
JWT_SECRET_FILE=${MORPH_HOME}/jwt-secret.txt
GETH_ENTRYPOINT_FILE=./entrypoint-geth.sh
HOLESKY_SNAPSHOT_NAME=snapshot-20241218-1

// Environment variables for validator node
L1_CHAIN_ID=1
L1_ETH_RPC=${your_layer1_execution_client_rpc_url}
L1_BEACON_CHAIN_RPC=${your_layer1_beacon_client_rpc_url}
L1MESSAGEQUEUE_CONTRACT=0x3931ade842f5bb8763164bdd81e5361dce6cc1ef
ROLLUP_CONTRACY=0x759894ced0e6af42c26668076ffa84d02e3cef60
START_HEIGHT=20996776
```

***`Default Directory:`***
For running a validator on the mainnet, the `MORPH_HOME` directory defaults to `../mainnet`. You can customize this path to suit your setup.

***`Layer1 RPC URLs:`***
Ensure you provide the correct RPC URLs for the Layer 1 execution client (L1_ETH_RPC) and the beacon chain client (L1_BEACON_CHAIN_RPC). These URLs are essential for the validator to fetch rollup batches and maintain synchronization.

:::info
The .env file above is only used for running a validator node on the mainnet. To set up and operate a Holesky validator node, please refer to [Run a Holesky Validator Node](#run-a-holesky-validator-node).
:::

**3. Run the following command**

```bash
cd morph-node
make run-validator
```

### Sync from snapshot

We recommend synchronizing blocks using snapshot data to reduce the time required for block synchronization. For detailed instructions on downloading and setting up snapshot data, please refer to [**Sync node from snapshot**](../full-node/1-run-in-docker.md#sync-node-from-snapshot).

:::note
At the moment, we only provide a snapshot for the Holesky network. A snapshot for the mainnet will be available soon.
:::

### Run a Holesky Validator Node
The Holesky node only allows you to sync the blocks from a snapshot. To set up and run a Holesky node using a snapshot, you need to follow these steps:

#### 1. Download the Snapshot
To sync the node, you must first download the snapshot data. Locate the snapshot download instructions in [**Sync node from snapshot**](../full-node/1-run-in-docker.md#sync-node-from-snapshot).

#### 2. Modify Environment Variables
Before running the node, update the environment variables in the ```morph-node/.env``` file:

```js title="morph-node/.env"
// General settings
MORPH_HOME=../holesky
MORPH_FLAG=morph-holesky
JWT_SECRET_FILE=${MORPH_HOME}/jwt-secret.txt
GETH_ENTRYPOINT_FILE=./entrypoint-geth.sh
HOLESKY_SNAPSHOT_NAME=snapshot-20241218-1

// Environment variables for validator node
L1_CHAIN_ID=17000
L1_ETH_RPC=${your_layer1_execution_client_rpc_url}
L1_BEACON_CHAIN_RPC=${your_layer1_beacon_client_rpc_url}
L1MESSAGEQUEUE_CONTRACT=0x778d1d9a4d8b6b9ade36d967a9ac19455ec3fd0b
ROLLUP_CONTRACY=0xd8c5c541d56f59d65cf775de928ccf4a47d4985c
START_HEIGHT=1434640
```

#### 3. Run the Validator
With the snapshot and configuration files ready, navigate to the morph-node folder under your cloned repository, and start the node using the provided command

```
make run-validator
```


