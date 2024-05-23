---
title: Deploy Contracts on Morph
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!
---



The Morph Holesky Testnet allows anyone to deploy a smart contract on Morph. In this tutorial, you will learn how to deploy a contract on Morph Holesky using common tools for developing on Ethereum. 

This [demo repo](https://github.com/morph-l2/morph-examples/tree/main/contract-deploy-demo) illustrates contract deployment with [Hardhat](https://hardhat.org/) and [Foundry](https://github.com/foundry-rs/foundry).

:::tip
  Before you start deploying the contract, you need to request test tokens from a Holesky faucet and use the
  [bridge](https://bridge-holesky.morphl2.io) to transfer some test ETH from _Holesky_ to _Morph Holesky_. 
  
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
   cd contract-deployment-demos/hardhat-demo
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
   cd contract-deployment-demos/foundry-demo
   ```

2. Install Foundry:

   ```shell
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

3. Run `forge build` to build the project.

4. Set up deployer with foundry's keystore:

   ```shell
   cast wallet import deployer --interactive
   ```
   
   This makes it safer to handle your private keys when deploying contracts and also prevents accidental commits of `.env`

6. Deploy your contract with Foundry:

   ```bash
   forge create --rpc-url https://rpc-quicknode-holesky.morphl2.io/ \
     --account deployer \
     --legacy src/Counter.sol:Counter
   ```

   Once successfull, you will see the following message:

   ```bash
   Deployer: <Your address>
   Deployed to: <Your contract address>
   Transaction hash: <The deploy transaction hash>
   ```
   
7. Verify your contract with Foundry:

   Update your `foundry.toml` with the following

   ```yml
   [etherscan]
   morph-holesky = { key = "anythingcanwork", chain = 2810, url = "https://explorer-api-holesky.morphl2.io/api" }
   ```

   if you already didn't use the `--verify` flag during deployment, you can alternatively use `forge verify-contract`.

   ```shell
   forge verify-contract --chain 2810 <deployed contract address>  src/Counter.sol:Counter  --watch
   ```

   If done correctly, you will see the following output:

   ```bash
   Start verifying contract `<deployed contract addresss>` deployed on 2810

   Submitting verification for [src/Counter.sol:Counter] `<deployed contract addresss>`.
   Submitted contract for verification:
            Response: `OK`
            GUID: `<tracking id>`
            URL: https://explorer-api-holesky.morphl2.io/address/`<deployed contract addresss>`
   Contract verification status:
   Response: `OK`
   Details: `Pending in queue`
   Contract verification status:
   Response: `OK`
   Details: `Pass - Verified`
   Contract successfully verified
   ```

## Questions and Feedback

Thank you for participating in and developing on the Morph Holesky Testnet! If you encounter any issues, join our [Discord](https://discord.com/invite/5SmG4yhzVZ) and find us at #dev-help channel.


