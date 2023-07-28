[@morphism/sdk](../README) / [Exports](../modules) / ECOBridgeAdapter

# Class: ECOBridgeAdapter

Bridge adapter for ECO.
ECO bridge requires a separate adapter as exposes different functions than our standard bridge

## Hierarchy

- [`StandardBridgeAdapter`](StandardBridgeAdapter)

  ↳ **`ECOBridgeAdapter`**

## Table of contents

### Constructors

- [constructor](ECOBridgeAdapter#constructor)

### Properties

- [estimateGas](ECOBridgeAdapter#estimategas)
- [l1Bridge](ECOBridgeAdapter#l1bridge)
- [l2Bridge](ECOBridgeAdapter#l2bridge)
- [messenger](ECOBridgeAdapter#messenger)
- [populateTransaction](ECOBridgeAdapter#populatetransaction)

### Methods

- [approval](ECOBridgeAdapter#approval)
- [approve](ECOBridgeAdapter#approve)
- [deposit](ECOBridgeAdapter#deposit)
- [getDepositsByAddress](ECOBridgeAdapter#getdepositsbyaddress)
- [getWithdrawalsByAddress](ECOBridgeAdapter#getwithdrawalsbyaddress)
- [supportsTokenPair](ECOBridgeAdapter#supportstokenpair)
- [withdraw](ECOBridgeAdapter#withdraw)

## Constructors

### constructor

• **new ECOBridgeAdapter**(`opts`)

Creates a StandardBridgeAdapter instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | `Object` | Options for the adapter. |
| `opts.l1Bridge` | [`AddressLike`](../modules#addresslike) | L1 bridge contract. |
| `opts.l2Bridge` | [`AddressLike`](../modules#addresslike) | L2 bridge contract. |
| `opts.messenger` | [`CrossChainMessenger`](CrossChainMessenger) | Provider used to make queries related to cross-chain interactions. |

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[constructor](StandardBridgeAdapter#constructor)

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

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[estimateGas](StandardBridgeAdapter#estimategas)

#### Defined in

[src/adapters/standard-bridge.ts:357](https://github.com/morphism-labs/sdk/blob/97c4394/src/adapters/standard-bridge.ts#L357)

___

### l1Bridge

• **l1Bridge**: `Contract`

L1 bridge contract.

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[l1Bridge](StandardBridgeAdapter#l1bridge)

#### Defined in

[src/adapters/standard-bridge.ts:33](https://github.com/morphism-labs/sdk/blob/97c4394/src/adapters/standard-bridge.ts#L33)

___

### l2Bridge

• **l2Bridge**: `Contract`

L2 bridge contract.

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[l2Bridge](StandardBridgeAdapter#l2bridge)

#### Defined in

[src/adapters/standard-bridge.ts:34](https://github.com/morphism-labs/sdk/blob/97c4394/src/adapters/standard-bridge.ts#L34)

___

### messenger

• **messenger**: [`CrossChainMessenger`](CrossChainMessenger)

Provider used to make queries related to cross-chain interactions.

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[messenger](StandardBridgeAdapter#messenger)

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

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[populateTransaction](StandardBridgeAdapter#populatetransaction)

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

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[approval](StandardBridgeAdapter#approval)

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

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[approve](StandardBridgeAdapter#approve)

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

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[deposit](StandardBridgeAdapter#deposit)

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

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[getDepositsByAddress](StandardBridgeAdapter#getdepositsbyaddress)

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

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[getWithdrawalsByAddress](StandardBridgeAdapter#getwithdrawalsbyaddress)

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

#### Overrides

[StandardBridgeAdapter](StandardBridgeAdapter).[supportsTokenPair](StandardBridgeAdapter#supportstokenpair)

#### Defined in

[src/adapters/eco-bridge.ts:14](https://github.com/morphism-labs/sdk/blob/97c4394/src/adapters/eco-bridge.ts#L14)

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

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[withdraw](StandardBridgeAdapter#withdraw)

#### Defined in

[src/adapters/standard-bridge.ts:246](https://github.com/morphism-labs/sdk/blob/97c4394/src/adapters/standard-bridge.ts#L246)
