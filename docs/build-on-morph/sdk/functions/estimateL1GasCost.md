[**@morph-l2/sdk**](../README.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / estimateL1GasCost

# Function: estimateL1GasCost()

> **estimateL1GasCost**(`l2Provider`, `tx`): `Promise`\<`BigNumber`\>

Estimates the amount of L1 gas cost for a given L2 transaction in wei.

## Parameters

• **l2Provider**: [`ProviderLike`](../type-aliases/ProviderLike.md)

L2 provider to query the gas usage from.

• **tx**: `TransactionRequest`

Transaction to estimate L1 gas cost for.

## Returns

`Promise`\<`BigNumber`\>

Estimated L1 gas cost.

## Source

src/l2-provider.ts:93
