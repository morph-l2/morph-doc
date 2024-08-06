[**@morph-l2/sdk**](../README.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / isL2Provider

# Function: isL2Provider()

> **isL2Provider**\<`TProvider`\>(`provider`): `provider is L2Provider<TProvider>`

Determines if a given Provider is an L2Provider.  Will coerce type
if true

## Type parameters

• **TProvider** *extends* `Provider`\<`TProvider`\>

## Parameters

• **provider**: `TProvider`

The provider to check

## Returns

`provider is L2Provider<TProvider>`

Boolean

## Example

```ts
if (isL2Provider(provider)) {
  // typescript now knows it is of type L2Provider
  const gasPrice = await provider.estimateL2GasPrice(tx)
}
```

## Source

src/l2-provider.ts:157
