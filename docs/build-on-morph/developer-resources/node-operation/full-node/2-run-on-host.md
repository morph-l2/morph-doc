---
title: Run a full node from source
lang: en-US
---

This guide outlines the steps to start a Morph node. The example assumes the home directory is `~/.morph` 

## Hardware requirements

Running the morph node requires 2 processes: `geth` and `node`.  

- `Geth`:the Morph execution layer which needs to meet the requirements as below
  - Fast CPU with 4+ cores
  - 32GB+ RAM
  - High-performance SSD with at least 1TB of free space
  - 25+ MBit/sec download Internet service


- `Node`:the Morph consensus layer embedded tendermint which needs to meet the [tendermint hardware requirements](https://docs.tendermint.com/v0.34/tendermint-core/running-in-production.html#processor-and-memory). 


:::tip
According to limitations of the current geth implementation, we only support archive mode for launching a Geth.  So the storage size of Geth will constantly increase along with blocks produced. 
:::

## Build executable binary

### Clone morph

```
mkdir -p ~/.morph 
cd ~/.morph
git clone https://github.com/morph-l2/morph.git
```

Next, you need to check out a release version. You can find the available release versions on the [Morph Releases](https://github.com/morph-l2/morph/releases) page. It is recommended to use the latest release version.

```
cd morph
git checkout ${RELEASE_VERSION}
```

### Build Geth

Notice: You need C compiler to build geth

```
make geth
```

### Build Node

```
cd ~/.morph/morph/node 
make build
```

## Config Preparation

1. Download the config files and make data dir

```
cd ~/.morph

## mainnet
wget https://raw.githubusercontent.com/morph-l2/run-morph-node/main/mainnet/data.zip

## testnet
wget https://raw.githubusercontent.com/morph-l2/run-morph-node/main/hoodi/data.zip

unzip data.zip
```

2. Create a shared secret with node

```
cd ~/.morph
openssl rand -hex 32 > jwt-secret.txt
```

## Start Node
Mainnet nodes support synchronization from either the genesis block or a snapshot block, while testnet nodes only support synchronization from snapshots.

### Sync from snapshot(Recommended)
You should build the binary and prepare the config files in the above steps first, then download the snapshot.

#### Download snapshot
Download the latest snapshot corresponding to either the mainnet or testnet network. 

A complete record of historical snapshots is available [here](https://github.com/morph-l2/run-morph-node?tab=readme-ov-file#snapshot-information). Below is an example of how to download a snapshot

```bash
## mainnet
wget -q --show-progress https://snapshot.morphl2.io/mainnet/${SNAPSHOT_NAME}.tar.gz
tar -xzvf ${SNAPSHOT_NAME}.tar.gz

## hoodi
wget -q --show-progress https://snapshot.morphl2.io/hoodi/${SNAPSHOT_NAME}.tar.gz
tar -xzvf ${SNAPSHOT_NAME}.tar.gz
```

Extracting snapshot data to the data directory your node points to 

```bash
mv ${SNAPSHOT_NAME}/geth geth-data
mv ${SNAPSHOT_NAME}/data node-data
```

#### Start execution client

```bash title="Script for starting mainnet geth"
./morph/go-ethereum/build/bin/geth --morph \
    --datadir "./geth-data" \
    --http --http.api=web3,debug,eth,txpool,net,engine \
    --authrpc.addr localhost \
    --authrpc.vhosts="localhost" \
    --authrpc.port 8551 \
    --authrpc.jwtsecret=./jwt-secret.txt \
    --log.filename=./geth.log

```

:::note
For testnet, using ```--morph-hoodi``` instead
:::

tail -f  `geth.log` to check if the Geth is running properly, or you can also execute the curl command below to check if you are connected to the peer. 

```Shell
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":74}' localhost:8545

{"jsonrpc":"2.0","id":74,"result":"0x6"}
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
    "n_peers": "7",
    "peers": [
      {
        "node_info": {
          "protocol_version": {
            "p2p": "8",
            "block": "11",
            "app": "0"
          },
          "id": "b4ac59de479b0251d441ca0385429bc21713a208",
          "listen_addr": "tcp://0.0.0.0:26610",
          "network": "chain-morph-mainnet",
          "version": "0.37.0-alpha.1",
          "channels": "402021222338606100",
          "moniker": "morph-dataseed-node-0",
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
      "id": "cde0d7cecfe9c82244c1dfa72c951759d02f1024",
      "listen_addr": "tcp://0.0.0.0:26656",
      "network": "chain-morph-mainnet",
      "version": "0.37.0-alpha.1",
      "channels": "402021222338606100",
      "moniker": "my-morph-node",
      "other": {
        "tx_index": "on",
        "rpc_address": "tcp://0.0.0.0:26657"
      }
    },
    "sync_info": {
      "latest_block_hash": "B4C0E514CD984B101FA89D7DB48C1FE18384F64C25E5565F618A5FE2851C42A9",
      "latest_app_hash": "",
      "latest_block_height": "2410",
      "latest_block_time": "2024-10-21T08:49:09.952573291Z",
      "earliest_block_hash": "0D66D908033DA7A3F5A95179B8D64261EDD887B944E59502A1C9EFBC1C9C4EF5",
      "earliest_app_hash": "",
      "earliest_block_height": "1",
      "earliest_block_time": "2024-10-21T06:00:00Z",
      "catching_up": false
    },
    "validator_info": {
      "address": "B7395023EFF719D0EE15AD96FFC7F69B6B9E52EF",
      "pub_key": {
        "type": "tendermint/PubKeyEd25519",
        "value": "tZI+wTExwoKeyUFgdSSYmf4sAYp4BhJu13UgPy1wDOc="
      },
      "voting_power": "0"
    }
  }
}
```

The returned `"catching_up"` indicates whether the node is in sync or not. *True* means it is in sync. 

The returned  `"latest_block_height"` indicates the latest block height this node synced.



### Sync from genesis block
Start the execution client and consensus client directly without downloading snapshot.