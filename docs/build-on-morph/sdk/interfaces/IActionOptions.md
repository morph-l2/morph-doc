[**@morph-l2/sdk**](../README.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / IActionOptions

# Interface: IActionOptions

## Param

Optional signer to use to send the transaction.

## Param

Optional address to receive the funds on chain. Defaults to sender.

## Param

Direction to search for messages in. If not provided, will attempt to
  * automatically search both directions under the assumption that a transaction hash will only
  * exist on one chain. If the hash exists on both chains, will throw an error.

## Param

Optional transaction overrides.

## Properties

### direction?

> `optional` **direction**: [`MessageDirection`](../enumerations/MessageDirection.md)

#### Source

src/interfaces/types.ts:412

***

### from?

> `optional` **from**: `string`

#### Source

src/interfaces/types.ts:410

***

### overrides?

> `optional` **overrides**: `object` & `CallOverrides`

#### Type declaration

##### gatewayAddress?

> `optional` **gatewayAddress**: `string`

##### gatewayName?

> `optional` **gatewayName**: `string`

#### Source

src/interfaces/types.ts:413

***

### recipient?

> `optional` **recipient**: [`AddressLike`](../type-aliases/AddressLike.md)

#### Source

src/interfaces/types.ts:411

***

### signer?

> `optional` **signer**: `Signer`

#### Source

src/interfaces/types.ts:409
