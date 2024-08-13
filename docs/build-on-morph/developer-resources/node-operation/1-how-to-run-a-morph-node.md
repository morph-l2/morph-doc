---
title: Run a Morph Full Node from Source
lang: en-US
---

This guide outlines the steps to start a Morph node. The example assumes the home directory is `~/.morph` 

## Hardware requirements

Running the morph node requires 2 processes: `geth` and `node`.  

- `Geth`:the Morph execution layer which needs to meet the [go-ethereum hardware requirements](https://github.com/ethereum/go-ethereum#hardware-requirements), but with less storage, 500GB is enough so far. 

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

Currently, we use tag v0.2.0-beta as our beta version.

```
cd morph
git checkout v0.2.0-beta
```

### Build Geth

Notice: You need C compiler to build geth

```
make nccc_geth
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
wget https://raw.githubusercontent.com/morph-l2/config-template/main/holesky/data.zip
unzip data.zip
```

2. Create a shared secret with node

```
cd ~/.morph
openssl rand -hex 32 > jwt-secret.txt
```

## Sync from snapshot(Recommended)

You should build the binary and prepare the config files in the above steps first, then download the snapshot. 

### Download snapshot

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

### Start execution client

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

tail -f geth.log to check if the Geth is running properly, or you can also execute the curl command below to check if you are connected to the peer. 

```Shell
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":74}' localhost:8545

{"jsonrpc":"2.0","id":74,"result":"0x3"}
```

### Start consensus client
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

### Check sync status

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

## Sync from genesis block(Not Recommended)
Start the execution client and consensus client directly without downloading snapshot