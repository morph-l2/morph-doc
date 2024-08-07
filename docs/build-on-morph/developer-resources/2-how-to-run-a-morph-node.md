---
title: How to Run a Morph Node
lang: en-US
---
## Run a Morph node with docker 

This guide will help you start a full node running in the docker container. 

### Quick Start

Currently, users need to build the Docker image themselves using the Docker file and Docker Compose file we provide. However, there's no need to worry, as you only need one command to quickly start a full node. This command will handle everything for you, including downloading snapshots, structure data and config files, building the image, and starting the container.

1. Clone the dockerfile repository

```bash
git clone --branch v0.2.0-beta https://github.com/morph-l2/morph.git
```
2. Run the following command

```bash
cd ops/publicnode
make run-holesky-node
```

Running this command will create a .morph-holesky directory in your user directory by default, serving as the node's home directory. Before starting the node, this command will perform several preparations:

- Create the node's home directory and copy the default configuration file into it.
- Prepare the secret-jwt.txt file for signature verification during RPC calls between geth and the node.
- Download the latest snapshot data to speed up node synchronization.
- Place the extracted snapshot data into the corresponding folder within the home directory.

After completing these preparations, the command will automatically build the image and start the container, with Docker volumes mounted to the created node home directory. If this is your first run, these processes may take some time. 

Note that if you are starting the node for the first time but already have a .morph-holesky directory, you must delete that directory before running the command. Otherwise, the preparation phase will be skipped, which may prevent the node from running properly.

If the command fails during execution, you will also need to delete the previously created .morph-holesky directory before restarting.

### Advanced Usage

With the *Quick Start* guide above, you can quickly start a node using the default configuration files. However, we also support customizing the node's home directory and parameter settings.

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


## Run a Morph Full Node from source

This guide outlines the steps to start a Morph node. The example assumes the home directory is `~/.morph` 

### Hardware requirements

Running the morph node requires 2 processes:L`geth` and `node`.  

- `Geth`:the Morph execution layer which needs to meet the [go-ethereum hardware requirements](https://github.com/ethereum/go-ethereum#hardware-requirements), but with less storage, 500GB is enough so far. 

- `Node`:the Morph consensus layer embedded tendermint which needs to meet the [tendermint hardware requirements](https://docs.tendermint.com/v0.34/tendermint-core/running-in-production.html#processor-and-memory). 


:::tip
According to limitations of the current geth implementation, we only support archive mode for launching a Geth.  So the storage size of Geth will constantly increase along with blocks produced. 
:::

### Build executable binary

#### Clone morph

```
mkdir -p ~/.morph 
cd ~/.morph
git clone https://github.com/morph-l2/morph.git
```

Currently, we use tag v0.2.0-beta as our beta version.

```
cd morph
git checkout v0.2.0-beta
```

#### Build Geth

Notice: You need C compiler to build geth

```
make nccc_geth
```

#### Build Node

```
cd ~/.morph/morph/node 
make build
```

### Config Preparation

1. Download the config files and make data dir

```
cd ~/.morph
wget https://raw.githubusercontent.com/morph-l2/config-template/main/holesky/data.zip
unzip data.zip
```

2. Create a shared secret with node

```
cd ~/.morph
openssl rand -hex 32 > jwt-secret.txt
```

### Sync from snapshot(Recommended)

You should build the binary and prepare the config files in the above steps first, then download the snapshot. 

#### Download snapshot

```bash
## download package
wget -q --show-progress https://snapshot.morphl2.io/holesky/snapshot-20240805-1.tar.gz
## uncompress package
tar -xzvf snapshot-20240805-1.tar.gz
```

Extracting snapshot data to the data directory your node points to 

```bash
mv snapshot-20240805-1/geth geth-data
mv snapshot-20240805-1/data node-data
```

#### Start execution client

```bash
./morph/go-ethereum/build/bin/geth --morph-holesky \
    --datadir "./geth-data" \
    --http --http.api=web3,debug,eth,txpool,net,engine \
    --authrpc.addr localhost \
    --authrpc.vhosts="localhost" \
    --authrpc.port 8551 \
    --authrpc.jwtsecret=./jwt-secret.txt \
    --log.filename=./geth.log
```

tail -f geth.log to check if the Geth is running properly, or you can also exeucte the curl command below to check if you are connected to the peer. 

```Shell
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":74}' localhost:8545

{"jsonrpc":"2.0","id":74,"result":"0x3"}
```

#### Start consensus client
```Bash
 ./morph/node/build/bin/morphnode --home ./node-data \
     --l2.jwt-secret ./jwt-secret.txt \
     --l2.eth http://localhost:8545 \
     --l2.engine http://localhost:8551 \
     --log.filename ./node.log 
```

tail -f node.log to check if the node is running properly, and you can also execute the command curl to check your node connection status.

```Bash
curl http://localhost:26657/net_info

{
  "jsonrpc": "2.0",
  "id": -1,
  "result": {
    "listening": true,
    "listeners": [
      "Listener(@)"
    ],
    "n_peers": "3",
    "peers": [
      {
        "node_info": {
          "protocol_version": {
            "p2p": "8",
            "block": "11",
            "app": "0"
          },
          "id": "0fb5ce425197a462a66de015ee5fbbf103835b8a",
          "listen_addr": "tcp://0.0.0.0:26656",
          "network": "chain-morph-holesky",
          "version": "0.37.0-alpha.1",
          "channels": "4020212223386061",
          "moniker": "morph-dataseed-node-1",
          "other": {
            "tx_index": "on",
            "rpc_address": "tcp://0.0.0.0:26657"
          }
        },
        "is_outbound": true,
 ....... 
 ```

#### Check sync status

curl http://localhost:26657/status to check the sync status of the node

```Bash
{
  "jsonrpc": "2.0",
  "id": -1,
  "result": {
    "node_info": {
      "protocol_version": {
        "p2p": "8",
        "block": "11",
        "app": "0"
      },
      "id": "b3f34dc2ce9c4fee5449426992941aee1e09670f",
      "listen_addr": "tcp://0.0.0.0:26656",
      "network": "chain-morph-holesky",
      "version": "0.37.0-alpha.1",
      "channels": "4020212223386061",
      "moniker": "my-morph-node",
      "other": {
        "tx_index": "on",
        "rpc_address": "tcp://0.0.0.0:26657"
      }
    },
    "sync_info": {
      "latest_block_hash": "71024385DDBEB7B554DB11FD2AE097ECBD99B2AF826C11B2A74F7172F2DEE5D2",
      "latest_app_hash": "",
      "latest_block_height": "2992",
      "latest_block_time": "2024-04-25T13:48:27.647889852Z",
      "earliest_block_hash": "C7A73D3907C6CA34B9DFA043FC6D4529A8EAEC8F059E100055653E46E63F6F8E",
      "earliest_app_hash": "",
      "earliest_block_height": "1",
      "earliest_block_time": "2024-04-25T09:06:30Z",
      "catching_up": false
    },
    "validator_info": {
      "address": "5FB3D3734640792F14B70E7A53FBBD39DB9787A8",
      "pub_key": {
        "type": "tendermint/PubKeyEd25519",
        "value": "rzN67ZJWsaLSGGpNj7HOWs8nrL5kr1n+w0OckWUCetw="
      },
      "voting_power": "0"
    }
  }
}
```

The returned "catching_up" indicates  whether the node is in sync or not. *True* means it is in sync. Meanwhile, the returned  latest_block_height indicates the latest block height this node synced.

### Sync from genesis block(Not Recommended)
Start the execution client and consensus client directly without downloading snapshot