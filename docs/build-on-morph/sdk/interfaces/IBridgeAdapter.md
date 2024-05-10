[**@morph-l2/sdk**](../README.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / IBridgeAdapter

# Interface: IBridgeAdapter

Represents an adapter for an L1L2 token bridge. Each custom bridge currently needs its own
adapter because the bridge interface is not standardized. This may change in the future.

## Properties

### estimateGas

 **estimateGas**: `object`

Object that holds the functions that estimates the gas required for a given transaction.
Follows the pattern used by ethers.js.

#### approve()

Estimates gas required to approve some tokens to deposit into the L2 chain.

##### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L1 token address.

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L2 token address.

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

Amount of the token to approve.

• **opts?**

Additional options.

• **opts.overrides?**: `CallOverrides`

Optional transaction overrides.

##### Returns

`Promise`\`BigNumber`\

Gas estimate for the transaction.

#### deposit()

Estimates gas required to deposit some tokens into the L2 chain.

##### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L1 token address.

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L2 token address.

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

Amount of the token to deposit.

• **opts?**

Additional options.

• **opts.l2GasLimit?**: [`NumberLike`](../type-aliases/NumberLike.md)

Optional gas limit to use for the transaction on L2.

• **opts.overrides?**: `CallOverrides`

Optional transaction overrides.

• **opts.recipient?**: [`AddressLike`](../type-aliases/AddressLike.md)

Optional address to receive the funds on L2. Defaults to sender.

##### Returns

`Promise`\`BigNumber`\

Gas estimate for the transaction.

#### withdraw()

Estimates gas required to withdraw some tokens back to the L1 chain.

##### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L1 token address.

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L2 token address.

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

Amount of the token to withdraw.

• **opts?**

Additional options.

• **opts.overrides?**: `CallOverrides`

Optional transaction overrides.

• **opts.recipient?**: [`AddressLike`](../type-aliases/AddressLike.md)

Optional address to receive the funds on L1. Defaults to sender.

##### Returns

`Promise`\`BigNumber`\

Gas estimate for the transaction.

#### Source

src/interfaces/bridge-adapter.ts:255

***

### l1Bridge

 **l1Bridge**: `Contract`

L1 bridge contract.

#### Source

src/interfaces/bridge-adapter.ts:37

***

### l2Bridge

 **l2Bridge**: `Contract`

L2 bridge contract.

#### Source

src/interfaces/bridge-adapter.ts:42

***

### messenger

 **messenger**: [`CrossChainMessenger`](../classes/CrossChainMessenger.md)

Provider used to make queries related to cross-chain interactions.

#### Source

src/interfaces/bridge-adapter.ts:32

***

### populateTransaction

 **populateTransaction**: `object`

Object that holds the functions that generate transactions to be signed by the user.
Follows the pattern used by ethers.js.

#### approve()

Generates a transaction for approving some tokens to deposit into the L2 chain.

##### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L1 token address.

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L2 token address.

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

Amount of the token to approve.

• **opts?**

Additional options.

• **opts.overrides?**: `CallOverrides`

Optional transaction overrides.

##### Returns

`Promise`\`TransactionRequest`\

Transaction that can be signed and executed to deposit the tokens.

#### deposit()

Generates a transaction for depositing some tokens into the L2 chain.

##### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L1 token address.

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L2 token address.

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

Amount of the token to deposit.

• **opts?**

Additional options.

• **opts.direction?**: [`MessageDirection`](../enumerations/MessageDirection.md)

• **opts.l2GasLimit?**: [`NumberLike`](../type-aliases/NumberLike.md)

Optional gas limit to use for the transaction on L2.

• **opts.overrides?**: `PayableOverrides`

Optional transaction overrides.

• **opts.recipient?**: [`AddressLike`](../type-aliases/AddressLike.md)

Optional address to receive the funds on L2. Defaults to sender.

##### Returns

`Promise`\`TransactionRequest`\

Transaction that can be signed and executed to deposit the tokens.

#### withdraw()

Generates a transaction for withdrawing some tokens back to the L1 chain.

##### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L1 token address.

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L2 token address.

• **amount**: [`NumberLike`](../type-aliases/NumberLike.md)

Amount of the token to withdraw.

• **opts?**

Additional options.

• **opts.overrides?**: `Overrides`

Optional transaction overrides.

• **opts.recipient?**: [`AddressLike`](../type-aliases/AddressLike.md)

Optional address to receive the funds on L1. Defaults to sender.

##### Returns

`Promise`\`TransactionRequest`\

Transaction that can be signed and executed to withdraw the tokens.

#### Source

src/interfaces/bridge-adapter.ts:185

## Methods

### approval()

 **approval**(`l1Token`, `l2Token`, `opts`?): `Promise`\`BigNumber`\

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

`Promise`\`BigNumber`\

Amount of tokens approved for deposits from the account.

#### Source

src/interfaces/bridge-adapter.ts:102

***

### approve()

 **approve**(`l1Token`, `l2Token`, `amount`, `signer`, `opts`?): `Promise`\`TransactionResponse`\

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

• **opts.overrides?**: `Overrides`

Optional transaction overrides.

#### Returns

`Promise`\`TransactionResponse`\

Transaction response for the approval transaction.

#### Source

src/interfaces/bridge-adapter.ts:123

***

### deposit()

 **deposit**(`l1Token`, `l2Token`, `amount`, `signer`, `opts`?): `Promise`\`TransactionResponse`\

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

Optional gas limit to use for the transaction on L2.

• **opts.overrides?**: `Overrides`

Optional transaction overrides.

• **opts.recipient?**: [`AddressLike`](../type-aliases/AddressLike.md)

Optional address to receive the funds on L2. Defaults to sender.

#### Returns

`Promise`\`TransactionResponse`\

Transaction response for the deposit transaction.

#### Source

src/interfaces/bridge-adapter.ts:146

***

### getDepositsByAddress()

 **getDepositsByAddress**(`address`, `opts`?): `Promise`\[`TokenBridgeMessage`](TokenBridgeMessage.md)[]\

Gets all deposits for a given address.

#### Parameters

• **address**: [`AddressLike`](../type-aliases/AddressLike.md)

Address to search for messages from.

• **opts?**

Options object.

• **opts.fromBlock?**: `BlockTag`

Block to start searching for messages from. If not provided, will start
from the first block (block #0).

• **opts.toBlock?**: `BlockTag`

Block to stop searching for messages at. If not provided, will stop at the
latest known block ("latest").

#### Returns

`Promise`\[`TokenBridgeMessage`](TokenBridgeMessage.md)[]\

All deposit token bridge messages sent by the given address.

#### Source

src/interfaces/bridge-adapter.ts:55

***

### getWithdrawalsByAddress()

 **getWithdrawalsByAddress**(`address`, `opts`?): `Promise`\[`TokenBridgeMessage`](TokenBridgeMessage.md)[]\

Gets all withdrawals for a given address.

#### Parameters

• **address**: [`AddressLike`](../type-aliases/AddressLike.md)

Address to search for messages from.

• **opts?**

Options object.

• **opts.fromBlock?**: `BlockTag`

Block to start searching for messages from. If not provided, will start
from the first block (block #0).

• **opts.toBlock?**: `BlockTag`

Block to stop searching for messages at. If not provided, will stop at the
latest known block ("latest").

#### Returns

`Promise`\[`TokenBridgeMessage`](TokenBridgeMessage.md)[]\

All withdrawal token bridge messages sent by the given address.

#### Source

src/interfaces/bridge-adapter.ts:74

***

### supportsTokenPair()

 **supportsTokenPair**(`l1Token`, `l2Token`): `Promise`\`boolean`\

Checks whether the given token pair is supported by the bridge.

#### Parameters

• **l1Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L1 token address.

• **l2Token**: [`AddressLike`](../type-aliases/AddressLike.md)

The L2 token address.

#### Returns

`Promise`\`boolean`\

Whether the given token pair is supported by the bridge.

#### Source

src/interfaces/bridge-adapter.ts:89

***

### withdraw()

 **withdraw**(`l1Token`, `l2Token`, `amount`, `signer`, `opts`?): `Promise`\`TransactionResponse`\

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

Optional transaction overrides.

• **opts.recipient?**: [`AddressLike`](../type-aliases/AddressLike.md)

Optional address to receive the funds on L1. Defaults to sender.

#### Returns

`Promise`\`TransactionResponse`\

Transaction response for the withdraw transaction.

#### Source

src/interfaces/bridge-adapter.ts:170
