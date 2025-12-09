---
title: Run a validator from source
lang: en-US
---
## Run a Morph Validator 

This guide describes the approach to running a Morph validator node. If you are unfamiliar with the validator duties, please refer to our [optimistic zkEVM](../../../../how-morph-works/3-optimistic-zkevm.md) design.

Create the folder `~/.morph` as our home directory for this example.

## Build executable binary

### Clone Morph

```bash
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

```bash
make geth
```

### Build Node

```bash
cd ~/.morph/morph/node 
make build
```

## Sync from the snapshot

### Config Preparation

1. Download the config files and make data dir

```bash
cd ~/.morph

## mainnet
wget https://raw.githubusercontent.com/morph-l2/run-morph-node/main/mainnet/data.zip

## testnet
wget https://raw.githubusercontent.com/morph-l2/run-morph-node/main/hoodi/data.zip

unzip data.zip
```

2. Create a shared secret with node

```bash
cd ~/.morph
openssl rand -hex 32 > jwt-secret.txt
```

### Download snapshot
Download the latest snapshot corresponding to either the mainnet or testnet network. 

A complete record of historical snapshots is available [here](https://github.com/morph-l2/run-morph-node?tab=readme-ov-file#snapshot-information). Below is an example of how to download a snapshot

```bash
## mainnet
wget -q --show-progress https://snapshot.morph.network/mainnet/${SNAPSHOT_NAME}.tar.gz
tar -xzvf ${SNAPSHOT_NAME}.tar.gz

## hoodi
wget -q --show-progress https://snapshot.morph.network/hoodi/${SNAPSHOT_NAME}.tar.gz
tar -xzvf ${SNAPSHOT_NAME}.tar.gz
```

Extracting snapshot data to the data directory your node points to 

```bash
mv ${SNAPSHOT_NAME}/geth geth-data
mv ${SNAPSHOT_NAME}/data node-data
```

## Script to start the process

### Geth

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

tail -f `geth.log` to check if the Geth is running properly, or you can also execute the below curl command to check if you are connected to the peer.

```bash
curl --location --request POST 'localhost:8545/' \
--header 'Content-Type: application/json' \
--data-raw '{
   "jsonrpc":"2.0",
   "method":"eth_blockNumber",
   "id":1
}'

{"jsonrpc":"2.0","id":1,"result":"0x148e39"}
```

### Node

You need to set the `DERIVATION_START_HEIGHT` and `L1_MSG_START_HEIGHT` variables correctly to match the snapshot version you downloaded. From the [snapshot information](https://github.com/morph-l2/run-morph-node?tab=readme-ov-file#snapshot-information), you can find the corresponding height values.

```bash
cd ~/.morph

## mainnet
export CHAIN_ID=1
export L1MESSAGEQUEUE_CONTRACT=0x3931ade842f5bb8763164bdd81e5361dce6cc1ef
export ROLLUP=0x759894ced0e6af42c26668076ffa84d02e3cef60
export DERIVATION_START_HEIGHT=${The height matches your snapshot}
export L1_MSG_START_HEIGHT=${The height matches your snapshot}

## start node
./morph/node/build/bin/morphnode --validator --home ./node-data \
     --l2.jwt-secret ./jwt-secret.txt \
     --l2.eth http://localhost:8545 \
     --l2.engine http://localhost:8551 \
     --l1.rpc $(Ethereum RPC)  \
     --l1.beaconrpc $(Ethereum beacon chain RPC)  \
     --l1.chain-id ${CHAIN_ID}   \
     --validator.privateKey 0x0000000000000000000000000000000000000000000000000000000000000001  \
     --sync.depositContractAddr ${L1MESSAGEQUEUE_CONTRACT} \
     --sync.startHeight  ${L1_MSG_START_HEIGHT} \
     --derivation.rollupAddress ${ROLLUP} \
     --derivation.startHeight  ${DERIVATION_START_HEIGHT} \
     --derivation.fetchBlockRange 200 \
     --log.filename ./node.log
```

For hoodi network, using
```bash
export CHAIN_ID=17000 
export L1MESSAGEQUEUECONTRACT=0x778d1d9a4d8b6b9ade36d967a9ac19455ec3fd0b
export ROLLUP=0xd8c5c541d56f59d65cf775de928ccf4a47d4985c
export DERIVATION_START_HEIGHT=${The height matches your snapshot}
export L1_MSG_START_HEIGHT=${The height matches your snapshot}
```

:::note
Note the **validator.privateKey** is of no use to you. It is used to send challenges when the state root is found to be incorrect. However, we do not currently accept challenges from third party addresses. But it is also a required parameter for the morphnode command, so we give a ***0x00... 1***.
:::

## Check Status

If your node is successfully started, you will see the following response:

```bash
I[2024-06-06|15:57:35.216] metrics server enabled                       module=derivation host=0.0.0.0 port=26660
derivation node starting
ID> 24-06-06|15:57:35.216] initial sync start                           module=syncer msg="Running initial sync of L1 messages before starting sequencer, this might take a while..."
I[2024-06-06|15:57:35.242] initial sync completed                       module=syncer latestSyncedBlock=1681622
I[2024-06-06|15:57:35.242] derivation start pull rollupData form l1     module=derivation startBlock=1681599 end=1681622
I[2024-06-06|15:57:35.244] fetched rollup tx                            module=derivation txNum=8 latestBatchIndex=59201
I[2024-06-06|15:57:35.315] fetch rollup transaction success             module=derivation txNonce=8764 txHash=0x5fb8a98472d1be73be2bc6be0807b9e0c68b7ba14a648c8a17bdaff7b26eb923 l1BlockNumber=1681599 firstL2BlockNumber=1347115 lastL2BlockNumber=1347129
I[2024-06-06|15:57:35.669] new l2 block success                         module=derivation blockNumber=1347115
```

You can use the following command to check the newest block height to make sure you are aligned.

```bash
curl --location --request POST 'localhost:8545/' \
--header 'Content-Type: application/json' \
--data-raw '{
   "jsonrpc":"2.0",
   "method":"eth_blockNumber",
   "id":1
}'
{"jsonrpc":"2.0","id":1,"result":"0x148e39"}
```

Make sure you check the validator status constantly, if you find response

```bash
[2024-06-14|16:43:50.904] root hash or withdrawal hash is not equal    originStateRootHash=0x13f91d1c272e48e2d864ce7bfb421506d5b2a04def64d45c75391cdcdd69cd78 deriveStateRootHash=0x27e10420c0e34676a7d75c4189d7ccd1c3407cc8fd0b3eafb01c15e250a1215f batchWithdrawalRoot=0xa3e4a7cf45c7591a6bd9868f1fa7485ae345f10067acaade5f5b07d418b2e172 deriveWithdrawalRoot=0xa3e4a7cf45c7591a6bd9868f1fa7485ae345f10067acaade5f5b07d418b2e172
```

This means your validators find inconsistent between sequencer submission and your own observation.
