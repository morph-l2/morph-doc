---
title: USDC on Morph
lang: en-US
---

## The difference between USDC and USDC.e

### USDC

Circle introduced the [Bridged USDC Standard](https://www.circle.com/en/bridged-usdc "Circle Doc") to ensure that chain operators can easily deploy a form of bridged USDC that is capable of being upgraded in-place by Circle to native USDC, if and when appropriate, and prevent any fragmentation problems. The Morph official bridge and supported ecosystem partners have integrated this USDC following the Circle Bridged standard.

| Asset | Morph mainnet address |
| :--- | :--- |
| USDC | 0xCfb1186F4e93D60E60a8bDd997427D1F33bc372B |

### USDC.e

There also exists a "bridged" form of USDC known as USDC.e, which is USDC that has been bridged from Ethereum and issued by Morph.

| Asset | Morph mainnet address |
| :--- | :--- |
| USDC.e | 0xe34c91815d7fc18a9e2148bcd4241d0a5848b693 |

## Using USDC on Morph

:::tip Note

Whether you are a developer or a user, we recommend that you use **USDC on Morph**.

:::

### For users

Users can get USDC on the Morph mainnet in these ways:

1.  **Using the official Morph Bridge**
    You can bridge USDC directly from Ethereum to Morph using the [official Morph bridge](https://bridge.morph.network "Morph Bridge").

2.  **Using third-party bridges**
    Several well-known third-party bridges are integrated with the Morph network, allowing you to transfer assets from other chains. For example, you can use [Orbiter Finance](https://orbiter.finance/trade/Morph/Ethereum?from=0xe34c91815d7fc18a9e2148bcd4241d0a5848b693&to=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48 "Orbiter Finance").

3.  **Using supported exchanges**
    Various centralized exchanges that support the Morph network allow for direct USDC (not USDC.e) deposits and withdrawals.

### For developers

Developers can utilize Circle's Cross-Chain Transfer Protocol (CCTP) to build native cross-chain experiences. Please refer to the [CCTP documentation](https://developers.circle.com/cctp "CCTP Doc") and the USDC workflow section for detailed integration guidelines.
