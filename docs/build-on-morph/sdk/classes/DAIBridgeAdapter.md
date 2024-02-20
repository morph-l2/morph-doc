[@morph-l2/sdk](../intro.md) / [Exports](../modules) / DAIBridgeAdapter

# Class: DAIBridgeAdapter

Bridge adapter for DAI.

## Hierarchy

- [`StandardBridgeAdapter`](StandardBridgeAdapter)

  ↳ **`DAIBridgeAdapter`**

## Table of contents

### Constructors

- [constructor](DAIBridgeAdapter#constructor)

### Properties

- [estimateGas](DAIBridgeAdapter#estimategas)
- [l1Bridge](DAIBridgeAdapter#l1bridge)
- [l2Bridge](DAIBridgeAdapter#l2bridge)
- [messenger](DAIBridgeAdapter#messenger)
- [populateTransaction](DAIBridgeAdapter#populatetransaction)

### Methods

- [approval](DAIBridgeAdapter#approval)
- [approve](DAIBridgeAdapter#approve)
- [deposit](DAIBridgeAdapter#deposit)
- [getDepositsByAddress](DAIBridgeAdapter#getdepositsbyaddress)
- [getWithdrawalsByAddress](DAIBridgeAdapter#getwithdrawalsbyaddress)
- [supportsTokenPair](DAIBridgeAdapter#supportstokenpair)
- [withdraw](DAIBridgeAdapter#withdraw)

## Constructors

### constructor

• **new DAIBridgeAdapter**(`opts`)

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

[src/adapters/standard-bridge.ts:44](https://github.com/morph-l2/sdk/tree/97c4394/src/adapters/standard-bridge.ts#L44)

## Properties

### estimateGas

• **estimateGas**: `Object`

Object that holds the functions that estimates the gas required for a given transaction.
Follows the pattern used by ethers.js.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `approve` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: \{ `overrides?`: `CallOverrides`  \}) \=&gt; `Promise`&lt;`BigNumber`&gt; |
| `deposit` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: \{ `l2GasLimit?`: [`NumberLike`](../modules#numberlike) ; `overrides?`: `CallOverrides` ; `recipient?`: [`AddressLike`](../modules#addresslike)  \}) \=&gt; `Promise`&lt;`BigNumber`&gt; |
| `withdraw` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: \{ `overrides?`: `CallOverrides` ; `recipient?`: [`AddressLike`](../modules#addresslike)  \}) \=&gt; `Promise`&lt;`BigNumber`&gt; |

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[estimateGas](StandardBridgeAdapter#estimategas)

#### Defined in

[src/adapters/standard-bridge.ts:357](https://github.com/morph-l2/sdk/tree/97c4394/src/adapters/standard-bridge.ts#L357)

___

### l1Bridge

• **l1Bridge**: `Contract`

L1 bridge contract.

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[l1Bridge](StandardBridgeAdapter#l1bridge)

#### Defined in

[src/adapters/standard-bridge.ts:33](https://github.com/morph-l2/sdk/tree/97c4394/src/adapters/standard-bridge.ts#L33)

___

### l2Bridge

• **l2Bridge**: `Contract`

L2 bridge contract.

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[l2Bridge](StandardBridgeAdapter#l2bridge)

#### Defined in

[src/adapters/standard-bridge.ts:34](https://github.com/morph-l2/sdk/tree/97c4394/src/adapters/standard-bridge.ts#L34)

___

### messenger

• **messenger**: [`CrossChainMessenger`](CrossChainMessenger)

Provider used to make queries related to cross-chain interactions.

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[messenger](StandardBridgeAdapter#messenger)

#### Defined in

[src/adapters/standard-bridge.ts:32](https://github.com/morph-l2/sdk/tree/97c4394/src/adapters/standard-bridge.ts#L32)

___

### populateTransaction

• **populateTransaction**: `Object`

Object that holds the functions that generate transactions to be signed by the user.
Follows the pattern used by ethers.js.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `approve` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: \{ `overrides?`: `Overrides`  \}) \=&gt; `Promise`&lt;`TransactionRequest`&gt; |
| `deposit` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: \{ `l2GasLimit?`: [`NumberLike`](../modules#numberlike) ; `overrides?`: `Overrides` ; `recipient?`: [`AddressLike`](../modules#addresslike)  \}) \=&gt; `Promise`&lt;`TransactionRequest`&gt; |
| `withdraw` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: \{ `overrides?`: `Overrides` ; `recipient?`: [`AddressLike`](../modules#addresslike)  \}) \=&gt; `Promise`&lt;`TransactionRequest`&gt; |

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[populateTransaction](StandardBridgeAdapter#populatetransaction)

#### Defined in

[src/adapters/standard-bridge.ts:261](https://github.com/morph-l2/sdk/tree/97c4394/src/adapters/standard-bridge.ts#L261)

## Methods

### approval

▸ **approval**(`l1Token`, `l2Token`, `signer`): `Promise`&lt;`BigNumber`&gt;

Queries the account's approval amount for a given L1 token.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l1Token` | [`AddressLike`](../modules#addresslike) | The L1 token address. |
| `l2Token` | [`AddressLike`](../modules#addresslike) | The L2 token address. |
| `signer` | `Signer` | Signer to query the approval for. |

#### Returns

`Promise`&lt;`BigNumber`&gt;

Amount of tokens approved for deposits from the account.

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[approval](StandardBridgeAdapter#approval)

#### Defined in

[src/adapters/standard-bridge.ts:198](https://github.com/morph-l2/sdk/tree/97c4394/src/adapters/standard-bridge.ts#L198)

___

### approve

▸ **approve**(`l1Token`, `l2Token`, `amount`, `signer`, `opts?`): `Promise`&lt;`TransactionResponse`&gt;

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

`Promise`&lt;`TransactionResponse`&gt;

Transaction response for the approval transaction.

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[approve](StandardBridgeAdapter#approve)

#### Defined in

[src/adapters/standard-bridge.ts:216](https://github.com/morph-l2/sdk/tree/97c4394/src/adapters/standard-bridge.ts#L216)

___

### deposit

▸ **deposit**(`l1Token`, `l2Token`, `amount`, `signer`, `opts?`): `Promise`&lt;`TransactionResponse`&gt;

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

`Promise`&lt;`TransactionResponse`&gt;

Transaction response for the deposit transaction.

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[deposit](StandardBridgeAdapter#deposit)

#### Defined in

[src/adapters/standard-bridge.ts:230](https://github.com/morph-l2/sdk/tree/97c4394/src/adapters/standard-bridge.ts#L230)

___

### getDepositsByAddress

▸ **getDepositsByAddress**(`address`, `opts?`): `Promise`&lt;[`TokenBridgeMessage`](../interfaces/TokenBridgeMessage)[]&gt;

Gets all deposits for a given address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`AddressLike`](../modules#addresslike) | Address to search for messages from. |
| `opts?` | `Object` | Options object. |
| `opts.fromBlock?` | `BlockTag` | - |
| `opts.toBlock?` | `BlockTag` | - |

#### Returns

`Promise`&lt;[`TokenBridgeMessage`](../interfaces/TokenBridgeMessage)[]&gt;

All deposit token bridge messages sent by the given address.

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[getDepositsByAddress](StandardBridgeAdapter#getdepositsbyaddress)

#### Defined in

[src/adapters/standard-bridge.ts:62](https://github.com/morph-l2/sdk/tree/97c4394/src/adapters/standard-bridge.ts#L62)

___

### getWithdrawalsByAddress

▸ **getWithdrawalsByAddress**(`address`, `opts?`): `Promise`&lt;[`TokenBridgeMessage`](../interfaces/TokenBridgeMessage)[]&gt;

Gets all withdrawals for a given address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`AddressLike`](../modules#addresslike) | Address to search for messages from. |
| `opts?` | `Object` | Options object. |
| `opts.fromBlock?` | `BlockTag` | - |
| `opts.toBlock?` | `BlockTag` | - |

#### Returns

`Promise`&lt;[`TokenBridgeMessage`](../interfaces/TokenBridgeMessage)[]&gt;

All withdrawal token bridge messages sent by the given address.

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[getWithdrawalsByAddress](StandardBridgeAdapter#getwithdrawalsbyaddress)

#### Defined in

[src/adapters/standard-bridge.ts:109](https://github.com/morph-l2/sdk/tree/97c4394/src/adapters/standard-bridge.ts#L109)

___

### supportsTokenPair

▸ **supportsTokenPair**(`l1Token`, `l2Token`): `Promise`&lt;`boolean`&gt;

Checks whether the given token pair is supported by the bridge.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l1Token` | [`AddressLike`](../modules#addresslike) | The L1 token address. |
| `l2Token` | [`AddressLike`](../modules#addresslike) | The L2 token address. |

#### Returns

`Promise`&lt;`boolean`&gt;

Whether the given token pair is supported by the bridge.

#### Overrides

[StandardBridgeAdapter](StandardBridgeAdapter).[supportsTokenPair](StandardBridgeAdapter#supportstokenpair)

#### Defined in

[src/adapters/dai-bridge.ts:13](https://github.com/morph-l2/sdk/tree/97c4394/src/adapters/dai-bridge.ts#L13)

___

### withdraw

▸ **withdraw**(`l1Token`, `l2Token`, `amount`, `signer`, `opts?`): `Promise`&lt;`TransactionResponse`&gt;

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

`Promise`&lt;`TransactionResponse`&gt;

Transaction response for the withdraw transaction.

#### Inherited from

[StandardBridgeAdapter](StandardBridgeAdapter).[withdraw](StandardBridgeAdapter#withdraw)

#### Defined in

[src/adapters/standard-bridge.ts:246](https://github.com/morph-l2/sdk/tree/97c4394/src/adapters/standard-bridge.ts#L246)
