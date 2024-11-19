---
title: Run a full node with docker
lang: en-US
---

This guide will help you start a full node running in the docker container using [run-morph-node](https://github.com/morph-l2/run-morph-node)

## Quick Start

1. Clone the dockerfile repository

```bash
git clone https://github.com/morph-l2/run-morph-node.git
```
2. Run the following command

```bash
cd morph-node
make run-node
```

The command `make run-node` takes the `../mainnet` as your node's **Home** directory by default. There will be two folders in the **Home** directory named `geth-data` and `node-data`, serving as data directories for the execution client and consensus client of the morph ndoe, respectively.

This command will also generate the `secret-jwt.txt` file under **Home** directory for the authentication during RPC calls between the execution client and consensus client.

:::note
The instructions outlined above detail the procedure for running a full node on the mainnet. To set up and operate a Holesky node, please refer to [Run a Holesky Node](#run-a-holesky-node).
:::

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
SNAPSHOT_NAME=snapshot-20241029-1

......
```

You have the flexibility to customize the directory paths as per your requirements. 

Please note that if you have customized the **HOME** directory of your node, you need to copy the necessary configuration files to this directory. Specifically, you should copy the `node-data` and `geth-data` from `./mainnet` to your **HOME** directory.

### Customizing parameters

The default configuration required for mainnet node startup is located in the `./mainnet` directory, while the files under `./holesky` directory is used for holesky node startup. 

```javascript
└── mainnet
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

:::note
At the moment, we only provide a snapshot for the Holesky network. A snapshot for the mainnet will be available soon.
:::

### Way to acquire the latest snapshot

```
cd ./morph-node
make download-and-decompress-holesky-snapshot
```

The **make download-and-decompress-snapshot** command will assist you in downloading and decompressing the snapshot archive.

### Set up the snapshot data
Then, you need to manually place the decompressed data files in the appropriate node data directories.
For example, if the snapshot folder is named ```snapshot-20241029-1```, move the directory ```snapshot-20241029-1/geth``` to the ```${MORPH_HOME}/geth-data``` directory and the contents from ```snapshot-20241029-1/data``` to the ```${NODE_DATA_DIR}/data``` directory.

```
mv ./morph-node/snapshot-20241029-1/geth ${MORPH_HOME}/geth-data
mv ./morph-node/snapshot-20241029-1/data/* ${MORPH_HOME}/node-data/data
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

## Run a Holesky Node

The Holesky node only allows you to sync the blocks from a snapshot. To set up and run a Holesky node using a snapshot, you need to follow these steps:

### 1. Download the Snapshot
To sync the node, you must first download the snapshot data. Locate the snapshot download instructions in [here](#sync-node-from-snapshot)

### 2. Modify Environment Variables
Before running the node, update the environment variables in the ```morph-node/.env``` file:

```js title="morph-node/.env"
// HOME folder for morph node
MORPH_HOME=../holesky
// Flag indicates the network for execution client.
MORPH_FLAG=morph-holesky

// ...
```

- ```MORPH_HOME```: Specifies the directory where the node’s data will be stored.

- ```MORPH_FLAG```: Determines the network flag, in this case, morph-holesky.

### 3. Use a Custom Directory (Optional)
If you prefer to use a custom directory:

1. Copy the configuration files from ```../holesky``` to your new directory.
2. Copy the snapshot data into the specified directory to ensure your node has the necessary data to sync. For detailed instructions, please refer to [Set up the snapshot data](#set-up-the-snapshot-data)


### 4. Run the Node
With the snapshot and configuration files ready, navigate to the `morph-node` folder under your cloned repository, and start the node using the provided command

```
make run-node
```