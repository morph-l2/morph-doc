[**@morph-l2/sdk**](../README.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / StandardBridgeAdapter

# Class: StandardBridgeAdapter

Bridge adapter for any token bridge that uses the standard token bridge interface.

## Extended by

- [`ETHBridgeAdapter`](ETHBridgeAdapter.md)

## Implements

- [`IBridgeAdapter`](../interfaces/IBridgeAdapter.md)

## Constructors

### new StandardBridgeAdapter()

> **new StandardBridgeAdapter**(`opts`): [`StandardBridgeAdapter`](StandardBridgeAdapter.md)

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

[`StandardBridgeAdapter`](StandardBridgeAdapter.md)

#### Source

src/adapters/standard-bridge.ts:52

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

• **opts?**: [`IActionOptions`](../interfaces/IActionOptions.md)

##### Returns

`Promise`\<`BigNumber`\>

#### deposit()

> **deposit**: (`l1Token`, `l2Token`, `amount`, `opts`?) => `Promise`\<`BigNumber`\>

##### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

• **opts?**: [`IActionOptions`](../interfaces/IActionOptions.md)

##### Returns

`Promise`\<`BigNumber`\>

#### withdraw()

> **withdraw**: (`l1Token`, `l2Token`, `amount`, `opts`?) => `Promise`\<`BigNumber`\>

##### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

• **opts?**: [`IActionOptions`](../interfaces/IActionOptions.md)

##### Returns

`Promise`\<`BigNumber`\>

#### Implementation of

[`IBridgeAdapter`](../interfaces/IBridgeAdapter.md).[`estimateGas`](../interfaces/IBridgeAdapter.md#estimategas)

#### Source

src/adapters/standard-bridge.ts:405

***

### l1Bridge

> **l1Bridge**: `Contract`

L1 bridge contract.

#### Implementation of

[`IBridgeAdapter`](../interfaces/IBridgeAdapter.md).[`l1Bridge`](../interfaces/IBridgeAdapter.md#l1bridge)

#### Source

src/adapters/standard-bridge.ts:41

***

### l2Bridge

> **l2Bridge**: `Contract`

L2 bridge contract.

#### Implementation of

[`IBridgeAdapter`](../interfaces/IBridgeAdapter.md).[`l2Bridge`](../interfaces/IBridgeAdapter.md#l2bridge)

#### Source

src/adapters/standard-bridge.ts:42

***

### messenger

> **messenger**: [`CrossChainMessenger`](CrossChainMessenger.md)

Provider used to make queries related to cross-chain interactions.

#### Implementation of

[`IBridgeAdapter`](../interfaces/IBridgeAdapter.md).[`messenger`](../interfaces/IBridgeAdapter.md#messenger)

#### Source

src/adapters/standard-bridge.ts:40

***

### populateTransaction

> **populateTransaction**: `object`

Object that holds the functions that generate transactions to be signed by the user.
Follows the pattern used by ethers.js.

#### approve()

> **approve**: (`l1Token`, `l2Token`, `amount`, `opts`?) => `Promise`\<`TransactionRequest`\>

##### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

• **opts?**: [`IActionOptions`](../interfaces/IActionOptions.md)

##### Returns

`Promise`\<`TransactionRequest`\>

#### deposit()

> **deposit**: (`l1Token`, `l2Token`, `amount`, `opts`?) => `Promise`\<`TransactionRequest`\>

##### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

• **opts?**: [`IActionOptions`](../interfaces/IActionOptions.md)

##### Returns

`Promise`\<`TransactionRequest`\>

#### withdraw()

> **withdraw**: (`l1Token`, `l2Token`, `amount`, `opts`?) => `Promise`\<`TransactionRequest`\>

##### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

• **opts?**: [`IActionOptions`](../interfaces/IActionOptions.md)

##### Returns

`Promise`\<`TransactionRequest`\>

#### Implementation of

[`IBridgeAdapter`](../interfaces/IBridgeAdapter.md).[`populateTransaction`](../interfaces/IBridgeAdapter.md#populatetransaction)

#### Source

src/adapters/standard-bridge.ts:286

## Methods

### approval()

> **approval**(`l1Token`, `l2Token`, `opts`): `Promise`\<`BigNumber`\>

Queries the account's approval amount for a given L1 token.

#### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L1 token address.

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L2 token address.

• **opts**: [`IActionOptions`](../interfaces/IActionOptions.md)

Additional options.

#### Returns

`Promise`\<`BigNumber`\>

Amount of tokens approved for deposits from the account.

#### Implementation of

[`IBridgeAdapter`](../interfaces/IBridgeAdapter.md).[`approval`](../interfaces/IBridgeAdapter.md#approval)

#### Source

src/adapters/standard-bridge.ts:209

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

• **opts?**: [`IActionOptions`](../interfaces/IActionOptions.md)

Additional options.

#### Returns

`Promise`\<`TransactionResponse`\>

Transaction response for the approval transaction.

#### Implementation of

[`IBridgeAdapter`](../interfaces/IBridgeAdapter.md).[`approve`](../interfaces/IBridgeAdapter.md#approve-2)

#### Source

src/adapters/standard-bridge.ts:250

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

• **opts?**: [`IActionOptions`](../interfaces/IActionOptions.md)

Additional options.

#### Returns

`Promise`\<`TransactionResponse`\>

Transaction response for the deposit transaction.

#### Implementation of

[`IBridgeAdapter`](../interfaces/IBridgeAdapter.md).[`deposit`](../interfaces/IBridgeAdapter.md#deposit-2)

#### Source

src/adapters/standard-bridge.ts:262

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

#### Implementation of

[`IBridgeAdapter`](../interfaces/IBridgeAdapter.md).[`getDepositsByAddress`](../interfaces/IBridgeAdapter.md#getdepositsbyaddress)

#### Source

src/adapters/standard-bridge.ts:75

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

#### Implementation of

[`IBridgeAdapter`](../interfaces/IBridgeAdapter.md).[`getWithdrawalsByAddress`](../interfaces/IBridgeAdapter.md#getwithdrawalsbyaddress)

#### Source

src/adapters/standard-bridge.ts:122

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

#### Implementation of

[`IBridgeAdapter`](../interfaces/IBridgeAdapter.md).[`supportsTokenPair`](../interfaces/IBridgeAdapter.md#supportstokenpair)

#### Source

src/adapters/standard-bridge.ts:165

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

• **opts?**: [`IActionOptions`](../interfaces/IActionOptions.md)

Additional options.

#### Returns

`Promise`\<`TransactionResponse`\>

Transaction response for the withdraw transaction.

#### Implementation of

[`IBridgeAdapter`](../interfaces/IBridgeAdapter.md).[`withdraw`](../interfaces/IBridgeAdapter.md#withdraw-2)

#### Source

src/adapters/standard-bridge.ts:274
