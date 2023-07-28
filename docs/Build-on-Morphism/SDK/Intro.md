@morphism/sdk / [Exports](modules)

# @morphism/sdk

The `@morphism/sdk` package provides a set of tools for interacting with Morphism.

## Installation

```
npm install @morphism/sdk
```

## Using the SDK

### CrossChainMessenger

The [`CrossChainMessenger`](https://github.com/morphism-labs/sdk/blob/main/src/cross-chain-messenger.ts) class simplifies the process of moving assets and data between Ethereum and Morphism.
You can use this class to, for example, initiate a withdrawal of ERC20 tokens from morphism back to Ethereum, accurately track when the withdrawal is ready to be finalized on Ethereum, and execute the finalization transaction after the challenge period has elapsed.
The `CrossChainMessenger` can handle deposits and withdrawals of ETH and any ERC20-compatible token.
The `CrossChainMessenger` automatically connects to all relevant contracts so complex configuration is not necessary.

### L2Provider and related utilities 

The Morphism SDK includes [various utilities](https://github.com/morphism-labs/sdk/blob/main/src/l2-provider.ts) for handling Morphism's [transaction fee model](../Build%20on%20Morphism/4-txfee.md).
For instance, [`estimateTotalGasCost`](../SDK/modules#estimateTotalGasCost) will estimate the total cost (in wei) to send at transaction on Morphism including both the L2 execution cost and the L1 data cost.
You can also use the [`asL2Provider`](../SDK/modules#asL2Provider) function to wrap an ethers Provider object into an `L2Provider` which will have all of these helper functions attached.

### Other utilities

The SDK contains other useful helper functions and constants.
