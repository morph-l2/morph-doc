---
title: Deploy Contracts on Morph
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimstic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimstic zk-rollup solution. Try it now!
---



The Morph Holesky Testnet allows anyone to deploy a smart contract on Morph. In this tutorial, you will learn how to deploy a contract on Morph Holesky using common tools for developing on Ethereum. 

This [demo repo](https://github.com/morph-l2/morph-examples/tree/main/contract-deploy-demo) illustrates contract deployment with [Hardhat](https://hardhat.org/) and [Foundry](https://github.com/foundry-rs/foundry).

:::tip
  Before you start deploying the contract, you need to request test tokens from a Holesky faucet and use the
  [bridge](https://bridge-holesky.morphl2.io) to transfer some test ETH from _Holesky_ to _Morph Sepolia_. 

  Or you can direct obtain Morph Holesky ETH for testing.
  
  See our [Faucet](../../quick-start/3-faucet.md) for details.
:::

<!--

## Deploy contracts with Remix

-->


## Hardhat Contract Deployment Examples

# Morph Contract Deployment Demo

This project demonstrates how to use hardhat to deploy a contract on the Morph Holesky Testnet. This project contains a simple contract that will lock a certain amount of Ether in the deployed contract for a specified amount of time.

## Prerequisites

- Network setup: https://docs.morphl2.io/docs/build-on-morph/build-on-morph/development-setup

## Deploy with Hardhat

### Install Dependencies

If you haven't already, install [nodejs](https://nodejs.org/en/download/) and [yarn](https://classic.yarnpkg.com/lang/en/docs/install).

```bash
cd contract-deployment-demos/hardhat-demo
yarn install
```
This will install everything you need include hardhat for you.


### Compile

Compile your contract

```bash
yarn compile
```

### Test

This will run the test script in test/Lock.ts

```bash
yarn test
```

### Deploy

 Create a `.env` file following the example `.env.example` in the root directory. Change `PRIVATE_KEY` to your own account private key in the `.env`.

 And Change the network settings in the hardhat.config.ts file with the following information:

   ```javascript
    morphTestnet: {
      url: process.env.MORPH_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    }
   ```
Then run the following command to deploy the contract on the Morph Holesky Testnet. This will run the deployment script that set the initialing parameters, you can edit the script in scripts/deploy.ts

```bash
yarn deploy:morphTestnet
```

### Verify your contracts on Morph Explorer

To verify your contract through hardhat, you need to add the following Etherscan and Sourcify configs to your hardhat.config.js file:

```javascript
module.exports = {
  networks: {
    morphTestnet: { ... }
  },
  etherscan: {
    apiKey: {
      morphTestnet: 'anything',
    },
    customChains: [
      {
        network: 'morphTestnet',
        chainId: 2810,
        urls: {
          apiURL: 'https://explorer-api-holesky.morphl2.io/api? ',
          browserURL: 'https://explorer-holesky.morphl2.io/',
        },
      },
    ],
  },
};
```
Then run the hardhat verify command to finish the verification

```bash
npx hardhat verify --network morphTestnet DEPLOYED_CONTRACT_ADDRESS <ConstructorParameter>
```

For example

```bash
npx hardhat verify --network morphTestnet 0x8025985e35f1bAFfd661717f66fC5a434417448E '0.00001'
```


Once succeed, you can check your contract and the deployment transaction on [Morph Holesky Explorer](https://explorer-holesky.morphl2.io)
   

## Support

Thank you for participating in and developing on the Morph Holesky Testnet! If you encounter any issues, join our [Discord](https://discord.com/invite/5SmG4yhzVZ) and find us at #dev-help channel.


## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Example Walkthrough

### Install Foundry
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Then go the right folder of our example:

```bash
cd contract-deployment-demos/foundry-demo
```

### Compile

```bash
forge build
```
### Deploy

A Deployment script and use of environment variables has already been set up for you. You can view the script at script/Counter.s.sol

Rename your .env.example file to .env and fill in your private key. The RPC URL has already been filled in along with the verifier URL. 

To use the variables in your .env file run the following command: 

```shell
source .env
```

You can now deploay to Morph with the following command: 

```shell
forge script script/Counter.s.sol --rpc-url $RPC_URL --broadcast --private-key $DEPLOYER_PRIVATE_KEY --legacy
```

Adjust as needed for your own script names. 

### Verify 

Verification requires some flags passed to the normal verification script. You can verify using the command below:

```bash
 forge verify-contract <YourContractAddress Counter\
  --chain 2810 \
  --verifier-url $VERIFIER_URL \
  --verifier blockscout --watch
```

Once succeed, you can check your contract and the deployment transaction on [Morph Holesky Explorer](https://explorer-holesky.morphl2.io)

### Cast

```shell
cast <subcommand>
```

### Help

```shell
forge --help
anvil --help
cast --help
```

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
forge build
```

### Test

```shell
forge test
```

### Format

```shell
forge fmt
```

### Gas Snapshots

```shell
forge snapshot
```

### Anvil

```shell
anvil
```


