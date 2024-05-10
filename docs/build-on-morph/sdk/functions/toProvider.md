[**@morph-l2/sdk**](../README.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / toProvider

# Function: toProvider()

> **toProvider**(`provider`): `Provider`

Converts a ProviderLike into a Provider. Assumes that if the input is a string then it is a
JSON-RPC url.

## Parameters

• **provider**: [`ProviderLike`](../type-aliases/ProviderLike.md)

ProviderLike to turn into a Provider.

## Returns

`Provider`

Input as a Provider.

## Source

src/utils/coercion.ts:46
