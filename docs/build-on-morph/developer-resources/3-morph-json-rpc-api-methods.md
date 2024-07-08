---
title: Morph JSON-RPC API Methods
lang: en-US
---

Most methods are similar to Ethereum's, for those methods, we recommend you visit [Ethereum JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/#json-rpc-methods). 

This page lists some unique methods exclusive to Morph.


## morph_getBlockByNumber

Returns information about a block by block number. In addition, it returns more fields than the standard eth_getBlockByNumber returns, such as **withdrawTrieRoot**,**batchHash**,**nextL1MsgIndex**,**rowConsumption**

### Parameters

1. QUANTITY|TAG - integer of a block number, or the string "earliest", "latest", "pending", "safe" or "finalized", as in the default block parameter.
2. Boolean - If true it returns the full transaction objects, if false only the hashes of the transactions.

### Returns

See [JSON-RPC API | ethereum.org](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbyhash), and more fields showing as the blew

- withdrawTrieRoot: DATA, 32 Bytes - the root of the withdraw trie, used to prove the users’  withdrawals 
- batchHash: DATA, 32 Bytes - the hash of the latest batch. It indicates the block is a batch point if it is not empty.
- nextL1MsgIndex: quantity - the next expected L1 message nonce after this block
- rowConsumption: the rows consumption of this block, which the rows are used to generate the ZK Proof based on halo2 schema. 

### Example

```js
// request
curl -X POST --data '{"jsonrpc":"2.0","method":"morph_getBlockByNumber","params":["0x1b4", true],"id":1}'

// Result
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "batchHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "difficulty": "0x0",
        "extraData": "0x",
        "gasLimit": "0x989680",
        "gasUsed": "0x0",
        "hash": "0xbc979055d001fe70ed637edd20e918bc583c84c35372f4cdf04253ec34b99178",
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "miner": "0x0000000000000000000000000000000000000000",
        "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "nextL1MsgIndex": "0x0",
        "nonce": "0x0000000000000000",
        "number": "0x1b4",
        "parentHash": "0xff26c60bca2d08d9b0d17431a4c9d80d007dace61fb551bdf7c376d16bc77441",
        "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
        "rowConsumption": [
            {
                "name": "evm",
                "row_number": 2
            },
            {
                "name": "state",
                "row_number": 4
            },
            {
                "name": "bytecode",
                "row_number": 0
            },
            {
                "name": "copy",
                "row_number": 4
            },
            {
                "name": "keccak",
                "row_number": 1591
            },
            {
                "name": "tx",
                "row_number": 0
            },
            {
                "name": "rlp",
                "row_number": 0
            },
            {
                "name": "exp",
                "row_number": 150
            },
            {
                "name": "mod_exp",
                "row_number": 0
            },
            {
                "name": "pi",
                "row_number": 0
            },
            {
                "name": "poseidon",
                "row_number": 1222
            },
            {
                "name": "sig",
                "row_number": 0
            },
            {
                "name": "ecc",
                "row_number": 0
            },
            {
                "name": "mpt",
                "row_number": 101
            }
        ],
        "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
        "size": "0x1fe",
        "stateRoot": "0x1492cc1cebd586279388370e1184960e289d180eb867aa076fbad54aeb0a855b",
        "timestamp": "0x6619043f",
        "totalDifficulty": "0x0",
        "transactions": [],
        "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
        "uncles": [],
        "withdrawTrieRoot": "0x27ae5ba08d7291c96c8cbddcc148bf48a6d68c7974b94356f53754ef6171d757"
    }
}
```


## morph_getBlockByHash

Returns information about a block by hash.

### Parameters

- DATA, 32 Bytes - Hash of a block.
- Boolean - If true it returns the full transaction objects, if false only the hashes of the transactions.

### Returns

See [morph_getBlockByNumber returns](#morph_getblockbynumber)


## morph_estimateL1DataFee

Generates and returns an estimate of how much L1DataFee does the transaction cost.

### Parameters

1. Object - TransactionArgs
	- from: DATA, 20 Bytes - (optional) The address the transaction is sent from.
- to: DATA, 20 Bytes - The address the transaction is directed to.
- gas: QUANTITY - (optional) Integer of the gas provided for the transaction execution. eth_call consumes zero gas, but this parameter may be needed by some executions.
- gasPrice: QUANTITY - (optional) Integer of the gasPrice used for each paid gas
- value: QUANTITY - (optional) Integer of the value sent with this transaction
- input: DATA - (optional) Hash of the method signature and encoded parameters.

2. QUANTITY|TAG - integer block number, or the string "latest", "earliest", "pending", "safe" or "finalized".

### Returns
QUANTITY - integer of the current l1 data fee in wei.

### Example

```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"morph_estimateL1DataFee","params":[{see above}],"id":1}'

// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x3f4e2160f00"
}
```

## morph_getNumSkippedTransactions

Get the number of the skipped transactions

### Parameters

None

### Returns

Quantity - integer of the number of the skipped transactions

### Example
```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"morph_getNumSkippedTransactions","params":[],"id":1}'

// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0"
}
```

## morph_getSkippedTransactionHashes


Get a list of skipped transaction hashes between the two indices provided (inclusive)

### Parameters

1. from index
2. to index


### Returns

Arrays of transaction hashes

### Example
```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"morph_getSkippedTransactionHashes","params":[0, 1],"id":1}'

// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": [“0x….”,”0x….”]
}

```

## morph_getSkippedTransaction


Get a skipped transaction by its hash.

### Parameters

DATA, 32 Bytes - Hash of a transaction.


### Returns

Object - a transaction object(see JSON-RPC API | ethereum.org), an some extended fields:
- sender: DATA, 20 Bytes - address of the sender
- queueIndex: QUANTITY -  integer of the L1Message index
- skipReason: string - the skip reason of this transaction
- skipBlockNumber: quantity - integer of the block number where the transaction is skipped
- skipBlockHash: DATA, 32 Bytes - hash of the block where the transaction is skipped


### Example
```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"morph_getSkippedTransaction","params":[“0x…”],"id":1}'

// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": {
    "from": "0x59b79a4fc3e0e1646b254fb6804d8f5fa8fae7e0",
    "gas": "0x33450",
    "gasPrice": "0x0",
    "hash": "0x74e13cc35fbeffc9747dd3a5a191b2d62939ee1d1c24651adb89b470f9cf0a36",
    "input": "0x8ef1332e00000000000000000000000082c74cd310438d4938799af4c2a29587284a2ca700000000000000000000000053000000000000000000000000000000000000060000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a4232e8748000000000000000000000000f1d598fd5f8367be41b0761696e643ac092b313e000000000000000000000000f1d598fd5f8367be41b0761696e643ac092b313e0000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "nonce": "0x0",
    "to": "0x5300000000000000000000000000000000000007",
    "transactionIndex": "0x0",
    "value": "0x0",
    "type": "0x7e",
    "v": "0x0",
    "r": "0x0",
    "s": "0x0",
    "sender": "0x59b79a4fc3e0e1646b254fb6804d8f5fa8fae7e0",
    "queueIndex": "0x0",
    “skipReason”: “row consumption overflow”,    "skippedBlockHash":"0x61411498b0c241895d44c1bf9a9448ae8584bf434246d680980e8a5edf9ce27c",
    "skippedBlockNumber": "0x382e",
    “”
}
}
```

## morph_getSkippedTransactionHashes


get the batches by index

### Parameters

Quantity - integer of the index of batch

### Returns

Object - RollupBatch
1. Version: quantity - the version of the batch
2. Hash: DATA: 32 bytes - the batch of this batch
3. parentBatchHeader: bytes - the parent batch header
4. Chunks: arrays of chunk - Chunk: bytes : the chunk bytes of this batch
5. skippedL1MessageBitmap: bytes - the bitmap of the skipped L1Message
6. prevStateRoot: DATA: 32 bytes - the state root at the beginning of this batch
7. postStateRoot: DATA: 32 bytes - the state root at the end of this batch
8. withdrawRoot: DATA : 32 bytes - the withdraw root at the end of this batch
9. sidecar - the side car for the rollup transaction of the blob type
10. signatures - array of object of signature:

- version: quantity -  the version of sequencers
- signer: quantity - the index of the registered sequencer on L1Sequencer
- signerPubKey: bytes - the bls public key
- signature: the bls signature of the batch signed by this signer

### Example
```js
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"morph_getRollupBatchByIndex","params":[1],"id":1}'

//Result
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "version": 0,
        "hash": "0x559c75fb09451ef19968b6c17c2ed3b3f431ab496d29d0a611970bf3e377ed4f",
        "parentBatchHeader": "0x000000000000000000000000000000000000000000000000008b1cfd86e7ac16004ef7aae3e693402764e10471efc9a67c3051a44b2d5a5ad2010657f37554c781402a22917dee2f75def7ab966d7b770905398eba3c4440140000000000000000000000000000000000000000000000000000000000000000",
        "chunks": [
            "0x010000000000000001000000006623829f0000000000000000000000000000000000000000000000000000000000000000000000000098968000000000"
        ],
        "skippedL1MessageBitmap": "0x",
        "prevStateRoot": "0x232ce5fc696e7033ec630174d4c78aa157cc13ffba01aba5154bb900ae2b61b3",
        "postStateRoot": "0x232ce5fc696e7033ec630174d4c78aa157cc13ffba01aba5154bb900ae2b61b3",
        "withdrawRoot": "0x27ae5ba08d7291c96c8cbddcc148bf48a6d68c7974b94356f53754ef6171d757",
        "sidecar": {
            "Blobs": [
                [...]
            ],
            "Commitments": [
                [...]
            ],
            "Proofs": [
                [...]
            ]
        },
        "signatures": [
            {
                "version": 0,
                "signer": 0,
                "signerPubKey": "0x00000000000000000000000000000000095ad465c2895ee825c7d4f1b60a18734db57d4108369e47c6e3a94ee15846f825c06dad5d98f503bd31ece1d9f94b11000000000000000000000000000000000c5d6ba04bc9b9674dd2acbfc5caed3976c1b8be2ec90a03d78dffe924648b4fba82225aff43c744310c6a60185b75ac000000000000000000000000000000000fce6be001c871a11b9db1c6c15f0a6999de5646941a74486206dc784f0b3ffe11799212f3f44ef754b4a0f1ecf85639000000000000000000000000000000000b2f06634e5ea719682c30911c94dfb560f0b7656b5c34a871ea035e3fe7b041885420f8fe1e251f1cce5cdb7514869e",
                "signature": "0x079ff817623be61e3dc48ad755020d3eb37e47697e97394df3707248e5e923d8cb92cc2c788e2e19eb21d878224e3e2a023170f091b979dbdc5ac47e95a1e3e6edf5a91279b3c89e871927370abeefd43430b561b640d91f0f474db8e871f05f"
            },
            {
                "version": 0,
                "signer": 1,
                "signerPubKey": "0x0000000000000000000000000000000010173aeac4ff317e8e60493f962b91dbd27614e1f6594e17d18a02968bd1fd698b6703092ab8622cd22d6948d9421156000000000000000000000000000000000801aea15697ab4d7a808be45377e4f0d2f54857fdc04031e476402ff16c66a6cbcc5f09a84bf85400c8afbabed006600000000000000000000000000000000015fc71b2c4e81148274e6169c9c9aace8c34fa6030547650242b6c32527dd23a996416e32640bce4f495a0afabc7dbb900000000000000000000000000000000088c4a0dffccc96bce47aef0e176b129457a5f3ae1651b132ddb418e9f7b5850a38c6fec1be6d169eb88dc1619648bf4",
                "signature": "0x05784fcf2c9b50b2503282a464106ce6bad4d29798869d2d24dae047eba48662ef66b54f193a4a0aad511cee57b8fc960b44e478cfc0c021a92dba44495ffa9237f4cf4f9865bb8fb95cee9bb32f2b283940bce6d8f4fdfe89bec0c186ecc429"
            },
            {
                "version": 0,
                "signer": 2,
                "signerPubKey": "0x0000000000000000000000000000000003fd9468a8ceffc1b696874517777ef8bfdc9a1bade95c480ee2624903e648c1caf01c65de5b4fda8876a3a0e8d9f0890000000000000000000000000000000004c02f3609a0f61d12fe737dcbb047d5253bd3ff905b55c0e0f932b476fd77d172a58b72ef0f506407870988dd6038220000000000000000000000000000000017fa5765899f60f7a58f8ccdaaa295cde55992231710672692ba6a71a4faa9572f728f438ded65576a570d57e19fd304000000000000000000000000000000001226138813bde98af3464ed03649d8c731bc4e5cb3d26b53bf7483f4105d18bbb3f19e23905119e156e7d003d2fd125c",
                "signature": "0x17d127f711bbfd578f3a9d6c897f6eb4c109f2b12ec16c7976c2146325b718ac06713ecfd168b1abd60d5c4d84b8c75105019a522a96f9d28974dafab640e146abc29322e5550bdb606bcf768c1d7de468fa42e09f2c806bfbedcffd6cfa652c"
            },
            {
                "version": 0,
                "signer": 3,
                "signerPubKey": "0x00000000000000000000000000000000109bf02a2636c0dc1968b0a50db77251eb090c3e9f51e2a2bc60c4ac72213f41f01f0a34e92c2e0625bd62e28e27edb500000000000000000000000000000000139969bd92522113c0615659874d1fae311ad8152d0584c7b57ffc14927067486dcf86413c5684fccc1163ee2d45c1c1000000000000000000000000000000000f172603f70a0730d100ad6d28bde477195987062e8ade83b82d093935d956ff20ca768c26263577b094f1cb756adc400000000000000000000000000000000010dde3acca00b4ff1b4976500a8f97e92246f43f78cadc95c4993dfc4f4c501c33d42a4bf52587f4931287b59623149c",
                "signature": "0x053a7119c0fa920e94c8a1f32441537509f654a673af02179a01ff2c7ac6dee24b22c2f93da4b4a37bb08e2115ef097e00038d0cabdeec2ae1838aa30cb62bff8e528ac200eff0d69fbe8848646972dbb09f4cf3a06c62be0c5e314f25bdbd68"
            }
        ]
    }
}

```

## morph_GetBlockTraceByNumberOrHash

It replays the block and returns the structured blockTrace for rollers

## Parameters

1. QUANTITY|TAG - integer of a block number, or the string "earliest", "latest", "pending", "safe" or "finalized", as in the default block parameter. Or DATA, 32 Bytes - Hash of a block.
2. tracerConfig(optional), see debug Namespace | go-ethereum

## Example

```js
// Request
{"jsonrpc":"2.0","method":"morph_getBlockTraceByNumberOrHash","params":["latest"],"id":67}

// Result
{
    "jsonrpc": "2.0",
    "id": 67,
    "result": {
        "chainID": 53077,
        "version": "5.2.0-mainnet",
        "coinbase": {
            "address": "0xfabb0ac9d68b0b445fb7357272ff202c5651694a",
            "nonce": 0,
            "balance": "0x2000000000000000000000000000000000000000000000000006b49161ba10",
            "keccakCodeHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
            "poseidonCodeHash": "0x2098f5fb9e239eab3ceac3f27b81e481dc3124d55ffed523a839ee8446b64864",
            "codeSize": 0
        },
        "header": {
            "parentHash": "0xa2b3ee7a3718baeb1b460bc9a479838532c184129d0238b342e1bc9430e15961",
            "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
            "miner": "0x0000000000000000000000000000000000000000",
            "stateRoot": "0x1492cc1cebd586279388370e1184960e289d180eb867aa076fbad54aeb0a855b",
            "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
            "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
            "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "difficulty": "0x0",
            "number": "0x31",
            "gasLimit": "0x989680",
            "gasUsed": "0x0",
            "timestamp": "0x6618fa6a",
            "extraData": "0x",
            "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "nonce": "0x0000000000000000",
            "nextL1MsgIndex": "0x0",
            "batchHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "baseFeePerGas": null,
            "withdrawalsRoot": null,
            "blobGasUsed": null,
            "excessBlobGas": null,
            "parentBeaconBlockRoot": null,
            "hash": "0x65645773fa2056771753878cdf5a1280dff36756096e8f9c1cf51fe66690a448"
        },
        "transactions": [],
        "storageTrace": {
            "rootBefore": "0x1492cc1cebd586279388370e1184960e289d180eb867aa076fbad54aeb0a855b",
            "rootAfter": "0x1492cc1cebd586279388370e1184960e289d180eb867aa076fbad54aeb0a855b",
            "proofs": {
                "0x5300000000000000000000000000000000000001": [
                    "0x09261068d5568cdf6020d6b6703b831fbc4c5928019dcc23606eceaa4cb4befd3a22bd9a05e5f4619cebb743688e2bb2510352fa7b64cee7d6c947e1c8655b3e88",
                    "0x0912cea39ac19eee30407d6760f267dcaa3456c6ab30a2d7285e1ae726debdc3a228bc075d0a3a84f79e301293ac8c4188d5e58e3a30a49ca058d77784ec477d6c",
                    "0x092a1073697a898cbfc740c3c327cc3bcc1517b23dd5a44ea7f7e5975a55a615790e69dfcd0c8346b28ff2dffa8db5d0c5b7ed8291eab83be0292051c2dd9a55bc",
                    "0x0927f8c131313ff2ce0d551273c407fd6e94e5d9f644eab09c4c20b13e00fb5a4b1e00b9701c7f2ac25be7e3fe8ad00ce18f642d07188ff1aacc6d7a1fc44987b5",
                    "0x090296736b61c7a9c43b7260c2f652d1bc941b882c0a1e71a9b8d86657cc0b9d8e1b6b72e48fe7cfc89ae526ae345245d7f6871db82148a8a0c1c9cf992e177ba2",
                    "0x090a6feef711af23824583c2bcd54147c2991287ca1fbad2cbb0e9ac2f42dc0c2d1b510d4e26002d7f33e82092a7c28f26ac6cf3f2349eb23e4374ad31f3e289d0",
                    "0x091a8fc20731feea420de908b0d66e7c53398f53ce5d76054cf3d0e4747ba1896222d288ea2a9d771a19771658abf5a64fd503f4ed277aa8d6f779137a88ea1c8d",
                    "0x091628b91a861616a64807781ae6aaa549dae9555ef1454a85df052398404f44690f386bb59d106d7a27ff2df1de738c3fae5cf8307f84e07ac6957e3c42fa3f5e",
                    "0x09220b163279be211a426832f5ff47e0ecadb5bd5eaaf0d62189998fde4e14e62913696e7ffd560b4bf7df760cbfdc330a8c5e7cf15b4e2f60fb9146fd28fe2db7",
                    "0x08150feb81fe1639286c75adb93e5467d36ad52d9ff00e0c706bc5345f6dcd49500000000000000000000000000000000000000000000000000000000000000000",
                    "0x081cb430cbc5dd11f62a713fb3656184085386104dc53fc135fb3c56dba49670500000000000000000000000000000000000000000000000000000000000000000",
                    "0x060c320ff8f6c3907ae6df62a7fe70e2be093390bd246197d5f56b6bce56f513f812fac8f51e3812914c097147217411381b9b2dad76963ef63c261885d3a49223",
                    "0x0427cfcbd2fe87474008e199ef5bff09273803bbf38032c75a36a7726b3c88f8a205080000000000000000000000000000000000000000000000000aec000000000000000000000000000000000000000000000000000000000000000000000000000000002198e2c16011cd18ef5be82557ea4552a16cc88ed8026d68fc38a18776550fa944107d7c70e67e04d35d77455d5755c94d4897196e4ea9a341c1a6d864a6d4d518d32c9790b7656cb1991e831f76e6d65151cbd1c05aef8cfa7d369ad2076f8400",
                    "0x5448495320495320534f4d45204d4147494320425954455320464f5220534d54206d3172525867503278704449"
                ],
                "0x530000000000000000000000000000000000000f": [
                    "0x09261068d5568cdf6020d6b6703b831fbc4c5928019dcc23606eceaa4cb4befd3a22bd9a05e5f4619cebb743688e2bb2510352fa7b64cee7d6c947e1c8655b3e88",
                    "0x0912cea39ac19eee30407d6760f267dcaa3456c6ab30a2d7285e1ae726debdc3a228bc075d0a3a84f79e301293ac8c4188d5e58e3a30a49ca058d77784ec477d6c",
                    "0x0910b680ab891bca41519a50437acf0fd6001d3843132362201baeecfefe64861d004b217e8efd3e9ff7f15214f53868836cd5341e524a6862cf599a2c91e066e4",
                    "0x092bc917a3803350b7b4b99e33f5612886fe67ae2346b7b8a80c4f33ea2b2143c5157889ebd8bd189e158f8e315bf0e81eeaade2de06d9514962a676c2b5c43fe6",
                    "0x0923373510953f88897d7fcfd22182f41afbc558d2f862f437a31d1919ce2e34c925c888335ad923fc91289b73b7cb65de69d93146389a6af856490d8578203517",
                    "0x092ea32b06c112526e73d5c4828866500f096d35e79c13d7c1f7aa42afce901bd618bb82398f0bc28770139185439bf42dea1f543e8a0a266399ba43a3dd60f463",
                    "0x09199e7116f18fc4121b627c11b0ca83bbb70b204098c01db84cd2c27ec3416bd4002ea098b20a57201744454a787c20550c1ffa4145ab218c28906ba3df5ea6cb",
                    "0x0923bfab6f7b9cc20bae8ca8989ad45df9625cf0c14ee54257ffd31b2593b8385f0861f83d52b30f3b4ea0dbf9aa1b95e8864f2b2032249d6fa43ba22be66e5e82",
                    "0x0609fd578e322ce608e81c29d820eca5e2d610bf211aa40fbfdfc7bd1327c9c6432a868ae99ff40d43cff3f28ff0655bf467eaa89e3d3a1493203e4abb26099b3b",
                    "0x0418a86f98026d1a55f6fee616f04d51be16c033651ffaafb0514287ec067d04e805080000000000000000000000000000000000000000000000000aec00000000000000000000000000000000000000000000000000000000000000000000000000000000025f5484cf6758b2d9e10b66230e7ed93fd790931c579d1583b40a25c29b3cc944107d7c70e67e04d35d77455d5755c94d4897196e4ea9a341c1a6d864a6d4d518d32c9790b7656cb1991e831f76e6d65151cbd1c05aef8cfa7d369ad2076f8420530000000000000000000000000000000000000f000000000000000000000000",
                    "0x5448495320495320534f4d45204d4147494320425954455320464f5220534d54206d3172525867503278704449"
                ],
                "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a": [
                    "0x09261068d5568cdf6020d6b6703b831fbc4c5928019dcc23606eceaa4cb4befd3a22bd9a05e5f4619cebb743688e2bb2510352fa7b64cee7d6c947e1c8655b3e88",
                    "0x09132e097dde889d85b8b3309a827f0496c58979f869fe9827851d59f3af8d3bad1db74244979778c4e7c6b56496b5a3f1ee84cd42acacbc6ae3842deb5332b101",
                    "0x0919474ec6b34f96f735c336cc161ed84fdd3a683fa201b518af5c2c1626f02f4612a08d77db2b9b67c38d89ed19f9ca59dadbd1699d27829f985020f6f3432959",
                    "0x090dc9f8dd06d98c5a78af9836fc75823e4e2b0c95085c36dc33b8c35f5fc224d319e43044e7ac03d516f20d38f68682109407871d5f07f080c59857789fad1e46",
                    "0x0907bc083c80445c99e7239f960beabcf360f7a6999ade44323b8401e0ec6842b80c789c2f71e21b35f96a71c66a774edac37ba18b809b8122d9000fbf0f8ac74b",
                    "0x091e9ddabce6463c4843a7f43ce562b40bd7cc778a539486f6739bf7daf6f14bdf2da1168d26e898c81e03ba275f3474d4172c1f936d272114b87a486ae25a0c7e",
                    "0x092ebed3e1476b235ef7ee7d5c160d7738aee3a9ecf02754975430203dbe05b7ce1f81e74d1f8a355b7dda2b293a8833c0926df34b6ab6516de484a7c682123e3b",
                    "0x0700000000000000000000000000000000000000000000000000000000000000000bca6f26c452ec72dc90f8ac79855df88d3b88ce77a5c4ac472eea9ef7b619ae",
                    "0x0824eb7acc6f05bd88d0aecfb7e170edc0f99384a54657916103d91fad99bf01030000000000000000000000000000000000000000000000000000000000000000",
                    "0x072449731363c43de43d2516f39791c43a3be1e83edc3432352d81d2d1384a946e159ad10b4c89ff16157cc364c81f6039eeea9a8eb87e4b4700249219e71cc3ef",
                    "0x0403d2c88868dc8b5f7994604147a8246c48cc905235de980c42c3e78f351f00c5050800000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000006b49161ba100000000000000000000000000000000000000000000000000000000000000000c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a4702098f5fb9e239eab3ceac3f27b81e481dc3124d55ffed523a839ee8446b6486420fabb0ac9d68b0b445fb7357272ff202c5651694a000000000000000000000000",
                    "0x5448495320495320534f4d45204d4147494320425954455320464f5220534d54206d3172525867503278704449"
                ]
            },
            "storageProofs": {
                "0x5300000000000000000000000000000000000001": {
                    "0x0000000000000000000000000000000000000000000000000000000000000021": [
                        "0x0825bcd8ed4a7e39c0f0e835761cda36131dd34f16de95765d2216d997923a52f60e38bf5d7d592ab89df92d87f260b8529d9c466b936b42ad8fbfe576bf97b200",
                        "0x06216372aa3165a29ee67494a5a9680358be92c254cc5724949e4d52742ba8d57f02a40b5614637fca2783d673559f035f5f5a0588ee27d164bb5375568493200a",
                        "0x042f683d080c393f5fb2ade2190fd56e8a5e8fa26533acdea8cce25caa236027cc0101000027ae5ba08d7291c96c8cbddcc148bf48a6d68c7974b94356f53754ef6171d75700",
                        "0x5448495320495320534f4d45204d4147494320425954455320464f5220534d54206d3172525867503278704449"
                    ]
                },
                "0x530000000000000000000000000000000000000f": {
                    "0x0000000000000000000000000000000000000000000000000000000000000001": [
                        "0x09224baa919e1495600105d8a4446f80cabd9a915d7556e0b5d2956a3ad01e96862b531affe57e7f49ddcfef93ff839a215de0865c985188f99c61838f366e2bbe",
                        "0x091eb325ae1568060f3957cc990d35e5ef48b7b2bc7979151083abe2d68aabc812162b4d479ff13f2af3f0cfaadc6bccc8622dd980f83c7014e947f50577eedaba",
                        "0x08015c4fc60a3c6160762783cfc0da7e9d0518e56f0f4f236b7666e1afde43c8f60e867960e703abfccf265c16aceb5c2a092c39248e00fa04f717cf3ca38dfe9e",
                        "0x080782addd8b48a93860ab4cb45e80c6cc869c1288f09d52cb7dec1f6aab62deb70000000000000000000000000000000000000000000000000000000000000000",
                        "0x0700000000000000000000000000000000000000000000000000000000000000000f35c10e1893b6065c8ce8ba23fcd841bb168eb35643ca124118a4e44668fab2",
                        "0x080487bd50c628c019d7858418000d1393427df64c9c103a4229f7b6cb3cdf5ae60000000000000000000000000000000000000000000000000000000000000000",
                        "0x0700000000000000000000000000000000000000000000000000000000000000001046b31bcd31548fa80d0a9fb9fae45e61112d689f6b9c82958033c0787f1f94",
                        "0x0805b5be5c8d36bd01ef9c3d10f3d994da611bc1484e9e48f69d2224efeb811b320000000000000000000000000000000000000000000000000000000000000000",
                        "0x081ebc02f6986209f10fc7d04ba0c4ef196d75ad0a22e786fc7cf789f591e9b26f0000000000000000000000000000000000000000000000000000000000000000",
                        "0x0700000000000000000000000000000000000000000000000000000000000000002680dd0a6ed49fc1faf7d4ef23a8328de46b8a4c1d86e6553f4940e394673978",
                        "0x0628658ea3cbfa933d0e4041f9000bcc3393a3536913008ef6e1837ba7053bdec1156a0960a84fa4287f66d18b9c39ab9d403fa6b6dddd126f47758aadcb82e122",
                        "0x0426049ba6de63003492eb078a01a8aa4f4a0e67f28f0955c2eba9101d5d2eea5001010000000000000000000000000000000000000000000000000000000000000000000700",
                        "0x5448495320495320534f4d45204d4147494320425954455320464f5220534d54206d3172525867503278704449"
                    ],
                    "0x0000000000000000000000000000000000000000000000000000000000000002": [
                        "0x09224baa919e1495600105d8a4446f80cabd9a915d7556e0b5d2956a3ad01e96862b531affe57e7f49ddcfef93ff839a215de0865c985188f99c61838f366e2bbe",
                        "0x091eb325ae1568060f3957cc990d35e5ef48b7b2bc7979151083abe2d68aabc812162b4d479ff13f2af3f0cfaadc6bccc8622dd980f83c7014e947f50577eedaba",
                        "0x08015c4fc60a3c6160762783cfc0da7e9d0518e56f0f4f236b7666e1afde43c8f60e867960e703abfccf265c16aceb5c2a092c39248e00fa04f717cf3ca38dfe9e",
                        "0x04020953ad52de135367a1ba2629636216ed5174cce5629d11b5d97fe733f07dcc0101000000000000000000000000000000000000000000000000000000000000000029d7200000000000000000000000000000000000000000000000000000000000000002",
                        "0x5448495320495320534f4d45204d4147494320425954455320464f5220534d54206d3172525867503278704449"
                    ],
                    "0x0000000000000000000000000000000000000000000000000000000000000003": [
                        "0x09224baa919e1495600105d8a4446f80cabd9a915d7556e0b5d2956a3ad01e96862b531affe57e7f49ddcfef93ff839a215de0865c985188f99c61838f366e2bbe",
                        "0x07000000000000000000000000000000000000000000000000000000000000000014a36870c64d2edad5a210b41e5bdfd73e7f4201161a755c434a621ffe103cc8",
                        "0x061c3181dc54d9c120fdc034e9c12d47d19f07bdeb049e492e0e7c5c9d7fe19a4d0e38bf5d7d592ab89df92d87f260b8529d9c466b936b42ad8fbfe576bf97b200",
                        "0x0406c50541f08911ad149aa545dd3d606f86ee63c751a795c7d57f0d3f85e6bdeb01010000000000000000000000000000000000000000000000000000000000174876e800200000000000000000000000000000000000000000000000000000000000000003",
                        "0x5448495320495320534f4d45204d4147494320425954455320464f5220534d54206d3172525867503278704449"
                    ]
                }
            }
        },
        "executionResults": [],
        "withdraw_trie_root": "0x27ae5ba08d7291c96c8cbddcc148bf48a6d68c7974b94356f53754ef6171d757",
        "startL1QueueIndex": 0
    }
}
```