---
title: Run a full node from source
lang: en-US
---

This guide outlines the steps to start a Morph node. The example assumes the home directory is `~/.morph`

:::warning Jade Fork — binary update required
After the **Jade Fork**, you must update your binaries to **morph-v2.2.1** or later to sync past the fork height. Existing zkTrie nodes that update their binaries can continue to process new blocks without changing their storage format.

If you are setting up a **new node**, see [Run a Full MPT Node](./3-run-mpt-node.md) — MPT is recommended for all new deployments. If you want to migrate an existing zkTrie node to MPT, see the [Jade Fork Overview](../upgrade-node/0-jade-fork-overview.md).
:::

## Hardware requirements

Running the Morph node requires 2 processes: `geth` and `node`.  

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
    --http --http.api=web3,debug,eth,txpool,net,engine,morph \
    --authrpc.addr localhost \
    --authrpc.vhosts="localhost" \
    --authrpc.port 8551 \
    --authrpc.jwtsecret=./jwt-secret.txt \
    --log.filename=./geth.log

```

:::note
For Hoodi testnet, use `--morph-hoodi` instead of `--morph`.
:::

tail -f `geth.log` to check if the Geth is running properly, or you can also execute the curl command below to check if you are connected to peers.

```bash
curl -X POST -H 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":74}' \
  localhost:8545

{"jsonrpc":"2.0","id":74,"result":"0x6"}
```

#### Start consensus client
```bash
./morph/node/build/bin/morphnode --home ./node-data \
    --l2.jwt-secret ./jwt-secret.txt \
    --l2.eth http://localhost:8545 \
    --l2.engine http://localhost:8551 \
    --log.filename ./node.log
```

tail -f `node.log` to check if the node is running properly.

#### Check sync status

```bash
curl http://localhost:26657/status
```

The returned `"catching_up"` indicates whether the node is still syncing. When `catching_up` becomes `false`, the node has finished catching up.

The returned `"latest_block_height"` indicates the latest block height this node has synced.



### Sync from genesis block
Start the execution client and consensus client directly without downloading snapshot.
