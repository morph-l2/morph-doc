---
title: Bridge between Morphism and Ethereum
lang: en-US
---

Although Morphism is an L2 (and therefore fundamentally connected to Ethereum), it's also a separate blockchain system.
App developers commonly need to move data and assets between Morphism and Ethereum.
We call the process of moving data and assets between the two networks "bridging".

## Sending tokens

For the most common usecase, moving tokens around, we've created the Standard Token Bridge.
The Standard Token Bridge is a simple smart contract with all the functionality you need to move tokens between Morphism and Ethereum.
It also allows you to easily create L2 representations of existing tokens on Ethereum.

## Sending data

If the Standard Token Bridge doesn't fully cover your usecase, you can also send arbitrary data between L1 and L2.

You can use this functionality to have a contract on Ethereum trigger a contract function on Morphism and vice versa.
We've made this process as easy as possible by giving developers a simple API for triggering a cross-chain function call.
