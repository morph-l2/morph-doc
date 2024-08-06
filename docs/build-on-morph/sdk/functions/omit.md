[**@morph-l2/sdk**](../globals.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / omit

# Function: omit()

> **omit**\<`T`, `K`\>(`obj`, ...`keys`): `Omit`\<`T`, `K`\>

Returns a copy of the given object ( ...obj ) with the given keys omitted.

## Type parameters

• **T** *extends* `object`

• **K** *extends* `string` \| `number` \| `symbol`

## Parameters

• **obj**: `T`

Object to return with the keys omitted.

• ...**keys**: `K`[]

Keys to omit from the returned object.

## Returns

`Omit`\<`T`, `K`\>

A copy of the given object with the given keys omitted.

## Source

src/utils/misc-utils.ts:11
