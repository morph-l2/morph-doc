**@morph-l2/sdk** • [**Docs**](globals.md)

***

# @morph-l2/sdk

The `@morph-l2/sdk` package provides a set of tools for interacting with Morph.

## Installation

```
npm install @morph-l2/sdk
```

## Docs

You can find auto-generated API documentation over at [docs.morphl2.io](https://docs.morphl2.io/docs/SDK/intro).

## Using the SDK

### CrossChainMessenger

The [`CrossChainMessenger`](https://github.com/morph-l2/sdk/blob/main/src/cross-chain-messenger.ts) class simplifies the process of moving assets and data between Ethereum and Morph.
You can use this class to, for example, initiate a withdrawal of ERC20 tokens from morph back to Ethereum, accurately track when the withdrawal is ready to be finalized on Ethereum, and execute the finalization transaction after the challenge period has elapsed.
The `CrossChainMessenger` can handle deposits and withdrawals of ETH and any ERC20-compatible token.
The `CrossChainMessenger` automatically connects to all relevant contracts so complex configuration is not necessary.

### L2Provider and related utilities

The Morph SDK includes [various utilities](https://github.com/morph-l2/sdk/blob/main/src/l2-provider.ts) for handling Morph's [transaction fee model](https://docs.morphl2.io/Build-on-Morph/4-txfee.md).
For instance, [`estimateTotalGasCost`](https://docs.morphl2.io/SDK/modules#estimateTotalGasCost) will estimate the total cost (in wei) to send at transaction on Morph including both the L2 execution cost and the L1 data cost.
You can also use the [`asL2Provider`](https://docs.morphl2.io/SDK/modules#asL2Provider) function to wrap an ethers Provider object into an `L2Provider` which will have all of these helper functions attached.

### Other utilities

The SDK contains other useful helper functions and constants.
For a complete list, refer to the auto-generated [SDK documentation](https://docs.morphl2.io/docs/build-on-morph/sdk/modules/)
