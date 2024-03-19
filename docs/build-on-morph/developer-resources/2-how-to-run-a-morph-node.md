---
title: How to Run a Morph Node
lang: en-US
---

## Run a Morph Node 

This guide describes the approach to starting up a morph node. We create the folder `~/.morph` as our home directory for the following example. 
### Hardware requirements

Running the morph node requires 2 processes to be started, which are `geth` and `node`.  

`Geth` is the Morph execution layer which needs to meet the [go-ethereum hardware requirements](https://github.com/ethereum/go-ethereum#hardware-requirements), but with less storage, 500GB is enough so far. 

`Node` is the Morph consensus layer embedded tendermint which needs to meet the [tendermint hardware requirements](https://docs.tendermint.com/v0.34/tendermint-core/running-in-production.html#processor-and-memory). 

According to limitations of the current geth implementation, we only support archive mode for launching a Geth.  So the storage size of Geth will constantly increase along with blocks produced. 

### Build executable binary

#### Build Geth
1. Clone [go-ethereum](https://github.com/morph-l2/go-ethereum)

```

mkdir -p ~/.morph 
cd ~/.morph
git clone https://github.com/morph-l2/go-ethereum.git

```
   Currently, we use tag  `v0.2.1-beta` as our beta version geth. 
```   
cd go-ethereum
git checkout v0.2.1-beta
```
2. Build geth

```
make nccc_geth
```

#### Build Node
1. Clone [node](https://github.com/morph-l2/node)

```
cd ~/.morph
git clone https://github.com/morph-l2/node.git
```

2. Build node

```
cd node
git checkout v0.2.1-beta
make build
```

### Sync from genesis block
#### Config Preparation

1. Download the config files and make data dir

```
cd ~/.morph
wget https://raw.githubusercontent.com/morph-l2/config-template/main/sepolia-beta/data.zip
unzip data.zip
```
  `geth-data` and `node-data` will be produced under the `~/.morph` like the below

```
├── geth-data
│   ├── genesis.json
│   └── static-nodes.json
└── node-data
    ├── config
    │   ├── config.toml
    │   └── genesis.json
    └── data
```
2. Create a shared secret with `node`
```
cd ~/.morph
openssl rand -hex 32 > jwt-secret.txt
```
3. Write geth genesis state locally
```
cd ~/.morph
./go-ethereum/build/bin/geth --verbosity=3 init --datadir=~/.morph/geth-data ~/.morph/geth-data/genesis.json
```
#### Script to start the process
##### Geth
This is the script for alpha testnet.  Execute the shell script to start the geth process
```
#! /usr/bin/bash
cd ~/.morph

NETWORK_ID=2710

nohup ./go-ethereum/build/bin/geth \
  --datadir=./geth-data \
  --verbosity=3 \
  --http \
  --http.corsdomain="*" \
  --http.vhosts="*" \
  --http.addr=0.0.0.0 \
  --http.port=8545 \
  --http.api=web3,debug,eth,txpool,net,morph,engine \
  --networkid=$NETWORK_ID \
  --authrpc.addr="0.0.0.0" \
  --authrpc.port="8551" \
  --authrpc.vhosts="*" \
  --authrpc.jwtsecret=./jwt-secret.txt \
  --miner.gasprice="100000000" \
  --gcmode=archive > geth.log 2>&1 &
```
`tail -f geth.log` to check if the Geth is running properly, or you can also exeucte the below `curl` command to check if you are connected to the peer. 

```
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":74}' localhost:8545
{"jsonrpc":"2.0","id":74,"result":"0x6"}
```
##### Node
This is the script to start the node process

```
#! /usr/bin/bash
cd ~/.morph

NODE_DATA_DIR="./node-data"
export MORPH_NODE_L2_ENGINE_AUTH="./jwt-secret.txt"
export MORPH_NODE_L2_ETH_RPC="http://127.0.0.1:8545"
export MORPH_NODE_L2_ENGINE_RPC="http://127.0.0.1:8551"

nohup ./node/build/bin/morphnode --home $NODE_DATA_DIR > node.log 2>&1 &
```

`tail -f node.log` to check if the node is running properly, the expected logs show like the following:

```
I[2023-08-23|18:33:39.599] received complete proposal block             module=consensus height=32 hash=E760BC6642D0BAC98FED9E4AE35544CD701E0C134E51F2A4CF088DA1E156638D
I[2023-08-23|18:33:39.600] finalizing commit of block                   module=consensus height=32 hash=E760BC6642D0BAC98FED9E4AE35544CD701E0C134E51F2A4CF088DA1E156638D root= num_txs=0
I[2023-08-23|18:33:39.606] DeliverBlock request                         module=executor txslength=0 l2Configlength=420 zkConfiglength=58 validatorlength=7 blsSignatureslength=7
I[2023-08-23|18:33:39.606] executed block                               module=state height=32 num_valid_txs=0 num_invalid_txs=0
I[2023-08-23|18:33:39.610] committed state                              module=state height=32 num_txs=0 app_hash=
I[2023-08-23|18:33:39.614] indexed block                                module=txindex height=32
```
And you can also execute the command curl to check your node connection status.

`curl http://localhost:26657/net_info`

```
{
  "jsonrpc": "2.0",
  "id": -1,
  "result": {
    "listening": true,
    "listeners": [
      "Listener(@)"
    ],
    "n_peers": "6",
    "peers": [
      {
        "node_info": {
          "protocol_version": {
            "p2p": "8",
            "block": "11",
            "app": "0"
          },
          "id": "9247d5aac854b009b29c80f177f782c6736f0b03",
          "listen_addr": "tcp://0.0.0.0:26656",
          "network": "chain-morph",
          "version": "0.37.0-alpha.1",
          "channels": "4020212223386061",
          "moniker": "eu-sentry1",
          "other": {
            "tx_index": "on",
            "rpc_address": "tcp://0.0.0.0:26657"
          }
        },
    ......      

```

### Check sync status

:::tip

If you want to limit the block range of getLogs api, update the geth launch parameter:

--rpc.getlogs.maxrange

Right now all of our nodes are archive nodes. If the disk storage becomes way too big for you, you can relieve the storage pressure by halting and pruning the state.

We use the same way with geth. You can check how to do it here:

https://geth.ethereum.org/docs/fundamentals/pruning

:::

```
curl http://localhost:26657/status to check the sync status of the node
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
      "id": "a2a6ff1fac52f5f899c89f9fc3958e133b325f06",
      "listen_addr": "tcp://0.0.0.0:26656",
      "network": "chain-morph",
      "version": "0.37.0-alpha.1",
      "channels": "4020212223386061",
      "moniker": "my-morph-node",
      "other": {
        "tx_index": "on",
        "rpc_address": "tcp://0.0.0.0:26657"
      }
    },
    "sync_info": {
      "latest_block_hash": "ACE931319E480088EC6578B004B28B25F04E3E02B72FD0EABCFD8AED4146511B",
      "latest_app_hash": "",
      "latest_block_height": "13229",
      "latest_block_time": "2024-01-23T20:11:14.042157891Z",
      "earliest_block_hash": "DACE0A9492B121C810650B673A4818BBA31AF2C2D019DC07DEC643D184752B5A",
      "earliest_app_hash": "",
      "earliest_block_height": "1",
      "earliest_block_time": "2024-01-23T02:00:00Z",
      "catching_up": true
    },
    "validator_info": {
      "address": "F2C1FDF9409AA9A2FCAF2D7804C88834EC8B08E2",
      "pub_key": {
        "type": "tendermint/PubKeyEd25519",
        "value": "WJWaHG7hh7+CGPyS1YeOEAZ0Rj4+0ujfr0GjOOGey14="
      },
      "voting_power": "0"
    }
  }
}
```
The returned "catching_up" indicates  whether the node is in sync or not. *True* means it is in sync. 

Meanwhile, the returned  latest_block_height indicates the latest block height this node synced.