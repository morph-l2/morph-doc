[**@morph-l2/sdk**](../README.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / estimateL2GasCost

# Function: estimateL2GasCost()

> **estimateL2GasCost**(`l2Provider`, `tx`): `Promise`\<`BigNumber`\>

Estimates the L2 gas cost for a given L2 transaction in wei.

## Parameters

• **l2Provider**: [`ProviderLike`](../type-aliases/ProviderLike.md)

L2 provider to query the gas usage from.

• **tx**: `TransactionRequest`

Transaction to estimate L2 gas cost for.

## Returns

`Promise`\<`BigNumber`\>

Estimated L2 gas cost.

## Source

src/l2-provider.ts:119
