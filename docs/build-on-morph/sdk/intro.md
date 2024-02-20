@morph-l2/sdk / [Exports](modules)

# @morph-l2/sdk

The `@morph-l2/sdk` package provides a set of tools for interacting with Morph.

## Installation

```
npm install @morph-l2/sdk
```

## Using the SDK

### CrossChainMessenger

The [`CrossChainMessenger`](https://github.com/morph-l2/sdk/tree/main/src/cross-chain-messenger.ts) class simplifies the process of moving assets and data between Ethereum and Morph.
You can use this class to, for example, initiate a withdrawal of ERC20 tokens from morph back to Ethereum, accurately track when the withdrawal is ready to be finalized on Ethereum, and execute the finalization transaction after the challenge period has elapsed.
The `CrossChainMessenger` can handle deposits and withdrawals of ETH and any ERC20-compatible token.
The `CrossChainMessenger` automatically connects to all relevant contracts so complex configuration is not necessary.

### L2Provider and related utilities 

The Morph SDK includes [various utilities](https://github.com/morph-l2/sdk/tree/main/src/l2-provider.ts) for handling Morph's [transaction fee model](../build-on-morph/4-understand-transaction-cost-on-morph.md).
For instance, [`estimateTotalGasCost`](../sdk/modules#estimateTotalGasCost) will estimate the total cost (in wei) to send at transaction on Morph including both the L2 execution cost and the L1 data cost.
You can also use the [`asL2Provider`](../sdk/modules#asL2Provider) function to wrap an ethers Provider object into an `L2Provider` which will have all of these helper functions attached.

### Other utilities

The SDK contains other useful helper functions and constants.
