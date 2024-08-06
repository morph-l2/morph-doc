[**@morph-l2/sdk**](../globals.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / hashMessageHash

# Function: hashMessageHash()

> **hashMessageHash**(`messageHash`): `string`

Utility for hashing a message hash. This computes the storage slot
where the message hash will be stored in state. HashZero is used
because the first mapping in the contract is used.

## Parameters

• **messageHash**: `string`

Message hash to hash.

## Returns

`string`

Hash of the given message hash.

## Source

src/utils/message-utils.ts:24
