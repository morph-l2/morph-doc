[**@morph-l2/sdk**](../globals.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / L1Provider

# Type alias: L1Provider\<TProvider\>

> **L1Provider**\<`TProvider`\>: `TProvider` & `object`

Represents an extended version of an normal ethers Provider that returns additional L1 info and
has special functions for L1-specific interactions.

## Type declaration

### \_isL1Provider

> **\_isL1Provider**: `true`

Internal property to determine if a provider is a L1Provider
You are likely looking for the isL2Provider function

### estimateCrossDomainMessageFee()

Gets the current L1 (data) gas price.

#### Parameters

• **l1Provider**: [`ProviderLike`](ProviderLike.md)

• **sender**: `string`

• **gasLimit**: `number` \| `bigint` \| `BigNumber`

#### Returns

`Promise`\<`BigNumber`\>

Current L1 data gas price in wei.

## Type parameters

• **TProvider** *extends* `Provider`

## Source

src/interfaces/l1-provider.ts:11
