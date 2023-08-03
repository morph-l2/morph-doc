---
title: Communicate between morphism and ethereum
lang: en-US
keywords: [morphism,ethereum,rollup,layer2,validity proof,optimstic zk-rollup]
description: Upgrade your blockchain experience with Morphism - the secure decentralized, cost0efficient, and high-performing optimstic zk-rollup solution. Try it now!
---

:::info

This page is under development, we will make this as fast as possible

:::

Although as an Layer2, Morphism is build on top of Ethereum, these two are still two seperate different blockchains.

Thus, we need to construct a communication channel for Morphism and Ethereum to allow smooth transfer of assets and messages.

Typically, there are two ways, Ethereum to Morphism & Morphism to Ethereum.

In the protocol design, we will refer any Ethereum to Morphism assets/message transafer as “deposit” and any Morphism to Ethereum assets/message transafer as “withdraws”.

Now let's dive into how these two features is achieved in Morphism.

## Deposit
External parties should use [`L1CrossDomainMessenger`](https://github.com/morphism-labs/contracts/blob/main/contracts/L1/L1CrossDomainMessenger.sol) or [`L1StandardBridge`](https://github.com/morphism-labs/contracts/blob/main/contracts/L1/L1StandardBridge.sol) to send a deposit transaticons.

Deposit transactions become part of the canonical blockchain in the first L2 block of the "epoch" corresponding to the L1 block where the deposits were made. 
This L2 block will usually be created a few minutes after the corresponding L1 block.



## Withdraw

TBD