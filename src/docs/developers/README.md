---
title: Morphism developer docs
lang: en-US
---

Welcome to the Morphism developer docs!

Whether you're just looking to [deploy a basic contract]() or you're ready to [build a cross-chain app](./buildon/bridge.md), you'll be able to find everything you need to start building on Morphism within this section.


<!--
If you're looking for third-party tools that make building on Morphism easier, check out the [Tools for Developers](../useful-tools) section.
-->
## Where should I start?

### Just getting started with Morphism?

If you're brand new to Morphism, we recommend checking out the [guide to deploying a basic contract]().

It'll get you familiar with the core steps required to get a contract deployed to the network.

Luckily, Morphism is [EVM equivalent](), so it's 100% the same as deploying a contract to Ethereum.

<!--
If you're a bit more familiar with Morphism and Ethereum, you can try walking through one of the various [tutorials](https://github.com/ethereum-optimism/optimism-tutorial) put together by the Morphism community.
They'll help you get a headstart when building your first Optimistic project. 

### Ready to deploy a contract?

If you're looking to deploy your contracts to the Morphism mainnet or the Morphism sepolia testnet, take a look at the [getting started tutorial](https://github.com/ethereum-optimism/optimism-tutorial/tree/main/getting-started#development-stacks).

It contains sample configuration files for deploying your contracts from common frameworks like Hardhat, Truffle, and Brownie.

You might also want to check out our guides for [running a local development environment](./build/dev-node.md) or [running your own Optimism node](./build/run-a-node.md).

These guides are designed to help you feel totally confident in your Morphism deployment. -->

### Want to explore the cross-chain frontier?

We've got detailed guides for that.

If you want to bridge a token from Ethereum to Morphism (or vice versa!), you should learn more about our [Standard Token Bridge](./buildon/bridge.md).

The Standard Token Bridge makes the process of moving tokens between chains as easy as possible.

If you're looking for something more advanced, we recommend reading through our page on [sending data between L1 and L2](./buildon/bridge.md).

Contracts on one chain can trigger contract functions on the other chain, it's pretty cool!
We even dogfood the same infrastructure and use it under the hood of the Standard Token Bridge.

<!--

## Still don't know where to look?

If you can't find the content you're looking for you've got a few options to get extra help.
We recommend first searching through this documentation (search bar at the top right).
If you've already done this and come up short, you can try [asking us a question in Discord](https://discord-gateway.optimism.io), [checking the Help Center](https://help.optimism.io/hc/en-us), or [making an issue on GitHub](https://github.com/ethereum-optimism/community-hub/issues).

-->