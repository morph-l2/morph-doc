[@morphism/sdk](../README) / [Exports](../modules) / IBridgeAdapter

# Interface: IBridgeAdapter


## Implemented by

- [`StandardBridgeAdapter`](../classes/StandardBridgeAdapter)

## Table of contents

### Properties

- [estimateGas](IBridgeAdapter#estimategas)
- [l1Bridge](IBridgeAdapter#l1bridge)
- [l2Bridge](IBridgeAdapter#l2bridge)
- [messenger](IBridgeAdapter#messenger)
- [populateTransaction](IBridgeAdapter#populatetransaction)

### Methods

- [approval](IBridgeAdapter#approval)
- [approve](IBridgeAdapter#approve)
- [deposit](IBridgeAdapter#deposit)
- [getDepositsByAddress](IBridgeAdapter#getdepositsbyaddress)
- [getWithdrawalsByAddress](IBridgeAdapter#getwithdrawalsbyaddress)
- [supportsTokenPair](IBridgeAdapter#supportstokenpair)
- [withdraw](IBridgeAdapter#withdraw)

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

#### Defined in

[src/interfaces/bridge-adapter.ts:244](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/bridge-adapter.ts#L244)

___

### l1Bridge

• **l1Bridge**: `Contract`

L1 bridge contract.

#### Defined in

[src/interfaces/bridge-adapter.ts:31](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/bridge-adapter.ts#L31)

___

### l2Bridge

• **l2Bridge**: `Contract`

L2 bridge contract.

#### Defined in

[src/interfaces/bridge-adapter.ts:36](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/bridge-adapter.ts#L36)

___

### messenger

• **messenger**: [`CrossChainMessenger`](../classes/CrossChainMessenger)

Provider used to make queries related to cross-chain interactions.

#### Defined in

[src/interfaces/bridge-adapter.ts:26](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/bridge-adapter.ts#L26)

___

### populateTransaction

• **populateTransaction**: `Object`

Object that holds the functions that generate transactions to be signed by the user.
Follows the pattern used by ethers.js.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `approve` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `overrides?`: `Overrides`  }) => `Promise`<`TransactionRequest`\> |
| `deposit` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `l2GasLimit?`: [`NumberLike`](../modules#numberlike) ; `overrides?`: `PayableOverrides` ; `recipient?`: [`AddressLike`](../modules#addresslike)  }) => `Promise`<`TransactionRequest`\> |
| `withdraw` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `overrides?`: `Overrides` ; `recipient?`: [`AddressLike`](../modules#addresslike)  }) => `Promise`<`TransactionRequest`\> |

#### Defined in

[src/interfaces/bridge-adapter.ts:175](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/bridge-adapter.ts#L175)

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

#### Defined in

[src/interfaces/bridge-adapter.ts:96](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/bridge-adapter.ts#L96)

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
| `opts.overrides?` | `Overrides` | Optional transaction overrides. |

#### Returns

`Promise`<`TransactionResponse`\>

Transaction response for the approval transaction.

#### Defined in

[src/interfaces/bridge-adapter.ts:113](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/bridge-adapter.ts#L113)

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
| `opts.l2GasLimit?` | [`NumberLike`](../modules#numberlike) | Optional gas limit to use for the transaction on L2. |
| `opts.overrides?` | `Overrides` | Optional transaction overrides. |
| `opts.recipient?` | [`AddressLike`](../modules#addresslike) | Optional address to receive the funds on L2. Defaults to sender. |

#### Returns

`Promise`<`TransactionResponse`\>

Transaction response for the deposit transaction.

#### Defined in

[src/interfaces/bridge-adapter.ts:136](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/bridge-adapter.ts#L136)

___

### getDepositsByAddress

▸ **getDepositsByAddress**(`address`, `opts?`): `Promise`<[`TokenBridgeMessage`](TokenBridgeMessage)[]\>

Gets all deposits for a given address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`AddressLike`](../modules#addresslike) | Address to search for messages from. |
| `opts?` | `Object` | Options object. |
| `opts.fromBlock?` | `BlockTag` | Block to start searching for messages from. If not provided, will start from the first block (block #0). |
| `opts.toBlock?` | `BlockTag` | Block to stop searching for messages at. If not provided, will stop at the latest known block ("latest"). |

#### Returns

`Promise`<[`TokenBridgeMessage`](TokenBridgeMessage)[]\>

All deposit token bridge messages sent by the given address.

#### Defined in

[src/interfaces/bridge-adapter.ts:49](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/bridge-adapter.ts#L49)

___

### getWithdrawalsByAddress

▸ **getWithdrawalsByAddress**(`address`, `opts?`): `Promise`<[`TokenBridgeMessage`](TokenBridgeMessage)[]\>

Gets all withdrawals for a given address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`AddressLike`](../modules#addresslike) | Address to search for messages from. |
| `opts?` | `Object` | Options object. |
| `opts.fromBlock?` | `BlockTag` | Block to start searching for messages from. If not provided, will start from the first block (block #0). |
| `opts.toBlock?` | `BlockTag` | Block to stop searching for messages at. If not provided, will stop at the latest known block ("latest"). |

#### Returns

`Promise`<[`TokenBridgeMessage`](TokenBridgeMessage)[]\>

All withdrawal token bridge messages sent by the given address.

#### Defined in

[src/interfaces/bridge-adapter.ts:68](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/bridge-adapter.ts#L68)

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

#### Defined in

[src/interfaces/bridge-adapter.ts:83](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/bridge-adapter.ts#L83)

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
| `opts.overrides?` | `Overrides` | Optional transaction overrides. |
| `opts.recipient?` | [`AddressLike`](../modules#addresslike) | Optional address to receive the funds on L1. Defaults to sender. |

#### Returns

`Promise`<`TransactionResponse`\>

Transaction response for the withdraw transaction.

#### Defined in

[src/interfaces/bridge-adapter.ts:160](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/bridge-adapter.ts#L160)
