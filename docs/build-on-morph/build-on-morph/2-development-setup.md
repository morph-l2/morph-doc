---
title: Development Setup
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost-efficient, and high-performing optimistic zk-rollup solution. Try it now!
---

# Start Developing on Morph

Developing on Morph is as straightforward as developing on Ethereum. 

To deploy contracts onto a MorphL2 chain, simply set the RPC endpoint of your target MorphL2 chain and deploy using your preferred Ethereum development framework:


- [Hardhat](https://hardhat.org)
- [Foundry](https://github.com/foundry-rs/foundry)
- [Brownie](https://eth-brownie.readthedocs.io/en/stable)
- [Alchemy](https://docs.alchemy.com/reference/alchemy-sdk-quickstart)
- [QuickNode SDK](https://www.quicknode.com/docs/quicknode-sdk/getting-started?utm_source=morph-docs)

...it all just works!

# Mainnet:

## Step 1: Network Configuration

Before you start, ensure you are connected to the following networks:

| Network Name | Morph Mainnet | Ethereum Mainnet |
| --- | --- | --- |
| RPC URL | https://rpc-quicknode.morphl2.io| https://ethereum-rpc.publicnode.com |
| Chain ID | 2818 | 1 |
| Currency Symbol | ETH | ETH |
| Block Explorer URL | https://explorer.morphl2.io| https://etherscan.io |

:::tip Websocket Connection

wss://rpc-quicknode.morphl2.io

:::

<!--
### Tendermint Consensus Information

Tendermint RPC: https://rpc-consensus-holesky.morphl2.io

Tendermint RPC Documentation: https://docs.tendermint.com/v0.34/rpc/#/
-->


## Step 2: Set up your development framework

### Hardhat

Modify your Hardhat config file hardhat.config.ts to point at the Morph public RPC.

```jsx
const config: HardhatUserConfig = {
  ...
  networks: {
    morphl2: {
      url: 'https://rpc-quicknode.morphl2.io',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasprice = 1000000000
    },
  },
};

```

### Foundry

To deploy using Morph Public RPC, run:

```jsx
forge create ... --rpc-url= --legacy
```



### ethers.js

Setting up a Morph  provider in an ethers script:

```jsx
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc-quicknode.morphl2.io'
);
```



# Hoodi Testnet:

## Step 1: Network Configuration

Before you start, ensure you are connected to the following networks:

| Network Name | Morph Hoodi Testnet | Hoodi Testnet |
| --- | --- | --- |
| RPC URL | https://rpc-hoodi.morphl2.io| https://ethereum-hoodi-rpc.publicnode.com |
| Chain ID | 2910 | 560048 |
| Currency Symbol | ETH | ETH |
| Block Explorer URL | https://explorer-hoodi.morphl2.io| https://hoodi.etherscan.io |

:::tip Websocket Connection

wss://rpc-hoodi.morphl2.io

:::

<!--
### Tendermint Consensus Information

Tendermint RPC: https://rpc-consensus-holesky.morphl2.io

Tendermint RPC Documentation: https://docs.tendermint.com/v0.34/rpc/#/
-->
## Step 2: Set up your development framework

### Hardhat

Modify your Hardhat config file hardhat.config.ts to point at the Morph public RPC.

```jsx
const config: HardhatUserConfig = {
  ...
  networks: {
    morphl2: {
      url: 'https://rpc-hoodi.morphl2.io',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasprice = 2000000000
    },
  },
};

```

### Foundry

To deploy using Morph Public RPC, run:

```jsx
forge create ... --rpc-url= --legacy
```



### ethers.js

Setting up a Morph  provider in an ethers script:

```jsx
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc-hoodi.morphl2.io'
);
```

## Step 3: Acquire Ether

To start building on Morph, you may need some testnet ETH. Use a faucet to acquire Hoodi Ether, then [bridge](https://bridge-hoodi.morphl2.io) the test Ethereum Ether to the Morph testnet.

Each faucet has its own rules and requirements, so you may need to try a few before finding one that works for you.

Hoodi ETH faucet websites:

https://stakely.io/faucet/ethereum-hoodi-testnet-eth

https://faucet.quicknode.com/ethereum/hoodi

https://hoodi-faucet.pk910.de

https://cloud.google.com/application/web3/faucet/ethereum (needs a Google account)

<!-- We have our own [website faucet](https://morphfaucet.com) that can claim ETH & USDT for your initial usage.


Morph also offers a [Discord faucet](../../quick-start/3-faucet.md#morph-holesky-eth) to obtain Morph Hoodi USDT & Morph Hoodi ETH. ->

Once you receive ETH on Hoodi, you should see it in your wallet on the *Hoodi Network*. It may take a few seconds for them to appear, but you can check the status by looking for a transaction to your address on a **[Hoodi Block Explorer](https://hoodi.etherscan.io)**.



