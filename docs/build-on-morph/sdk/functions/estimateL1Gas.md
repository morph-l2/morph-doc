[**@morph-l2/sdk**] • **Docs**

***

[@morph-l2/sdk](../1-globals.md) / estimateL1Gas

# Function: estimateL1Gas()

> **estimateL1Gas**(`l2Provider`, `tx`): `Promise`\<`BigNumber`\>

Estimates the amount of L1 gas required for a given L2 transaction.

## Parameters

• **l2Provider**: [`ProviderLike`](../type-aliases/ProviderLike.md)

L2 provider to query the gas usage from.

• **tx**: `TransactionRequest`

Transaction to estimate L1 gas for.

## Returns

`Promise`\<`BigNumber`\>

Estimated L1 gas.

## Source

src/l2-provider.ts:69
