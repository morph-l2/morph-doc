---
title: Run a full node with docker
lang: en-US
---

This guide will help you start a full node running in the docker container using [run-morph-node](https://github.com/morph-l2/run-morph-node)

## Quick Start

:::note
The instructions outlined below detail the procedure for running a full node on the mainnet. To set up and operate a **Holesky node**, you need to follow the tutorial on [`sync node from snapshot`](#sync-node-from-snapshot).
:::

1. Clone the dockerfile repository

```bash
git clone https://github.com/morph-l2/run-morph-node.git
```
2. Run the following command

```bash
cd morph-node
make run-node
```

The command `make run-node` takes the `../mainnet` as your node's **Home** directory by default. There will be two folders in the **Home** directory named `geth-data` and `node-data`, serving as data directories for the execution client and consensus client of the morph node, respectively.

This command will also generate the `secret-jwt.txt` file under **Home** directory for the authentication during RPC calls between the execution client and consensus client.

## Advanced Usage

With the [Quick Start](#quick-start) guide above, you can quickly start a node using the default configuration files. However, we also support customizing the node's data directory and parameter settings.

### Customizing Data Directory
The host directory paths that are mounted by the Docker container are specified in the ```morph-node/.env``` file.

```js title="morph-node/.env"
// HOME folder for morph node
MORPH_HOME=../mainnet
// Flag indicates the network for execution client.
MORPH_FLAG=morph
// Location of the jwt file for the authentication between clients
JWT_SECRET_FILE=${MORPH_HOME}/jwt-secret.txt
// The entrypoint shell script for start execution client  
GETH_ENTRYPOINT_FILE=./entrypoint-geth.sh
// The snapshot name for Morph node 
MAINNET_SNAPSHOT_NAME=snapshot-20241218-1

......
```

You have the flexibility to customize the directory paths as per your requirements. 

Please note that if you have customized the **HOME** directory of your node, you need to copy the necessary configuration files to this directory. Specifically, you should copy the `node-data` and `geth-data` from `./mainnet` to your **HOME** directory.

:::note
For running a testnet node, the ```morph-node/.env_holesky``` file should be used instead of the ```morph-node/.env``` file.
:::

### Customizing parameters

The default configuration required for mainnet node startup is located in the `./mainnet` directory, while the files under `./holesky` directory is used for testnet node startup. 

```javascript
└── mainnet
    ├── geth-data
    │   └── static-nodes.json
    └── node-data
        ├── config
        │   ├── config.toml
        │   └── genesis.json
        └── data

// for testnet nodes
└── holesky
    ├── geth-data
    │   └── static-nodes.json
    └── node-data
        ├── config
        │   ├── config.toml
        │   └── genesis.json
        └── data
```

If you wish to modify the Geth startup command, you can do so by editing the ```./morph-node/entrypoint-geth.sh``` file. For adjustments to the Tendermint-related configuration parameters, you should modify the `node-data/config/config.toml` file.

## Sync node from snapshot

We suggest starting your node sync from a snapshot to speed up the process of syncing your node to the latest state. 

### Clone the dockerfile repository

```bash
git clone https://github.com/morph-l2/run-morph-node.git
```

### Acquire the snapshot you need

The `morph-node/.env` configuration file in the repository you just cloned is designed for setting up the Morph node on the mainnet. By default, it is pre-configured to use the latest snapshot.

If you need a historical snapshot, you must manually update the **SNAPSHOT_NAME** in the `morph-node/.env` file. (Note: For the **testnet**, the corresponding file is `morph-node/.env_holesky`.)

- **Fetch historical snapshot(Optional)**:
    
    The historical snapshots are recorded in [snapshot-information](https://github.com/morph-l2/run-morph-node?tab=readme-ov-file#snapshot-information)

    ```js
    // ...

    MAINNET_SNAPSHOT_NAME={your expected snapshot name} 

    // ...
    ```

- **Execute download and decompress the snapshot for your network**:
    
    Run the following command to download and decompress the snapshot for your network:

    **For mainnet**:

    ```
    cd ./morph-node
    make download-and-decompress-mainnet-snapshot
    ```

    **For testnet**:

    ```
    cd ./morph-node
    make download-and-decompress-holesky-snapshot
    ```

    The command will assist you in downloading and decompressing the snapshot archive.

### Set up the snapshot data

After downloading, locate the snapshot by placing the decompressed data files in the correct directory specified by the **MORPH_HOME** path in your `.env` file. Ensure the data files align with the node's expected structure to allow seamless synchronization.

For example, if the snapshot folder is named ```snapshot-20241218-1```, 
- move the directory ```snapshot-20241218-1/geth``` to the ```${MORPH_HOME}/geth-data``` directory 
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

### 4. Run the Node
With the snapshot and configuration files ready, navigate to the `morph-node` folder under your cloned repository, and start the node using the provided command

```
make run-node
```

For testnet, run

```
make run-holesky-node
```