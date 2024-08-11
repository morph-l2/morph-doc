---
title: How to Run a Morph Validator Node
lang: en-US
---
## Run a Morph Node 

This guide describes the approach to running a Morph validator node. If you are unfamiliar with the validator duties, please refer to our [optimistic zkEVM](../../../how-morph-works/3-optimistic-zkevm.md) design.

Create the folder `~/.morph` as our home directory for this example.

## Build executable binary

### Clone Morph

```bash
mkdir -p ~/.morph 
cd ~/.morph
git clone https://github.com/morph-l2/morph.git
```
Currently, we use tag v0.2.0-beta as our beta version geth.

```bash
cd morph
git checkout v0.2.0-beta
```
### Build Geth

Notice: You need C compiler to build geth

```bash
make nccc_geth
```

### Build Node

```bash
cd ~/.morph/morph/node 
make build
```

## Sync from the genesis block
### Config Preparation

  1. Download the config files and make data dir

```bash
cd ~/.morph
wget https://raw.githubusercontent.com/morph-l2/config-template/main/holesky/data.zip
unzip data.zip
```

2. Create a shared secret with node

```bash
cd ~/.morph
openssl rand -hex 32 > jwt-secret.txt
```


## Script to start the process

### Geth

```bash

NETWORK_ID=2810

nohup ./morph/go-ethereum/build/bin/geth \
--datadir=./geth-data \
--verbosity=3 \
--http \
--http.corsdomain="*" \
--http.vhosts="*" \
--http.addr=0.0.0.0 \
--http.port=8545 \
--http.api=web3,eth,txpool,net,engine \
--ws \
--ws.addr=0.0.0.0 \
--ws.port=8546 \
--ws.origins="*" \
--ws.api=web3,eth,txpool,net,engine \
--networkid=$NETWORK_ID \
--authrpc.addr="0.0.0.0" \
--authrpc.port="8551" \
--authrpc.vhosts="*" \
--authrpc.jwtsecret=$JWT_SECRET_PATH \
--gcmode=archive \
--metrics \
--metrics.addr=0.0.0.0 \
--metrics.port=6060 \
--miner.gasprice="100000000"
```

tail -f geth.log to check if the Geth is running properly, or you can also execute the below curl command to check if you are connected to the peer.

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

```bash
cd ~/.morph
export L1MessageQueueWithGasPriceOracle=0x778d1d9a4d8b6b9ade36d967a9ac19455ec3fd0b
export START_HEIGHT=1434640
export Rollup=0xd8c5c541d56f59d65cf775de928ccf4a47d4985c
./morph/node/build/bin/morphnode --validator --home ./node-data \
     --l2.jwt-secret ./jwt-secret.txt \
     --l2.eth http://localhost:8545 \
     --l2.engine http://localhost:8551 \
     --l1.rpc $(Ethereum Holesky RPC)  \
     --l1.beaconrpc $(Ethereum Holesky beacon chain RPC)  \
     --l1.chain-id  17000   \
     --validator.privateKey $(Your Validator Key)  \
     --sync.depositContractAddr $(L1MessageQueueWithGasPriceOracle) \
     --sync.startHeight  $(START_HEIGHT) \
     --derivation.rollupAddress $(Rollup) \
     --derivation.startHeight  $(START_HEIGHT) \
     --derivation.fetchBlockRange 200 \
     --log.filename ./node.log
```
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