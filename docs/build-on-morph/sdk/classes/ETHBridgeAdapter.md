[**@morph-l2/sdk**](../README.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / ETHBridgeAdapter

# Class: ETHBridgeAdapter

Bridge adapter for the ETH bridge.

## Extends

- [`StandardBridgeAdapter`](StandardBridgeAdapter.md)

## Constructors

### new ETHBridgeAdapter()

> **new ETHBridgeAdapter**(`opts`): [`ETHBridgeAdapter`](ETHBridgeAdapter.md)

Creates a StandardBridgeAdapter instance.

#### Parameters

• **opts**

Options for the adapter.

• **opts.l1Bridge**: [`AddressLike`](../type-aliases/AddressLike.md)

L1 bridge contract.

• **opts.l2Bridge**: [`AddressLike`](../type-aliases/AddressLike.md)

L2 bridge contract.

• **opts.messenger**: [`CrossChainMessenger`](CrossChainMessenger.md)

Provider used to make queries related to cross-chain interactions.

#### Returns

[`ETHBridgeAdapter`](ETHBridgeAdapter.md)

#### Inherited from

[`StandardBridgeAdapter`](StandardBridgeAdapter.md).[`constructor`](StandardBridgeAdapter.md#constructors)

#### Source

src/adapters/standard-bridge.ts:51

## Properties

### estimateGas

> **estimateGas**: `object`

Object that holds the functions that estimates the gas required for a given transaction.
Follows the pattern used by ethers.js.

#### approve()

> **approve**: (`l1Token`, `l2Token`, `amount`, `opts`?) => `Promise`\<`BigNumber`\>

##### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

• **opts?**

• **opts.overrides?**: `CallOverrides`

##### Returns

`Promise`\<`BigNumber`\>

#### deposit()

> **deposit**: (`l1Token`, `l2Token`, `amount`, `opts`?) => `Promise`\<`BigNumber`\>

##### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

• **opts?**

• **opts.l2GasLimit?**: [`NumberLike`](../type-aliases/NumberLike.md)

• **opts.overrides?**: `CallOverrides`

• **opts.recipient?**: [`AddressLike`](../type-aliases/AddressLike.md)

##### Returns

`Promise`\<`BigNumber`\>

#### withdraw()

> **withdraw**: (`l1Token`, `l2Token`, `amount`, `opts`?) => `Promise`\<`BigNumber`\>

##### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

• **opts?**

• **opts.overrides?**: `CallOverrides`

• **opts.recipient?**: [`AddressLike`](../type-aliases/AddressLike.md)

##### Returns

`Promise`\<`BigNumber`\>

#### Inherited from

[`StandardBridgeAdapter`](StandardBridgeAdapter.md).[`estimateGas`](StandardBridgeAdapter.md#estimategas)

#### Source

src/adapters/standard-bridge.ts:447

***

### l1Bridge

> **l1Bridge**: `Contract`

L1 bridge contract.

#### Inherited from

[`StandardBridgeAdapter`](StandardBridgeAdapter.md).[`l1Bridge`](StandardBridgeAdapter.md#l1bridge)

#### Source

src/adapters/standard-bridge.ts:40

***

### l2Bridge

> **l2Bridge**: `Contract`

L2 bridge contract.

#### Inherited from

[`StandardBridgeAdapter`](StandardBridgeAdapter.md).[`l2Bridge`](StandardBridgeAdapter.md#l2bridge)

#### Source

src/adapters/standard-bridge.ts:41

***

### messenger

> **messenger**: [`CrossChainMessenger`](CrossChainMessenger.md)

Provider used to make queries related to cross-chain interactions.

#### Inherited from

[`StandardBridgeAdapter`](StandardBridgeAdapter.md).[`messenger`](StandardBridgeAdapter.md#messenger)

#### Source

src/adapters/standard-bridge.ts:39

***

### populateTransaction

> **populateTransaction**: `object`

Object that holds the functions that generate transactions to be signed by the user.
Follows the pattern used by ethers.js.

#### approve()

> **approve**: (`l1Token`, `l2Token`, `amount`, `opts`?) => `Promise`\<`never`\>

##### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

• **opts?**

• **opts.overrides?**: `Overrides`

##### Returns

`Promise`\<`never`\>

#### deposit()

> **deposit**: (`l1Token`, `l2Token`, `amount`, `opts`) => `Promise`\<`TransactionRequest`\>

##### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

• **opts**

• **opts.l2GasLimit**: [`NumberLike`](../type-aliases/NumberLike.md)

• **opts.overrides?**: `Overrides`

• **opts.recipient**: [`AddressLike`](../type-aliases/AddressLike.md)

##### Returns

`Promise`\<`TransactionRequest`\>

#### withdraw()

> **withdraw**: (`l1Token`, `l2Token`, `amount`, `opts`) => `Promise`\<`TransactionRequest`\>

##### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

• **opts**

• **opts.overrides?**: `Overrides`

• **opts.recipient**: [`AddressLike`](../type-aliases/AddressLike.md)

##### Returns

`Promise`\<`TransactionRequest`\>

#### Overrides

[`StandardBridgeAdapter`](StandardBridgeAdapter.md).[`populateTransaction`](StandardBridgeAdapter.md#populatetransaction)

#### Source

src/adapters/eth-bridge.ts:120

## Methods

### approval()

> **approval**(`l1Token`, `l2Token`, `opts`?): `Promise`\<`BigNumber`\>

Queries the account's approval amount for a given L1 token.

#### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L1 token address.

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L2 token address.

• **opts?**

• **opts.direction?**: [`MessageDirection`](../enumerations/MessageDirection.md)

• **opts.overrides?**: `Overrides`

• **opts.signer?**: `Signer`

#### Returns

`Promise`\<`BigNumber`\>

Amount of tokens approved for deposits from the account.

#### Overrides

[`StandardBridgeAdapter`](StandardBridgeAdapter.md).[`approval`](StandardBridgeAdapter.md#approval)

#### Source

src/adapters/eth-bridge.ts:22

***

### approve()

> **approve**(`l1Token`, `l2Token`, `amount`, `signer`, `opts`?): `Promise`\<`TransactionResponse`\>

Approves a deposit into the L2 chain.

#### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L1 token address.

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L2 token address.

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

Amount of the token to approve.

• **signer**: `Signer`

Signer used to sign and send the transaction.

• **opts?**

Additional options.

• **opts.direction?**: [`MessageDirection`](../enumerations/MessageDirection.md)

• **opts.overrides?**: `Overrides`

#### Returns

`Promise`\<`TransactionResponse`\>

Transaction response for the approval transaction.

#### Inherited from

[`StandardBridgeAdapter`](StandardBridgeAdapter.md).[`approve`](StandardBridgeAdapter.md#approve-2)

#### Source

src/adapters/standard-bridge.ts:275

***

### deposit()

> **deposit**(`l1Token`, `l2Token`, `amount`, `signer`, `opts`?): `Promise`\<`TransactionResponse`\>

Deposits some tokens into the L2 chain.

#### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L1 token address.

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L2 token address.

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

Amount of the token to deposit.

• **signer**: `Signer`

Signer used to sign and send the transaction.

• **opts?**

Additional options.

• **opts.l2GasLimit?**: [`NumberLike`](../type-aliases/NumberLike.md)

• **opts.overrides?**: `Overrides`

• **opts.recipient?**: [`AddressLike`](../type-aliases/AddressLike.md)

#### Returns

`Promise`\<`TransactionResponse`\>

Transaction response for the deposit transaction.

#### Inherited from

[`StandardBridgeAdapter`](StandardBridgeAdapter.md).[`deposit`](StandardBridgeAdapter.md#deposit-2)

#### Source

src/adapters/standard-bridge.ts:290

***

### getDepositsByAddress()

> **getDepositsByAddress**(`address`, `opts`?): `Promise`\<[`TokenBridgeMessage`](../interfaces/TokenBridgeMessage.md)[]\>

Gets all deposits for a given address.

#### Parameters

• **address**: [`AddressLike`](../type-aliases/AddressLike.md)

Address to search for messages from.

• **opts?**

Options object.

• **opts.fromBlock?**: `BlockTag`

• **opts.toBlock?**: `BlockTag`

#### Returns

`Promise`\<[`TokenBridgeMessage`](../interfaces/TokenBridgeMessage.md)[]\>

All deposit token bridge messages sent by the given address.

#### Overrides

[`StandardBridgeAdapter`](StandardBridgeAdapter.md).[`getDepositsByAddress`](StandardBridgeAdapter.md#getdepositsbyaddress)

#### Source

src/adapters/eth-bridge.ts:34

***

### getWithdrawalsByAddress()

> **getWithdrawalsByAddress**(`address`, `opts`?): `Promise`\<[`TokenBridgeMessage`](../interfaces/TokenBridgeMessage.md)[]\>

Gets all withdrawals for a given address.

#### Parameters

• **address**: [`AddressLike`](../type-aliases/AddressLike.md)

Address to search for messages from.

• **opts?**

Options object.

• **opts.fromBlock?**: `BlockTag`

• **opts.toBlock?**: `BlockTag`

#### Returns

`Promise`\<[`TokenBridgeMessage`](../interfaces/TokenBridgeMessage.md)[]\>

All withdrawal token bridge messages sent by the given address.

#### Overrides

[`StandardBridgeAdapter`](StandardBridgeAdapter.md).[`getWithdrawalsByAddress`](StandardBridgeAdapter.md#getwithdrawalsbyaddress)

#### Source

src/adapters/eth-bridge.ts:68

***

### supportsTokenPair()

> **supportsTokenPair**(`l1Token`, `l2Token`): `Promise`\<`boolean`\>

Checks whether the given token pair is supported by the bridge.

#### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L1 token address.

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L2 token address.

#### Returns

`Promise`\<`boolean`\>

Whether the given token pair is supported by the bridge.

#### Overrides

[`StandardBridgeAdapter`](StandardBridgeAdapter.md).[`supportsTokenPair`](StandardBridgeAdapter.md#supportstokenpair)

#### Source

src/adapters/eth-bridge.ts:109

***

### withdraw()

> **withdraw**(`l1Token`, `l2Token`, `amount`, `signer`, `opts`?): `Promise`\<`TransactionResponse`\>

Withdraws some tokens back to the L1 chain.

#### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L1 token address.

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L2 token address.

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

Amount of the token to withdraw.

• **signer**: `Signer`

Signer used to sign and send the transaction.

• **opts?**

Additional options.

• **opts.overrides?**: `Overrides`

• **opts.recipient?**: [`AddressLike`](../type-aliases/AddressLike.md)

#### Returns

`Promise`\<`TransactionResponse`\>

Transaction response for the withdraw transaction.

#### Inherited from

[`StandardBridgeAdapter`](StandardBridgeAdapter.md).[`withdraw`](StandardBridgeAdapter.md#withdraw-2)

#### Source

src/adapters/standard-bridge.ts:306
