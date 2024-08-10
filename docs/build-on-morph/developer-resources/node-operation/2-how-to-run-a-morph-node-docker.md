---
title: How to Run a Morph Full Node with Docker
lang: en-US
---

## Run a Morph node with docker 

This guide will help you start a full node running in the docker container. 

### Quick Start

Currently, users need to build the Docker image themselves using the Docker file and Docker Compose file we provide. However, there's no need to worry, as you only need one command to quickly start a full node. This command will handle everything for you, including downloading snapshots, structure data and config files, building the image, and starting the container.

1. Clone the dockerfile repository

```bash
git clone --branch release/v0.2.x https://github.com/morph-l2/morph.git
```
2. Run the following command

```bash
cd ops/publicnode
make run-holesky-node
```

Running this command will create a .morph-holesky directory in your user directory by default, serving as the node's home directory. Before starting the node, this command will perform several preparations:

- Create the node's home directory and copy the default configuration file into it.
- Prepare the secret-jwt.txt file for for authentication during RPC calls between geth and the node.
- Download the latest snapshot data to speed up node synchronization.
- Place the extracted snapshot data into the corresponding folder within the home directory.

After completing these preparations, the command will automatically build the image and start the container, with Docker volumes mounted to the created node home directory. If this is your first run, these processes may take some time. 

Note that if you are starting the node for the first time but already have a .morph-holesky directory, you must delete that directory before running the command. Otherwise, the preparation phase will be skipped, which may prevent the node from running properly.

If the command fails during execution, you will also need to delete the previously created .morph-holesky directory before restarting.

### Advanced Usage

With the [Quick Start](#quick-start) guide above, you can quickly start a node using the default configuration files. However, we also support customizing the node's home directory and parameter settings.

#### Customizing Data Directory
The host directory paths that are mounted by the Docker container are specified in the ```ops/publicnode/.env``` file.

```javascript
##the home folder of your Morph node
NODE_HOME=${HOME}/.morph-holesky 
## the data directory for your execution client: geth
GETH_DATA_DIR=${NODE_HOME}/geth-data
## the data directory for you consensus client: tendermint
NODE_DATA_DIR=${NODE_HOME}/node-data
## the entrypoint shell script for start execution client
GETH_ENTRYPOINT_FILE=${NODE_HOME}/entrypoint-geth.sh
## the jwt secret file for communicating between execution client and consensus client via engine API
JWT_SECRET_FILE=${NODE_HOME}/jwt-secret.txt
## the snapshot name for holesky Morph node 
SNAPSHOT_NAME=snapshot-20240805-1
```

You have the flexibility to customize the directory paths as per your requirements. 
Please note that if you want make *run-holesky-node* to generate the necessary configuration files and snapshots for running the node, you need to ensure that the specified node home directory is new (not previously created) and do *NOT* alter the paths for ```GETH_DATA_DIR``` and ```NODE_DATA_DIR```.

#### Customizing parameters

The default configuration required for node startup is located in the ```ops/publicnode/holesky ```directory. If your node home directory is empty, the *run* command will automatically copy these configuration files to the directory mounted in the node's docker container.

```javascript
└── holesky
    ├── entrypoint-geth.sh
    ├── geth-data
    │   └── static-nodes.json
    └── node-data
        ├── config
        │   ├── config.toml
        │   └── genesis.json
        └── data
```

If you wish to modify the Geth startup command, you can do so by editing the ```entrypoint-geth.sh``` file. For adjustments to the Tendermint-related configuration parameters, you should modify the node-data/config/config.toml file.
Note that if you have customized your ```GETH_DATA_DIR``` and ```NODE_DATA_DIR```, you will need to manually place the modified configuration files in the appropriate locations.
#### Managing Snapshots Yourself

You may also manually manage snapshot, particularly if you are using custom paths for the node directories. 
The *make download-and-decompress-snapshot* command in the ```ops/publicnode``` directory will assist you in downloading and decompressing the snapshot archive.

Then, you need to manually place the decompressed data files in the appropriate node data directories.
For example, if the snapshot folder is named ```snapshot-20240805-1```, move the contents from ```snapshot-20240805-1/geth``` to the ```${GETH_DATA_DIR}/geth``` directory and the contents from ```snapshot-20240805-1/data``` to the ```${NODE_DATA_DIR}/data``` directory.


## Run a Morph node with docker 