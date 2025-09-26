---
title: Run a validator with docker
lang: en-US
---

This guide will help you start a validator node running in the docker container using [run-morph-node](https://github.com/morph-l2/run-morph-node)

### Quick Start

:::info
The following quick start steps are only applicable for running a validator node on the mainnet. To set up and operate a Hoodi validator node, please refer to [**Sync from Snapshot**](#sync-from-snapshot).
:::

:::note
Starting with the `Quick Start` initiates synchronization from height 0, which can be extremely time-consuming to reach the latest state. We highly recommend using the [**Sync from Snapshot**](#sync-from-snapshot) approach outlined below for a faster and more efficient startup.
:::

**1. Clone the dockerfile repository**

```bash
git clone https://github.com/morph-l2/run-morph-node.git
```

**2. Configure `morph-node/.env`**

The `morph-node/.env` file defines the environment variables required for deploying a validator node. Below is an example configuration:

```js title="morph-node/.env"
// General settings
MORPH_HOME=../mainnet
MORPH_FLAG=morph
JWT_SECRET_FILE=${MORPH_HOME}/jwt-secret.txt
GETH_ENTRYPOINT_FILE=./entrypoint-geth.sh

// Environment variables for validator node
L1_CHAIN_ID=1
L1_ETH_RPC=${your_layer1_execution_client_rpc_url}
L1_BEACON_CHAIN_RPC=${your_layer1_beacon_client_rpc_url}
L1MESSAGEQUEUE_CONTRACT=0x3931ade842f5bb8763164bdd81e5361dce6cc1ef
ROLLUP_CONTRACY=0x759894ced0e6af42c26668076ffa84d02e3cef60
DERIVATION_START_HEIGHT=20996776
L1_MSG_START_HEIGHT=20996776
```

***`Default Directory:`***
For running a validator on the mainnet, the `MORPH_HOME` directory defaults to `../mainnet`. You can customize this path to suit your setup.

***`Layer1 RPC URLs:`***
Ensure you provide the correct RPC URLs for the Layer 1 execution client (L1_ETH_RPC) and the beacon chain client (L1_BEACON_CHAIN_RPC). These URLs are essential for the validator to fetch rollup batches and maintain synchronization.

**3. Run the following command**

```bash
cd morph-node
make run-validator
```

### Sync from snapshot

We recommend synchronizing blocks using snapshot data to reduce the time required for block synchronization. This approach allows you to start the node from a specific block height, significantly reducing the time needed to reach the latest state.

#### 1. Clone the dockerfile repository

```bash
git clone https://github.com/morph-l2/run-morph-node.git
```

#### 2. Download the Snapshot

The `morph-node/.env` configuration file in the repository you just cloned is designed for setting up the Morph node on the mainnet. By default, it is pre-configured to use the latest snapshot.

If you need a historical snapshot, you must manually update the **SNAPSHOT_NAME** in the `morph-node/.env` file. (Note: For the **testnet**, the corresponding file is `morph-node/.env_hoodi`.)

You can find the historical snapshot names from [**Snapshot Information**](https://github.com/morph-l2/run-morph-node?tab=readme-ov-file#snapshot-information).

```js
// ...

MAINNET_SNAPSHOT_NAME={your expected snapshot name} 

// ...
```

Run the following command to download and decompress the snapshot for your network:

For the mainnet:

```bash
make download-and-decompress-mainnet-snapshot
```

For the testnet:
```bash
make download-and-decompress-hoodi-snapshot
```

#### 3. Set up the snapshot

After downloading, locate the snapshot by placing the extracted data files in the correct directory specified by the **MORPH_HOME** path in your `morph-node/.env` file. Ensure the data files align with the node's expected structure to allow seamless synchronization.

For example, if the snapshot folder is named ```snapshot-20241218-1```,

- move the directory ```snapshot-20241218-1/geth``` to the ```${MORPH_HOME}/geth-data``` directory.
- move the contents from ```snapshot-20241218-1/data``` to the ```${NODE_DATA_DIR}/data``` directory.

```
mv ./morph-node/snapshot-20241218-1/geth ${MORPH_HOME}/geth-data
mv ./morph-node/snapshot-20241218-1/data/* ${MORPH_HOME}/node-data/data
```

The folder structure will be like 

```javascript
└── ${MORPH_HOME}
    ├── geth-data // data directory for geth
    │   └── static-nodes.json
    │   └── geth // directory from snapshot/geth   
    └── node-data // data directory for node
        ├── config
        │   ├── config.toml
        │   └── genesis.json
        └── data // data directory from snapshot/node
```

#### 4. Update the Environment Variables
Before running the node, update the `DERIVATION_START_HEIGHT` and `L1_MSG_START_HEIGHT` variables in the ```morph-node/.env``` file (or `.env_hoodi` for the testnet).

Refer to [snapshot-information](https://github.com/morph-l2/run-morph-node?tab=readme-ov-file#snapshot-information) for the specific values of the configuration heights. Ensure that the corresponding height values match the snapshot version you are configuring.

```js
// ...
MAINNET_SNAPSHOT_NAME={your expected snapshot name} 

// ...
DERIVATION_START_HEIGHT={the expected start height match the snapshot}
L1_MSG_START_HEIGHT={the expected start height match the snapshot}

```

#### 5. Run the Validator
With the snapshot and configuration files ready, navigate to the morph-node folder under your cloned repository, and start the node using the provided command

```
cd morph-node
make run-validator

// or for testnet
cd morph-node
make run-hoodi-validator
```
