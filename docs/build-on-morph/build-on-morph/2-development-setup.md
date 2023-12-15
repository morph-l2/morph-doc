---
title: Devlopement Setup
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimstic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimstic zk-rollup solution. Try it now!
---

:::info

Morph is currently under rapid development, stay tuned for what's coming next

:::

<!-- For examples of deploying with hardhat see [practice examples](../exmaples/1-bridge-erc20.md). -->

<!--
# Start Developing on Morph

Developing on Morph is as easy as developing on Ethereum — literally!

To deploy contracts onto an morph chain, simply set the RPC endpoint of your target morph chain and deploy using your favorite Ethereum development framework;

- [Truffle](https://trufflesuite.com/)
- [Hardhat](https://hardhat.org/)
- [Foundry](https://github.com/foundry-rs/foundry)
- [Brownie](https://eth-brownie.readthedocs.io/en/stable/)
- [Alchemy](https://docs.alchemy.com/reference/alchemy-sdk-quickstart)

...it all just works!



For info on new / different behavior between morph and Ethereum, see [differences with Ethereum](./1-difference-between-morph-and-ethereum.md).

## Step 1: Network Configuration

Before you doing anything, make sure you are connected to the following Morph Testnet.

| Name                      | RPC Url(s)                            | Chain ID | Block explorer             | Underlying L1 |
| ------------------------- | ------------------------------------- | -------- | -------------------------- | ------------- |
| Morph Testnet             | https://rpc.testnet.morphl2.io        | 2710    | https://explorer.testnet.morphl2.io      | Ethereum      |


## Step 2: Set up your developing framework



### Hardhat

Modify your Hardhat config file hardhat.config.ts to point at the Morph public RPC.
```
...

const config: HardhatUserConfig = {
  ...
  networks: {
    morph: {
      url: "" || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

...
```

### Foundry

To deploy using Morph Public RPC, run:
```
forge create ... --rpc-url= --legacy
```


### Truffle
Assuming you already have a truffle environment setup, go to the Truffle configuration file, truffle.js. Make sure to have installed HDWalletProvider: npm install @truffle/hdwallet-provider@1.4.0
const HDWalletProvider = require("@truffle/hdwallet-provider")

```
...
module.exports = {
  networks: {
    morph: {
      provider: () =>
        new HDWalletProvider(process.env.PRIVATE_KEY, ""),
      network_id: '*',
    },
  }
}

```

### Brownie

To add the Morph, run the following command:
```
brownie networks add Ethereum morph host= chainid=534353
```

To set this as your default network, add the following in your project config file:
```
networks:
    default: morph    
```

Another way to add the Morph is to create a yaml file and run a command to add it.

This is an example of a yaml file called network-config.yaml
```
live:
- name: Ethereum
 networks:
 - chainid: 534353
   explorer: https://
   host: https://
   id: morph
   name: Morph
```
To add Morph to the network list, run the following command:
```
brownie networks import ./network-config.yaml
```

To deploy on Morph, run the following command. In this example, token.py is the script to deploy the smart contract. Replace this with the name of your script:
```
brownie run token.py --network morph
```

### ethers.js

Setting up a Morph  provider in an ethers script:
import { ethers } from 'ethers';

```
const provider = new ethers.providers.JsonRpcProvider(
  'https://
);
```
## Step 3: Acquire Ether

To start building on Morph, you may need to acquire some testnet ETH. 

Use [faucet](../../quick-start/faucet) to acquire Sepolia Ether. 

And then you can bridge the test Ethereum Ether to Morph testnet.

-->