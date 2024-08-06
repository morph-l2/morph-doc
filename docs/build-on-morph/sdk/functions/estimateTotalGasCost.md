[**@morph-l2/sdk**](../README.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / estimateTotalGasCost

# Function: estimateTotalGasCost()

> **estimateTotalGasCost**(`l2Provider`, `tx`): `Promise`\<`BigNumber`\>

Estimates the total gas cost for a given L2 transaction in wei.

## Parameters

• **l2Provider**: [`ProviderLike`](../type-aliases/ProviderLike.md)

L2 provider to query the gas usage from.

• **tx**: `TransactionRequest`

Transaction to estimate total gas cost for.

## Returns

`Promise`\<`BigNumber`\>

Estimated total gas cost.

## Source

src/l2-provider.ts:136
