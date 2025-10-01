---
title: Upgrade node running on the host
lang: en-US
---

Upgrading the node is straightforward. Simply install the new version of the node executable file and replace the previous version. Then, stop the currently running node and restart it with the updated version. Node will automatically use the data of your old node and sync the latest blocks that were mined since you shut down the old software.

Running the node requires two binary files: `morphnode` and `geth`. Choose to upgrade the binary files according to your specific needs.

### Step 1: Compile the new version of the code

You can have the released code version from [Morph release](https://github.com/morph-l2/morph/releases) page.

```js
git clone https://github.com/morph-l2/morph.git

// checkout the latest version of the source code you need
git checkout ${latestVersion}

// install geth
make geth

// install morphnode
cd ./morph/node && make build
```

#### If you only update the Geth version
Check the `Geth` version from [go-ethereum](https://github.com/morph-l2/go-ethereum/releases)

```js
git clone https://github.com/morph-l2/go-ethereum.git

git checkout ${latestVersion}

// install geth
make geth
```

### Step 2: Stop nodes

```bash
# stop morphnode process
pid=`ps -ef | grep morphnode | grep -v grep | awk '{print $2}'`
kill  $pid

# stop geth process
pid=`ps -ef | grep geth | grep -v grep | awk '{print $2}'`
kill  $pid
```

### Step 3: Restart

Make sure to use the same start-up command you used before the upgrade

```bash
## start geth
./morph/go-ethereum/build/bin/geth --morph \
    --datadir "./geth-data" \
    --http --http.api=web3,debug,eth,txpool,net,engine \
    --authrpc.addr localhost \
    --authrpc.vhosts="localhost" \
    --authrpc.port 8551 \
    --authrpc.jwtsecret=./jwt-secret.txt \
    --log.filename=./geth.log

## start node    
./morph/node/build/bin/morphnode --home ./node-data \
     --l2.jwt-secret ./jwt-secret.txt \
     --l2.eth http://localhost:8545 \
     --l2.engine http://localhost:8551 \
     --log.filename ./node.log 
```

:::note
For hoodi network, use ```--morph-hoodi``` instead
:::
