---
title: Morph Integration One Page
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!
---

### Network Parameters

| Network | Chain ID | RPC URL | Block Explorer URL |
| --- | --- | --- | --- |
| Morph Mainnet | 2818 | [https://rpc-quicknode.morphl2.io](https://rpc-quicknode.morphl2.io) | [https://explorer.morphl2.io/](https://explorer.morphl2.io/) |
| Ethereum Mainnet | 1 | [https://ethereum-rpc.publicnode.com/](https://ethereum-rpc.publicnode.com/) | [https://etherscan.io/](https://etherscan.io/) |
| Morph Holesky Testnet | 2810 | [https://rpc-quicknode-holesky.morphl2.io](https://rpc-quicknode-holesky.morphl2.io) | [https://explorer-holesky.morphl2.io/](https://explorer-holesky.morphl2.io/) |
| Holesky Testnet | 17000 | [https://ethereum-holesky-rpc.publicnode.com/](https://ethereum-holesky-rpc.publicnode.com/) | [https://holesky.etherscan.io/](https://holesky.etherscan.io/) |


To notice, we have set a rate limit for the public RPC access, currently 600 requests per minute per IP.

If you need higher tps, please contact our team for private RPC access. You can also use our partner [quicknode](https://www.quicknode.com/) or [tenderly](https://tenderly.co/) to create your own private RPC.

:::tip Websocket Connection

wss://rpc-quicknode.morphl2.io

:::

### Explorer Information

[Official Mainnet Explorer](https://explorer.morphl2.io)

[Official Testnet Explorer](https://explorer-holesky.morphl2.io)

[Explorer API Documentation](https://explorer.morphl2.io/api-docs)

Explorer API: https://explorer-api.morphl2.io/api

Testnet Explorer API: https://explorer-holesky-api.morphl2.io/api


For detail guide on how to verify your contract on Morph explorer, [click here](../build-on-morph/5-verify-your-smart-contracts.md)

### Bridge Information

[Official Bridge](https://bridge.morphl2.io)

[Official Testnet Bridge](https://bridge-holesky.morphl2.io)

:::tip Withdrawal and Deposit Time

Due to Morph opzkEVM design, each withdrawal request will need to go through a 48 hours withdrawal period (challenge window) to be finalized. 

Deposit needs to wait for 2 Ethereum epoch (about 13~20 min).

:::

#### New Bridge Asset Support:

[Add your Token to the Official Bridge](https://docs.morphl2.io/docs/build-on-morph/build-on-morph/bridge-between-morph-and-ethereum#add-your-token-to-the-official-bridge)


You can also use LayerZero to wrap your token:

[LayerZero on Morph](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts#morph)


### Transaction Fees & Blocks

For Ethereum Layer2, there are 2 part of fees: L1 fee and L2 fee.

For L2 fee, Morph currently using the [EIP-1559](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md) mechanism for transaction fees same as Ethereum mainnet. Each transaction will have a base fee and a priority fee. The base fee is set to 0.001 Gwei. If the block transaction limit (100 per block) is not reached, only pay base fee is enough.

:::tip
Please note we have a lowest L2 priority fee setting (0.01 gwei) for testnet, this is in order to prevent spams. For mainnet, we are able process transaction without priority fee.
:::

Morph currently produce 1 block per second for non-empty block, if there is no new transaction, we will produce 1 empty block every 5 seconds.

Each block can have 100 transactions maximum and we will keep raising the limit.

### Important Contracts

We have documented all the important contracts on Morph, you can find them [here](../developer-resources/1-contracts.md)

### Node Deployment

Right now we support you to run the Morph node (full node and validator node) in docker and run on host.

You can check the [node deployment guide](../developer-resources/node-operation/full-node/1-run-in-docker.md) for more details.


