[**@morph-l2/sdk**](../README.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / toSignerOrProvider

# Function: toSignerOrProvider()

> **toSignerOrProvider**(`signerOrProvider`): `Provider` \| `Signer`

Converts a SignerOrProviderLike into a Signer or a Provider. Assumes that if the input is a
string then it is a JSON-RPC url.

## Parameters

• **signerOrProvider**: [`SignerOrProviderLike`](../type-aliases/SignerOrProviderLike.md)

SignerOrProviderLike to turn into a Signer or Provider.

## Returns

`Provider` \| `Signer`

Input as a Signer or Provider.

## Source

src/utils/coercion.ts:25
