---
title: Start Developing on Morphism
lang: en-US
---

# Start Developing on Morphism

Developing on Morphism is as easy as developing on Ethereum — literally!

To deploy contracts onto an morphism chain, simply set the RPC endpoint of your target morphism chain and deploy using your favorite Ethereum development framework;

- [Truffle](https://trufflesuite.com/)
- [Hardhat](https://hardhat.org/)
- [Foundry](https://github.com/foundry-rs/foundry)
- [Brownie](https://eth-brownie.readthedocs.io/en/stable/)
- [Alchemy](https://docs.alchemy.com/reference/alchemy-sdk-quickstart)

...it all just works!

For examples of deploying with hardhat see [practice examples](../Practice%20Examples/1-ERC20.md).

For info on new / different behavior between morphism and Ethereum, see [differences with Ethereum](./1-diff.md).

## Step 1: Network Configuration

This section provides an overview of the available public RPC endpoints for different Arbitrum chains and necessary details to interact with them.

| Name                      | RPC Url(s)                            | Chain ID | Block explorer             | Underlying L1 |
| ------------------------- | ------------------------------------- | -------- | -------------------------- | ------------- | ---------- | ------------------------------------ |
| Morphism Testnet             | https://          | xxxx    | https://      | Ethereum      |

## Step 2: Set up your developing framework