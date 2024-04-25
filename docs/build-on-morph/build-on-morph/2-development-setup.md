---
title: Devlopement Setup
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimstic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimstic zk-rollup solution. Try it now!
---

# Start Developing on Morph

Developing on Morph is as easy as developing on Ethereum — literally!

To deploy contracts onto a MorphL2 chain, simply set the RPC endpoint of your target MorphL2 chain and deploy using your preferred Ethereum development framework :


- [Hardhat](https://hardhat.org/)
- [Foundry](https://github.com/foundry-rs/foundry)
- [Brownie](https://eth-brownie.readthedocs.io/en/stable/)
- [Alchemy](https://docs.alchemy.com/reference/alchemy-sdk-quickstart)
- [QuickNode SDK](https://www.quicknode.com/docs/quicknode-sdk/getting-started?utm_source=morph-docs)

...it all just works!

## Step 1: Network Configuration

Before you start, ensure you are connected to the following networks:

| Network Name | Morph Testnet | Sepolia Testnet |
| --- | --- | --- |
| RPC URL | https://rpc-testnet.morphl2.io | https://eth-sepolia-public.unifra.io/ |
| Chain ID | 2710 | 11155111 |
| Currency Symbol | ETH | ETH |
| Block Explorer URL | https://explorer-testnet.morphl2.io/| https://sepolia.etherscan.io/ |


:::tip

You can use any of the following 3 rpc for connections:

~~~
https://rpc-testnet.morphl2.io

https://rpc1-testnet.morphl2.io

https://rpc2-testnet.morphl2.io
~~~

:::


## Step 2: Set up your developing framework

### Hardhat

Modify your Hardhat config file hardhat.config.ts to point at the Morph public RPC.

```jsx
const config: HardhatUserConfig = {
  ...
  networks: {
    morphTestnet: {
      url: process.env.MORPH_TESTNET_URL || "",
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

To start building on Morph, you may need some testnet ETH. 

You can use the LearnWeb3 faucet to get testnet ETH on the Morph L2 directly:

- **[https://learnweb3.io/faucets/morph_sepolia](https://learnweb3.io/faucets/morph_sepolia)**

Alternatively, you can use a faucet to acquire Sepolia Ether, then bridge the test Ethereum Ether to the Morph testnet.

Each faucet has its own rules and requirements, so you may need to try a few before finding one that works for you.

Here are some Sepolia faucet apps:

- **[https://sepoliafaucet.com](https://sepoliafaucet.com//)**
- **[https://sepolia-faucet.pk910.de](https://sepolia-faucet.pk910.de/)**
- **[https://faucet.quicknode.com/drip](https://faucet.quicknode.com/drip)**
- **[https://faucet.chainstack.com](https://faucet.chainstack.com/)**
- **[https://learnweb3.io/faucets/sepolia](https://learnweb3.io/faucets/sepolia)**

Once you receive ETH on Sepolia, you should see it in your wallet on the *Sepolia Network*. It may take a few seconds for them to appear, but you can check the status by looking for a transaction to your address on a **[Sepolia Block Explorer](https://sepolia.etherscan.io/)**.

You can also ask for a small amount of Morph sepolia ETH directly in discord's #discord-faucet channel by typing /morph_eth 0x12344566.... This will tip you 0.05 Morph Sepolia ETH for development purposes.
