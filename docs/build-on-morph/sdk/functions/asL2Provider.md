[**@morph-l2/sdk**](../globals.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / asL2Provider

# Function: asL2Provider()

> **asL2Provider**\<`TProvider`\>(`provider`): [`L2Provider`](../type-aliases/L2Provider.md)\<`TProvider`\>

Returns an provider wrapped as an Morph L2 provider. Adds a few extra helper functions to
simplify the process of estimating the gas usage for a transaction on Morph. Returns a COPY
of the original provider.

## Type parameters

• **TProvider** *extends* `Provider`\<`TProvider`\>

## Parameters

• **provider**: `TProvider`

Provider to wrap into an L2 provider.

## Returns

[`L2Provider`](../type-aliases/L2Provider.md)\<`TProvider`\>

Provider wrapped as an L2 provider.

## Source

src/l2-provider.ts:171
