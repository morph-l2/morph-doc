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
  [bridge](https://bridge-testnet.morphl2.io) to transfer some test ETH from _Holesky_ to _Morph Holesky_. 
  
  See our [Faucet](../../quick-start/3-faucet.md) for details.
:::

<!--

## Deploy contracts with Remix

-->


## Deploy contracts with Hardhat

1. If you haven't already, install [nodejs](https://nodejs.org/en/download/) and [yarn](https://classic.yarnpkg.com/lang/en/docs/install).
2. Clone the repo and install dependencies:

   ```shell
   git clone https://github.com/morph-l2/morph-examples.git
   cd contract-deploy-demo
   yarn install
   ```

3. Create a `.env` file following the example `.env.example` in the root directory. Change `PRIVATE_KEY` to your own account private key in the `.env`.

4. Run `yarn compile` to compile the contract.

5. Run `yarn deploy:morphTestnet` to deploy the contract on the Morph Holesky Testnet.

6. Run `yarn test` for hardhat tests.

## Deploy contracts with Foundry

1. Clone the repo:

   ```shell
   git clone https://github.com/morph-l2/morph-examples.git
   cd contract-deploy-demo
   ```

2. Install Foundry:

   ```shell
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

3. Run `forge build` to build the project.

4. Deploy your contract with Foundry:

   ```bash
   forge create --rpc-url https://rpc-testnet.morphl2.io/ \
     --value <lock_amount> \
     --constructor-args <unlock_time> \
     --private-key <private_key> \
     --legacy contracts/Lock.sol:Lock
   ```

   - `<lock_amount>` is the amount of test `ETH` to be locked in the contract. Try setting this to some small amount, like `0.0000001ether`;
   - `<unlock_time>` is the Unix timestamp after which the funds locked in the contract will become available for withdrawal. Try setting this to some Unix timestamp in the future, like `1714492800` (this Unix timestamp corresponds to May 1, 2024).

   For example:

   ```
   forge create --rpc-url https://rpc-testnet.morphl2.io/ \
     --value 0.0000001ether \
     --constructor-args 1714492800 \
     --private-key a123q123q233q231q231q2q1223q23q11q33q113qq31q31231 \
     --legacy contracts/Lock.sol:Lock
   ```

   Once successed, you will see the following message:

   ```bash
   Deployer: <Your address>
   Deployed to: <Your contract address>
   Transaction hash: <The deploy transaction hash>
   ```


## Questions and Feedback

Thank you for participating in and developing on the Morph Holesky Testnet! If you encounter any issues, join our [Discord](https://discord.com/invite/5SmG4yhzVZ) and find us at #dev-help channel.


