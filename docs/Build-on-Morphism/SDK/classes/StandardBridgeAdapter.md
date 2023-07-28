[@morphism/sdk](../README) / [Exports](../modules) / StandardBridgeAdapter

# Class: StandardBridgeAdapter

Bridge adapter for any token bridge that uses the standard token bridge interface.

## Hierarchy

- **`StandardBridgeAdapter`**

  ↳ [`ETHBridgeAdapter`](ETHBridgeAdapter)

  ↳ [`DAIBridgeAdapter`](DAIBridgeAdapter)

  ↳ [`ECOBridgeAdapter`](ECOBridgeAdapter)

## Implements

- [`IBridgeAdapter`](../interfaces/IBridgeAdapter)

## Table of contents

### Constructors

- [constructor](StandardBridgeAdapter#constructor)

### Properties

- [estimateGas](StandardBridgeAdapter#estimategas)
- [l1Bridge](StandardBridgeAdapter#l1bridge)
- [l2Bridge](StandardBridgeAdapter#l2bridge)
- [messenger](StandardBridgeAdapter#messenger)
- [populateTransaction](StandardBridgeAdapter#populatetransaction)

### Methods

- [approval](StandardBridgeAdapter#approval)
- [approve](StandardBridgeAdapter#approve)
- [deposit](StandardBridgeAdapter#deposit)
- [getDepositsByAddress](StandardBridgeAdapter#getdepositsbyaddress)
- [getWithdrawalsByAddress](StandardBridgeAdapter#getwithdrawalsbyaddress)
- [supportsTokenPair](StandardBridgeAdapter#supportstokenpair)
- [withdraw](StandardBridgeAdapter#withdraw)

## Constructors

### constructor

• **new StandardBridgeAdapter**(`opts`)

Creates a StandardBridgeAdapter instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | `Object` | Options for the adapter. |
| `opts.l1Bridge` | [`AddressLike`](../modules#addresslike) | L1 bridge contract. |
| `opts.l2Bridge` | [`AddressLike`](../modules#addresslike) | L2 bridge contract. |
| `opts.messenger` | [`CrossChainMessenger`](CrossChainMessenger) | Provider used to make queries related to cross-chain interactions. |

#### Defined in

[src/adapters/standard-bridge.ts:44](https://github.com/morphism-labs/sdk/blob/97c4394/src/adapters/standard-bridge.ts#L44)

## Properties

### estimateGas

• **estimateGas**: `Object`

Object that holds the functions that estimates the gas required for a given transaction.
Follows the pattern used by ethers.js.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `approve` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `overrides?`: `CallOverrides`  }) => `Promise`<`BigNumber`\> |
| `deposit` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `l2GasLimit?`: [`NumberLike`](../modules#numberlike) ; `overrides?`: `CallOverrides` ; `recipient?`: [`AddressLike`](../modules#addresslike)  }) => `Promise`<`BigNumber`\> |
| `withdraw` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `overrides?`: `CallOverrides` ; `recipient?`: [`AddressLike`](../modules#addresslike)  }) => `Promise`<`BigNumber`\> |

#### Implementation of

[IBridgeAdapter](../interfaces/IBridgeAdapter).[estimateGas](../interfaces/IBridgeAdapter#estimategas)

#### Defined in

[src/adapters/standard-bridge.ts:357](https://github.com/morphism-labs/sdk/blob/97c4394/src/adapters/standard-bridge.ts#L357)

___

### l1Bridge

• **l1Bridge**: `Contract`

L1 bridge contract.

#### Implementation of

[IBridgeAdapter](../interfaces/IBridgeAdapter).[l1Bridge](../interfaces/IBridgeAdapter#l1bridge)

#### Defined in

[src/adapters/standard-bridge.ts:33](https://github.com/morphism-labs/sdk/blob/97c4394/src/adapters/standard-bridge.ts#L33)

___

### l2Bridge

• **l2Bridge**: `Contract`

L2 bridge contract.

#### Implementation of

[IBridgeAdapter](../interfaces/IBridgeAdapter).[l2Bridge](../interfaces/IBridgeAdapter#l2bridge)

#### Defined in

[src/adapters/standard-bridge.ts:34](https://github.com/morphism-labs/sdk/blob/97c4394/src/adapters/standard-bridge.ts#L34)

___

### messenger

• **messenger**: [`CrossChainMessenger`](CrossChainMessenger)

Provider used to make queries related to cross-chain interactions.

#### Implementation of

[IBridgeAdapter](../interfaces/IBridgeAdapter).[messenger](../interfaces/IBridgeAdapter#messenger)

#### Defined in

[src/adapters/standard-bridge.ts:32](https://github.com/morphism-labs/sdk/blob/97c4394/src/adapters/standard-bridge.ts#L32)

___

### populateTransaction

• **populateTransaction**: `Object`

Object that holds the functions that generate transactions to be signed by the user.
Follows the pattern used by ethers.js.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `approve` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `overrides?`: `Overrides`  }) => `Promise`<`TransactionRequest`\> |
| `deposit` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `l2GasLimit?`: [`NumberLike`](../modules#numberlike) ; `overrides?`: `Overrides` ; `recipient?`: [`AddressLike`](../modules#addresslike)  }) => `Promise`<`TransactionRequest`\> |
| `withdraw` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `overrides?`: `Overrides` ; `recipient?`: [`AddressLike`](../modules#addresslike)  }) => `Promise`<`TransactionRequest`\> |

#### Implementation of

[IBridgeAdapter](../interfaces/IBridgeAdapter).[populateTransaction](../interfaces/IBridgeAdapter#populatetransaction)

#### Defined in

[src/adapters/standard-bridge.ts:261](https://github.com/morphism-labs/sdk/blob/97c4394/src/adapters/standard-bridge.ts#L261)

## Methods

### approval

▸ **approval**(`l1Token`, `l2Token`, `signer`): `Promise`<`BigNumber`\>

Queries the account's approval amount for a given L1 token.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l1Token` | [`AddressLike`](../modules#addresslike) | The L1 token address. |
| `l2Token` | [`AddressLike`](../modules#addresslike) | The L2 token address. |
| `signer` | `Signer` | Signer to query the approval for. |

#### Returns

`Promise`<`BigNumber`\>

Amount of tokens approved for deposits from the account.

#### Implementation of

[IBridgeAdapter](../interfaces/IBridgeAdapter).[approval](../interfaces/IBridgeAdapter#approval)

#### Defined in

[src/adapters/standard-bridge.ts:198](https://github.com/morphism-labs/sdk/blob/97c4394/src/adapters/standard-bridge.ts#L198)

___

### approve

▸ **approve**(`l1Token`, `l2Token`, `amount`, `signer`, `opts?`): `Promise`<`TransactionResponse`\>

Approves a deposit into the L2 chain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l1Token` | [`AddressLike`](../modules#addresslike) | The L1 token address. |
| `l2Token` | [`AddressLike`](../modules#addresslike) | The L2 token address. |
| `amount` | [`NumberLike`](../modules#numberlike) | Amount of the token to approve. |
| `signer` | `Signer` | Signer used to sign and send the transaction. |
| `opts?` | `Object` | Additional options. |
| `opts.overrides?` | `Overrides` | - |

#### Returns

`Promise`<`TransactionResponse`\>

Transaction response for the approval transaction.

#### Implementation of

[IBridgeAdapter](../interfaces/IBridgeAdapter).[approve](../interfaces/IBridgeAdapter#approve)

#### Defined in

[src/adapters/standard-bridge.ts:216](https://github.com/morphism-labs/sdk/blob/97c4394/src/adapters/standard-bridge.ts#L216)

___

### deposit

▸ **deposit**(`l1Token`, `l2Token`, `amount`, `signer`, `opts?`): `Promise`<`TransactionResponse`\>

Deposits some tokens into the L2 chain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l1Token` | [`AddressLike`](../modules#addresslike) | The L1 token address. |
| `l2Token` | [`AddressLike`](../modules#addresslike) | The L2 token address. |
| `amount` | [`NumberLike`](../modules#numberlike) | Amount of the token to deposit. |
| `signer` | `Signer` | Signer used to sign and send the transaction. |
| `opts?` | `Object` | Additional options. |
| `opts.l2GasLimit?` | [`NumberLike`](../modules#numberlike) | - |
| `opts.overrides?` | `Overrides` | - |
| `opts.recipient?` | [`AddressLike`](../modules#addresslike) | - |

#### Returns

`Promise`<`TransactionResponse`\>

Transaction response for the deposit transaction.

#### Implementation of

[IBridgeAdapter](../interfaces/IBridgeAdapter).[deposit](../interfaces/IBridgeAdapter#deposit)

#### Defined in

[src/adapters/standard-bridge.ts:230](https://github.com/morphism-labs/sdk/blob/97c4394/src/adapters/standard-bridge.ts#L230)

___

### getDepositsByAddress

▸ **getDepositsByAddress**(`address`, `opts?`): `Promise`<[`TokenBridgeMessage`](../interfaces/TokenBridgeMessage)[]\>

Gets all deposits for a given address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`AddressLike`](../modules#addresslike) | Address to search for messages from. |
| `opts?` | `Object` | Options object. |
| `opts.fromBlock?` | `BlockTag` | - |
| `opts.toBlock?` | `BlockTag` | - |

#### Returns

`Promise`<[`TokenBridgeMessage`](../interfaces/TokenBridgeMessage)[]\>

All deposit token bridge messages sent by the given address.

#### Implementation of

[IBridgeAdapter](../interfaces/IBridgeAdapter).[getDepositsByAddress](../interfaces/IBridgeAdapter#getdepositsbyaddress)

#### Defined in

[src/adapters/standard-bridge.ts:62](https://github.com/morphism-labs/sdk/blob/97c4394/src/adapters/standard-bridge.ts#L62)

___

### getWithdrawalsByAddress

▸ **getWithdrawalsByAddress**(`address`, `opts?`): `Promise`<[`TokenBridgeMessage`](../interfaces/TokenBridgeMessage)[]\>

Gets all withdrawals for a given address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`AddressLike`](../modules#addresslike) | Address to search for messages from. |
| `opts?` | `Object` | Options object. |
| `opts.fromBlock?` | `BlockTag` | - |
| `opts.toBlock?` | `BlockTag` | - |

#### Returns

`Promise`<[`TokenBridgeMessage`](../interfaces/TokenBridgeMessage)[]\>

All withdrawal token bridge messages sent by the given address.

#### Implementation of

[IBridgeAdapter](../interfaces/IBridgeAdapter).[getWithdrawalsByAddress](../interfaces/IBridgeAdapter#getwithdrawalsbyaddress)

#### Defined in

[src/adapters/standard-bridge.ts:109](https://github.com/morphism-labs/sdk/blob/97c4394/src/adapters/standard-bridge.ts#L109)

___

### supportsTokenPair

▸ **supportsTokenPair**(`l1Token`, `l2Token`): `Promise`<`boolean`\>

Checks whether the given token pair is supported by the bridge.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l1Token` | [`AddressLike`](../modules#addresslike) | The L1 token address. |
| `l2Token` | [`AddressLike`](../modules#addresslike) | The L2 token address. |

#### Returns

`Promise`<`boolean`\>

Whether the given token pair is supported by the bridge.

#### Implementation of

[IBridgeAdapter](../interfaces/IBridgeAdapter).[supportsTokenPair](../interfaces/IBridgeAdapter#supportstokenpair)

#### Defined in

[src/adapters/standard-bridge.ts:152](https://github.com/morphism-labs/sdk/blob/97c4394/src/adapters/standard-bridge.ts#L152)

___

### withdraw

▸ **withdraw**(`l1Token`, `l2Token`, `amount`, `signer`, `opts?`): `Promise`<`TransactionResponse`\>

Withdraws some tokens back to the L1 chain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l1Token` | [`AddressLike`](../modules#addresslike) | The L1 token address. |
| `l2Token` | [`AddressLike`](../modules#addresslike) | The L2 token address. |
| `amount` | [`NumberLike`](../modules#numberlike) | Amount of the token to withdraw. |
| `signer` | `Signer` | Signer used to sign and send the transaction. |
| `opts?` | `Object` | Additional options. |
| `opts.overrides?` | `Overrides` | - |
| `opts.recipient?` | [`AddressLike`](../modules#addresslike) | - |

#### Returns

`Promise`<`TransactionResponse`\>

Transaction response for the withdraw transaction.

#### Implementation of

[IBridgeAdapter](../interfaces/IBridgeAdapter).[withdraw](../interfaces/IBridgeAdapter#withdraw)

#### Defined in

[src/adapters/standard-bridge.ts:246](https://github.com/morphism-labs/sdk/blob/97c4394/src/adapters/standard-bridge.ts#L246)
