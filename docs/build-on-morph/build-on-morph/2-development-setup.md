---
title: Development Setup
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!
---

# Start Developing on Morph

Developing on Morph is as easy as developing on Ethereum — literally!

To deploy contracts onto a MorphL2 chain, simply set the RPC endpoint of your target MorphL2 chain and deploy using your preferred Ethereum development framework :


- [Hardhat](https://hardhat.org/)
- [Foundry](https://github.com/foundry-rs/foundry)
- [Brownie](https://eth-brownie.readthedocs.io/en/stable/)
- [Alchemy](https://docs.alchemy.com/reference/alchemy-sdk-quickstart)

...it all just works!


# Holesky Testnet:

## Step 1: Network Configuration

Before you start, ensure you are connected to the following networks:

| Network Name | Morph Holesky Testnet | Holesky Testnet |
| --- | --- | --- |
| RPC URL | https://rpc-quicknode-holesky.morphl2.io| https://ethereum-holesky-rpc.publicnode.com/ |
| Chain ID | 2810 | 17000 |
| Currency Symbol | ETH | ETH |
| Block Explorer URL | https://explorer-holesky.morphl2.io/| https://holesky.etherscan.io/ |

:::tip Websocket Connection

wss://rpc-quicknode-holesky.morphl2.io

:::


## Step 2: Set up your developing framework

### Hardhat

Modify your Hardhat config file hardhat.config.ts to point at the Morph public RPC.

```jsx
const config: HardhatUserConfig = {
  ...
  networks: {
    morphl2: {
      url: "" || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
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
  'https://
);
```

## Step 3: Acquire Ether

To start building on Morph, you may need some testnet ETH. Use a faucet to acquire holesky Ether, then [bridge](bridge-holesky.morphl2.io) the test Ethereum Ether to the Morph testnet.

Each faucet has its own rules and requirements, so you may need to try a few before finding one that works for you.

Here are some Holesky ETH faucet websites:

https://stakely.io/en/faucet/ethereum-holesky-testnet-eth

https://faucet.quicknode.com/ethereum/holesky

https://holesky-faucet.pk910.de/


You can also use our own [discord faucet](../../quick-start/3-faucet.md#morph-holesky-eth) to obtain Morph Holesky USDT & Morph Holesky ETH.

Once you receive ETH on holesky, you should see it in your wallet on the *holesky Network*. It may take a few seconds for them to appear, but you can check the status by looking for a transaction to your address on a **[Holesky Block Explorer](https://holesky.etherscan.io/)**.


