[@morph-l2/sdk](../intro) / [Exports](../modules) / CrossChainMessenger

# Class: CrossChainMessenger

## Table of contents

### Constructors

- [constructor](CrossChainMessenger#constructor)

### Properties

- [backendURL](CrossChainMessenger#backendurl)
- [bridges](CrossChainMessenger#bridges)
- [contracts](CrossChainMessenger#contracts)
- [depositConfirmationBlocks](CrossChainMessenger#depositconfirmationblocks)
- [estimateGas](CrossChainMessenger#estimategas)
- [l1BlockTimeSeconds](CrossChainMessenger#l1blocktimeseconds)
- [l1ChainId](CrossChainMessenger#l1chainid)
- [l1SignerOrProvider](CrossChainMessenger#l1signerorprovider)
- [l2ChainId](CrossChainMessenger#l2chainid)
- [l2SignerOrProvider](CrossChainMessenger#l2signerorprovider)
- [populateTransaction](CrossChainMessenger#populatetransaction)

### Accessors

- [l1Provider](CrossChainMessenger#l1provider)
- [l1Signer](CrossChainMessenger#l1signer)
- [l2Provider](CrossChainMessenger#l2provider)
- [l2Signer](CrossChainMessenger#l2signer)

### Methods

- [approval](CrossChainMessenger#approval)
- [approveERC20](CrossChainMessenger#approveerc20)
- [depositERC20](CrossChainMessenger#depositerc20)
- [depositETH](CrossChainMessenger#depositeth)
- [estimateL2MessageGasLimit](CrossChainMessenger#estimatel2messagegaslimit)
- [estimateMessageWaitTimeSeconds](CrossChainMessenger#estimatemessagewaittimeseconds)
- [finalizeMessage](CrossChainMessenger#finalizemessage)
- [getBackendTreeSyncIndex](CrossChainMessenger#getbackendtreesyncindex)
- [getBridgeForTokenPair](CrossChainMessenger#getbridgefortokenpair)
- [getChallengePeriodSeconds](CrossChainMessenger#getchallengeperiodseconds)
- [getDepositsByAddress](CrossChainMessenger#getdepositsbyaddress)
- [getMessageReceipt](CrossChainMessenger#getmessagereceipt)
- [getMessageStatus](CrossChainMessenger#getmessagestatus)
- [getMessagesByTransaction](CrossChainMessenger#getmessagesbytransaction)
- [getProvenWithdrawal](CrossChainMessenger#getprovenwithdrawal)
- [getWithdrawMessageProof](CrossChainMessenger#getwithdrawmessageproof)
- [getWithdrawalsByAddress](CrossChainMessenger#getwithdrawalsbyaddress)
- [proveMessage](CrossChainMessenger#provemessage)
- [resendMessage](CrossChainMessenger#resendmessage)
- [sendMessage](CrossChainMessenger#sendmessage)
- [toBedrockCrossChainMessage](CrossChainMessenger#tobedrockcrosschainmessage)
- [toCrossChainMessage](CrossChainMessenger#tocrosschainmessage)
- [toLowLevelMessage](CrossChainMessenger#tolowlevelmessage)
- [waitForMessageReceipt](CrossChainMessenger#waitformessagereceipt)
- [waitForMessageStatus](CrossChainMessenger#waitformessagestatus)
- [withdrawERC20](CrossChainMessenger#withdrawerc20)
- [withdrawETH](CrossChainMessenger#withdraweth)

## Constructors

### constructor

• **new CrossChainMessenger**(`opts`)

Creates a new CrossChainProvider instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | `Object` | Options for the provider. |
| `opts.backendURL?` | `string` | backend for withdraw proof gen. |
| `opts.bridges?` | [`BridgeAdapterData`](../interfaces/BridgeAdapterData) | Optional bridge address list. |
| `opts.contracts?` | [`DeepPartial`](../modules#deeppartial)<[`OEContractsLike`](../interfaces/OEContractsLike)\> | Optional contract address overrides. |
| `opts.depositConfirmationBlocks?` | [`NumberLike`](../modules#numberlike) | Optional number of blocks before a deposit is confirmed. |
| `opts.l1BlockTimeSeconds?` | [`NumberLike`](../modules#numberlike) | Optional estimated block time in seconds for the L1 chain. |
| `opts.l1ChainId` | [`NumberLike`](../modules#numberlike) | Chain ID for the L1 chain. |
| `opts.l1SignerOrProvider` | [`SignerOrProviderLike`](../modules#signerorproviderlike) | Signer or Provider for the L1 chain, or a JSON-RPC url. |
| `opts.l2ChainId` | [`NumberLike`](../modules#numberlike) | Chain ID for the L2 chain. |
| `opts.l2SignerOrProvider` | [`SignerOrProviderLike`](../modules#signerorproviderlike) | Signer or Provider for the L2 chain, or a JSON-RPC url. |

#### Defined in

[src/cross-chain-messenger.ts:130](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L130)

## Properties

### backendURL

• **backendURL**: `string`

Backend url for withdrawal prove server

#### Defined in

[src/cross-chain-messenger.ts:73](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L73)

___

### bridges

• **bridges**: [`BridgeAdapters`](../interfaces/BridgeAdapters)

List of custom bridges for the given network.

#### Defined in

[src/cross-chain-messenger.ts:103](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L103)

___

### contracts

• **contracts**: [`OEContracts`](../interfaces/OEContracts)

Contract objects attached to their respective providers and addresses.

#### Defined in

[src/cross-chain-messenger.ts:98](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L98)

___

### depositConfirmationBlocks

• **depositConfirmationBlocks**: `number`

Number of blocks before a deposit is considered confirmed.

#### Defined in

[src/cross-chain-messenger.ts:108](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L108)

___

### estimateGas

• **estimateGas**: `Object`

Object that holds the functions that estimates the gas required for a given transaction.
Follows the pattern used by ethers.js.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `approveERC20` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `overrides?`: `CallOverrides`  }) => `Promise`<`BigNumber`\> |
| `depositERC20` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `l2GasLimit?`: [`NumberLike`](../modules#numberlike) ; `overrides?`: `CallOverrides` ; `recipient?`: [`AddressLike`](../modules#addresslike)  }) => `Promise`<`BigNumber`\> |
| `depositETH` | (`amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `l2GasLimit?`: [`NumberLike`](../modules#numberlike) ; `overrides?`: `CallOverrides` ; `recipient?`: [`AddressLike`](../modules#addresslike)  }) => `Promise`<`BigNumber`\> |
| `finalizeMessage` | (`message`: [`MessageLike`](../modules#messagelike), `opts?`: { `overrides?`: `CallOverrides`  }) => `Promise`<`BigNumber`\> |
| `proveMessage` | (`message`: [`MessageLike`](../modules#messagelike), `opts?`: { `overrides?`: `CallOverrides`  }) => `Promise`<`BigNumber`\> |
| `resendMessage` | (`message`: [`MessageLike`](../modules#messagelike), `messageGasLimit`: [`NumberLike`](../modules#numberlike), `opts?`: { `overrides?`: `CallOverrides`  }) => `Promise`<`BigNumber`\> |
| `sendMessage` | (`message`: [`CrossChainMessageRequest`](../interfaces/CrossChainMessageRequest), `opts?`: { `l2GasLimit?`: [`NumberLike`](../modules#numberlike) ; `overrides?`: `CallOverrides`  }) => `Promise`<`BigNumber`\> |
| `withdrawERC20` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `overrides?`: `CallOverrides` ; `recipient?`: [`AddressLike`](../modules#addresslike)  }) => `Promise`<`BigNumber`\> |
| `withdrawETH` | (`amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `overrides?`: `CallOverrides` ; `recipient?`: [`AddressLike`](../modules#addresslike)  }) => `Promise`<`BigNumber`\> |

#### Defined in

[src/cross-chain-messenger.ts:1606](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L1606)

___

### l1BlockTimeSeconds

• **l1BlockTimeSeconds**: `number`

Estimated average L1 block time in seconds.

#### Defined in

[src/cross-chain-messenger.ts:113](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L113)

___

### l1ChainId

• **l1ChainId**: `number`

Chain ID for the L1 network.

#### Defined in

[src/cross-chain-messenger.ts:88](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L88)

___

### l1SignerOrProvider

• **l1SignerOrProvider**: `Provider` \| `Signer`

Provider connected to the L1 chain.

#### Defined in

[src/cross-chain-messenger.ts:78](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L78)

___

### l2ChainId

• **l2ChainId**: `number`

Chain ID for the L2 network.

#### Defined in

[src/cross-chain-messenger.ts:93](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L93)

___

### l2SignerOrProvider

• **l2SignerOrProvider**: `Provider` \| `Signer`

Provider connected to the L2 chain.

#### Defined in

[src/cross-chain-messenger.ts:83](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L83)

___

### populateTransaction

• **populateTransaction**: `Object`

Object that holds the functions that generate transactions to be signed by the user.
Follows the pattern used by ethers.js.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `approveERC20` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `overrides?`: `Overrides`  }) => `Promise`<`TransactionRequest`\> |
| `depositERC20` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `l2GasLimit?`: [`NumberLike`](../modules#numberlike) ; `overrides?`: `Overrides` ; `recipient?`: [`AddressLike`](../modules#addresslike)  }) => `Promise`<`TransactionRequest`\> |
| `depositETH` | (`amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `l2GasLimit?`: [`NumberLike`](../modules#numberlike) ; `overrides?`: `PayableOverrides` ; `recipient?`: [`AddressLike`](../modules#addresslike)  }) => `Promise`<`TransactionRequest`\> |
| `finalizeMessage` | (`message`: [`MessageLike`](../modules#messagelike), `opts?`: { `overrides?`: `PayableOverrides`  }) => `Promise`<`TransactionRequest`\> |
| `proveMessage` | (`message`: [`MessageLike`](../modules#messagelike), `opts?`: { `overrides?`: `PayableOverrides`  }) => `Promise`<`TransactionRequest`\> |
| `resendMessage` | (`message`: [`MessageLike`](../modules#messagelike), `messageGasLimit`: [`NumberLike`](../modules#numberlike), `opts?`: { `overrides?`: `Overrides`  }) => `Promise`<`TransactionRequest`\> |
| `sendMessage` | (`message`: [`CrossChainMessageRequest`](../interfaces/CrossChainMessageRequest), `opts?`: { `l2GasLimit?`: [`NumberLike`](../modules#numberlike) ; `overrides?`: `Overrides`  }) => `Promise`<`TransactionRequest`\> |
| `withdrawERC20` | (`l1Token`: [`AddressLike`](../modules#addresslike), `l2Token`: [`AddressLike`](../modules#addresslike), `amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `overrides?`: `Overrides` ; `recipient?`: [`AddressLike`](../modules#addresslike)  }) => `Promise`<`TransactionRequest`\> |
| `withdrawETH` | (`amount`: [`NumberLike`](../modules#numberlike), `opts?`: { `overrides?`: `Overrides` ; `recipient?`: [`AddressLike`](../modules#addresslike)  }) => `Promise`<`TransactionRequest`\> |

#### Defined in

[src/cross-chain-messenger.ts:1337](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L1337)

## Accessors

### l1Provider

• `get` **l1Provider**(): `Provider`

Provider connected to the L1 chain.

#### Returns

`Provider`

#### Defined in

[src/cross-chain-messenger.ts:183](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L183)

___

### l1Signer

• `get` **l1Signer**(): `Signer`

Signer connected to the L1 chain.

#### Returns

`Signer`

#### Defined in

[src/cross-chain-messenger.ts:205](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L205)

___

### l2Provider

• `get` **l2Provider**(): `Provider`

Provider connected to the L2 chain.

#### Returns

`Provider`

#### Defined in

[src/cross-chain-messenger.ts:194](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L194)

___

### l2Signer

• `get` **l2Signer**(): `Signer`

Signer connected to the L2 chain.

#### Returns

`Signer`

#### Defined in

[src/cross-chain-messenger.ts:216](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L216)

## Methods

### approval

▸ **approval**(`l1Token`, `l2Token`, `opts?`): `Promise`<`BigNumber`\>

Queries the account's approval amount for a given L1 token.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l1Token` | [`AddressLike`](../modules#addresslike) | The L1 token address. |
| `l2Token` | [`AddressLike`](../modules#addresslike) | The L2 token address. |
| `opts?` | `Object` | Additional options. |
| `opts.signer?` | `Signer` | Optional signer to get the approval for. |

#### Returns

`Promise`<`BigNumber`\>

Amount of tokens approved for deposits from the account.

#### Defined in

[src/cross-chain-messenger.ts:1226](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L1226)

___

### approveERC20

▸ **approveERC20**(`l1Token`, `l2Token`, `amount`, `opts?`): `Promise`<`TransactionResponse`\>

Approves a deposit into the L2 chain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l1Token` | [`AddressLike`](../modules#addresslike) | The L1 token address. |
| `l2Token` | [`AddressLike`](../modules#addresslike) | The L2 token address. |
| `amount` | [`NumberLike`](../modules#numberlike) | Amount of the token to approve. |
| `opts?` | `Object` | Additional options. |
| `opts.overrides?` | `Overrides` | Optional transaction overrides. |
| `opts.signer?` | `Signer` | Optional signer to use to send the transaction. |

#### Returns

`Promise`<`TransactionResponse`\>

Transaction response for the approval transaction.

#### Defined in

[src/cross-chain-messenger.ts:1248](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L1248)

___

### depositERC20

▸ **depositERC20**(`l1Token`, `l2Token`, `amount`, `opts?`): `Promise`<`TransactionResponse`\>

Deposits some ERC20 tokens into the L2 chain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l1Token` | [`AddressLike`](../modules#addresslike) | Address of the L1 token. |
| `l2Token` | [`AddressLike`](../modules#addresslike) | Address of the L2 token. |
| `amount` | [`NumberLike`](../modules#numberlike) | Amount to deposit. |
| `opts?` | `Object` | Additional options. |
| `opts.l2GasLimit?` | [`NumberLike`](../modules#numberlike) | Optional gas limit to use for the transaction on L2. |
| `opts.overrides?` | `Overrides` | Optional transaction overrides. |
| `opts.recipient?` | [`AddressLike`](../modules#addresslike) | Optional address to receive the funds on L2. Defaults to sender. |
| `opts.signer?` | `Signer` | Optional signer to use to send the transaction. |

#### Returns

`Promise`<`TransactionResponse`\>

Transaction response for the deposit transaction.

#### Defined in

[src/cross-chain-messenger.ts:1280](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L1280)

___

### depositETH

▸ **depositETH**(`amount`, `opts?`): `Promise`<`TransactionResponse`\>

Deposits some ETH into the L2 chain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | [`NumberLike`](../modules#numberlike) | Amount of ETH to deposit (in wei). |
| `opts?` | `Object` | Additional options. |
| `opts.l2GasLimit?` | [`NumberLike`](../modules#numberlike) | Optional gas limit to use for the transaction on L2. |
| `opts.overrides?` | `Overrides` | Optional transaction overrides. |
| `opts.recipient?` | [`AddressLike`](../modules#addresslike) | Optional address to receive the funds on L2. Defaults to sender. |
| `opts.signer?` | `Signer` | Optional signer to use to send the transaction. |

#### Returns

`Promise`<`TransactionResponse`\>

Transaction response for the deposit transaction.

#### Defined in

[src/cross-chain-messenger.ts:1180](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L1180)

___

### estimateL2MessageGasLimit

▸ **estimateL2MessageGasLimit**(`message`, `opts?`): `Promise`<`BigNumber`\>

Estimates the amount of gas required to fully execute a given message on L2. Only applies to
L1 => L2 messages. You would supply this gas limit when sending the message to L2.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`MessageRequestLike`](../modules#messagerequestlike) | Message get a gas estimate for. |
| `opts?` | `Object` | Options object. |
| `opts.bufferPercent?` | `number` | Percentage of gas to add to the estimate. Defaults to 20. |
| `opts.from?` | `string` | Address to use as the sender. |

#### Returns

`Promise`<`BigNumber`\>

Estimates L2 gas limit.

#### Defined in

[src/cross-chain-messenger.ts:875](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L875)

___

### estimateMessageWaitTimeSeconds

▸ **estimateMessageWaitTimeSeconds**(`message`): `Promise`<`number`\>

Returns the estimated amount of time before the message can be executed. When this is a
message being sent to L1, this will return the estimated time until the message will complete
its challenge period. When this is a message being sent to L2, this will return the estimated
amount of time until the message will be picked up and executed on L2.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`MessageLike`](../modules#messagelike) | Message to estimate the time remaining for. |

#### Returns

`Promise`<`number`\>

Estimated amount of time remaining (in seconds) before the message can be executed.

#### Defined in

[src/cross-chain-messenger.ts:917](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L917)

___

### finalizeMessage

▸ **finalizeMessage**(`message`, `opts?`): `Promise`<`TransactionResponse`\>

Finalizes a cross chain message that was sent from L2 to L1. Only applicable for L2 to L1
messages. Will throw an error if the message has not completed its challenge period yet.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`MessageLike`](../modules#messagelike) | Message to finalize. |
| `opts?` | `Object` | Additional options. |
| `opts.overrides?` | `PayableOverrides` | Optional transaction overrides. |
| `opts.signer?` | `Signer` | Optional signer to use to send the transaction. |

#### Returns

`Promise`<`TransactionResponse`\>

Transaction response for the finalization transaction.

#### Defined in

[src/cross-chain-messenger.ts:1157](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L1157)

___

### getBackendTreeSyncIndex

▸ **getBackendTreeSyncIndex**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[src/cross-chain-messenger.ts:1057](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L1057)

___

### getBridgeForTokenPair

▸ **getBridgeForTokenPair**(`l1Token`, `l2Token`): `Promise`<[`IBridgeAdapter`](../interfaces/IBridgeAdapter)\>


#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l1Token` | [`AddressLike`](../modules#addresslike) | L1 token address. |
| `l2Token` | [`AddressLike`](../modules#addresslike) | L2 token address. |

#### Returns

`Promise`<[`IBridgeAdapter`](../interfaces/IBridgeAdapter)\>

The appropriate bridge adapter for the given token pair.

#### Defined in

[src/cross-chain-messenger.ts:455](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L455)

___

### getChallengePeriodSeconds

▸ **getChallengePeriodSeconds**(): `Promise`<`number`\>

Queries the current challenge period in seconds from the StateCommitmentChain.

#### Returns

`Promise`<`number`\>

Current challenge period in seconds.

#### Defined in

[src/cross-chain-messenger.ts:980](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L980)

___

### getDepositsByAddress

▸ **getDepositsByAddress**(`address`, `opts?`): `Promise`<[`TokenBridgeMessage`](../interfaces/TokenBridgeMessage)[]\>

Gets all deposits for a given address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`AddressLike`](../modules#addresslike) | Address to search for messages from. |
| `opts` | `Object` | Options object. |
| `opts.fromBlock?` | `BlockTag` | Block to start searching for messages from. If not provided, will start from the first block (block #0). |
| `opts.toBlock?` | `BlockTag` | Block to stop searching for messages at. If not provided, will stop at the latest known block ("latest"). |

#### Returns

`Promise`<[`TokenBridgeMessage`](../interfaces/TokenBridgeMessage)[]\>

All deposit token bridge messages sent by the given address.

#### Defined in

[src/cross-chain-messenger.ts:488](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L488)

___

### getMessageReceipt

▸ **getMessageReceipt**(`message`): `Promise`<[`MessageReceipt`](../interfaces/MessageReceipt)\>

Finds the receipt of the transaction that executed a particular cross chain message.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`MessageLike`](../modules#messagelike) | Message to find the receipt of. |

#### Returns

`Promise`<[`MessageReceipt`](../interfaces/MessageReceipt)\>

CrossChainMessage receipt including receipt of the transaction that relayed the
given message.

#### Defined in

[src/cross-chain-messenger.ts:683](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L683)

___

### getMessageStatus

▸ **getMessageStatus**(`message`): `Promise`<[`MessageStatus`](../enums/MessageStatus)\>

Retrieves the status of a particular message as an enum.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`MessageLike`](../modules#messagelike) | Cross chain message to check the status of. |

#### Returns

`Promise`<[`MessageStatus`](../enums/MessageStatus)\>

Status of the message.

#### Defined in

[src/cross-chain-messenger.ts:617](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L617)

___

### getMessagesByTransaction

▸ **getMessagesByTransaction**(`transaction`, `opts?`): `Promise`<[`CrossChainMessage`](../interfaces/CrossChainMessage)[]

Retrieves all cross chain messages sent within a given transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transaction` | [`TransactionLike`](../modules#transactionlike) | Transaction hash or receipt to find messages from. |
| `opts` | `Object` | Options object. |
| `opts.direction?` | [`MessageDirection`](../enums/MessageDirection) | Direction to search for messages in. If not provided, will attempt to automatically search both directions under the assumption that a transaction hash will only exist on one chain. If the hash exists on both chains, will throw an error. |

#### Returns

`Promise`<[`CrossChainMessage`](../interfaces/CrossChainMessage)[]\>

All cross chain messages sent within the transaction.

#### Defined in

[src/cross-chain-messenger.ts:234](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L234)

___

### getProvenWithdrawal

▸ **getProvenWithdrawal**(`withdrawalHash`): `Promise`<[`ProvenWithdrawal`](../interfaces/ProvenWithdrawal)\>

Queries the MorphPortal contract's `provenWithdrawals` mapping
for a ProvenWithdrawal that matches the passed withdrawalHash

#### Parameters

| Name | Type |
| :------ | :------ |
| `withdrawalHash` | `string` |

#### Returns

`Promise`<[`ProvenWithdrawal`](../interfaces/ProvenWithdrawal)\>

A ProvenWithdrawal object

**`Bedrock`**

Note: This function is bedrock-specific.

#### Defined in

[src/cross-chain-messenger.ts:995](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L995)

___

### getWithdrawMessageProof

▸ **getWithdrawMessageProof**(`message`): `Promise`<[`WithdrawMessageProof`](../interfaces/WithdrawMessageProof)\>

Generates the bedrock proof required to finalize an L2 to L1 message.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`MessageLike`](../modules#messagelike) | Message to generate a proof for. |

#### Returns

`Promise`<[`WithdrawMessageProof`](../interfaces/WithdrawMessageProof)\>

Proof that can be used to finalize the message.

#### Defined in

[src/cross-chain-messenger.ts:1007](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L1007)

___

### getWithdrawalsByAddress

▸ **getWithdrawalsByAddress**(`address`, `opts?`): `Promise`<[`TokenBridgeMessage`](../interfaces/TokenBridgeMessage)[]\>

Gets all withdrawals for a given address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`AddressLike`](../modules#addresslike) | Address to search for messages from. |
| `opts` | `Object` | Options object. |
| `opts.fromBlock?` | `BlockTag` | Block to start searching for messages from. If not provided, will start from the first block (block #0). |
| `opts.toBlock?` | `BlockTag` | Block to stop searching for messages at. If not provided, will stop at the latest known block ("latest"). |

#### Returns

`Promise`<[`TokenBridgeMessage`](../interfaces/TokenBridgeMessage)[]\>

All withdrawal token bridge messages sent by the given address.

#### Defined in

[src/cross-chain-messenger.ts:522](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L522)

___

### proveMessage

▸ **proveMessage**(`message`, `opts?`): `Promise`<`TransactionResponse`\>

Proves a cross chain message that was sent from L2 to L1. Only applicable for L2 to L1
messages.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`MessageLike`](../modules#messagelike) | Message to finalize. |
| `opts?` | `Object` | Additional options. |
| `opts.overrides?` | `Overrides` | Optional transaction overrides. |
| `opts.signer?` | `Signer` | Optional signer to use to send the transaction. |

#### Returns

`Promise`<`TransactionResponse`\>

Transaction response for the finalization transaction.

#### Defined in

[src/cross-chain-messenger.ts:1136](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L1136)

___

### resendMessage

▸ **resendMessage**(`message`, `messageGasLimit`, `opts?`): `Promise`<`TransactionResponse`\>

Resends a given cross chain message with a different gas limit. Only applies to L1 to L2
messages. If provided an L2 to L1 message, this function will throw an error.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`MessageLike`](../modules#messagelike) | Cross chain message to resend. |
| `messageGasLimit` | [`NumberLike`](../modules#numberlike) | New gas limit to use for the message. |
| `opts?` | `Object` | Additional options. |
| `opts.overrides?` | `Overrides` | Optional transaction overrides. |
| `opts.signer?` | `Signer` | Optional signer to use to send the transaction. |

#### Returns

`Promise`<`TransactionResponse`\>

Transaction response for the message resending transaction.

#### Defined in

[src/cross-chain-messenger.ts:1109](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L1109)

___

### sendMessage

▸ **sendMessage**(`message`, `opts?`): `Promise`<`TransactionResponse`\>

Sends a given cross chain message. Where the message is sent depends on the direction attached
to the message itself.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`CrossChainMessageRequest`](../interfaces/CrossChainMessageRequest) | Cross chain message to send. |
| `opts?` | `Object` | Additional options. |
| `opts.l2GasLimit?` | [`NumberLike`](../modules#numberlike) | Optional gas limit to use for the transaction on L2. |
| `opts.overrides?` | `Overrides` | Optional transaction overrides. |
| `opts.signer?` | `Signer` | Optional signer to use to send the transaction. |

#### Returns

`Promise`<`TransactionResponse`\>

Transaction response for the message sending transaction.

#### Defined in

[src/cross-chain-messenger.ts:1082](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L1082)

___

### toBedrockCrossChainMessage

▸ **toBedrockCrossChainMessage**(`message`): `Promise`<[`CrossChainMessage`](../interfaces/CrossChainMessage)\>

Transforms a legacy message into its corresponding Bedrock representation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`MessageLike`](../modules#messagelike) | Legacy message to transform. |

#### Returns

`Promise`<[`CrossChainMessage`](../interfaces/CrossChainMessage)\>

Bedrock representation of the message.

#### Defined in

[src/cross-chain-messenger.ts:324](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L324)

___

### toCrossChainMessage

▸ **toCrossChainMessage**(`message`): `Promise`<[`CrossChainMessage`](../interfaces/CrossChainMessage)\>

Resolves a MessageLike into a CrossChainMessage object.
Unlike other coercion functions, this function is stateful and requires making additional
requests. For now I'm going to keep this function here, but we could consider putting a
similar function inside of utils/coercion.ts if people want to use this without having to
create an entire CrossChainProvider object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`MessageLike`](../modules#messagelike) | MessageLike to resolve into a CrossChainMessage. |

#### Returns

`Promise`<[`CrossChainMessage`](../interfaces/CrossChainMessage)\>

Message coerced into a CrossChainMessage.

#### Defined in

[src/cross-chain-messenger.ts:555](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L555)

___

### toLowLevelMessage

▸ **toLowLevelMessage**(`message`): `Promise`<[`CoreCrossChainMessage`](../interfaces/CoreCrossChainMessage)\>

Transforms a CrossChainMessenger message into its low-level representation inside the
L2ToL1MessagePasser contract on L2.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`MessageLike`](../modules#messagelike) | Message to transform. |

#### Returns

`Promise`<[`CoreCrossChainMessage`](../interfaces/CoreCrossChainMessage)\>

Transformed message.

#### Defined in

[src/cross-chain-messenger.ts:370](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L370)

___

### waitForMessageReceipt

▸ **waitForMessageReceipt**(`message`, `opts?`): `Promise`<[`MessageReceipt`](../interfaces/MessageReceipt)\>

Waits for a message to be executed and returns the receipt of the transaction that executed
the given message.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`MessageLike`](../modules#messagelike) | Message to wait for. |
| `opts` | `Object` | Options to pass to the waiting function. |
| `opts.confirmations?` | `number` | Number of transaction confirmations to wait for before returning. |
| `opts.pollIntervalMs?` | `number` | Number of milliseconds to wait between polling for the receipt. |
| `opts.timeoutMs?` | `number` | Milliseconds to wait before timing out. |

#### Returns

`Promise`<[`MessageReceipt`](../interfaces/MessageReceipt)\>

CrossChainMessage receipt including receipt of the transaction that relayed the
given message.

#### Defined in

[src/cross-chain-messenger.ts:760](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L760)

___

### waitForMessageStatus

▸ **waitForMessageStatus**(`message`, `status`, `opts?`): `Promise`<`void`\>

Waits until the status of a given message changes to the expected status. Note that if the
status of the given message changes to a status that implies the expected status, this will
still return. If the status of the message changes to a status that exclues the expected
status, this will throw an error.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`MessageLike`](../modules#messagelike) | Message to wait for. |
| `status` | [`MessageStatus`](../enums/MessageStatus) | Expected status of the message. |
| `opts` | `Object` | Options to pass to the waiting function. |
| `opts.pollIntervalMs?` | `number` | Number of milliseconds to wait when polling. |
| `opts.timeoutMs?` | `number` | Milliseconds to wait before timing out. |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/cross-chain-messenger.ts:798](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L798)

___

### withdrawERC20

▸ **withdrawERC20**(`l1Token`, `l2Token`, `amount`, `opts?`): `Promise`<`TransactionResponse`\>

Withdraws some ERC20 tokens back to the L1 chain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l1Token` | [`AddressLike`](../modules#addresslike) | Address of the L1 token. |
| `l2Token` | [`AddressLike`](../modules#addresslike) | Address of the L2 token. |
| `amount` | [`NumberLike`](../modules#numberlike) | Amount to withdraw. |
| `opts?` | `Object` | Additional options. |
| `opts.overrides?` | `Overrides` | Optional transaction overrides. |
| `opts.recipient?` | [`AddressLike`](../modules#addresslike) | Optional address to receive the funds on L1. Defaults to sender. |
| `opts.signer?` | `Signer` | Optional signer to use to send the transaction. |

#### Returns

`Promise`<`TransactionResponse`\>

Transaction response for the withdraw transaction.

#### Defined in

[src/cross-chain-messenger.ts:1313](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L1313)

___

### withdrawETH

▸ **withdrawETH**(`amount`, `opts?`): `Promise`<`TransactionResponse`\>

Withdraws some ETH back to the L1 chain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | [`NumberLike`](../modules#numberlike) | Amount of ETH to withdraw. |
| `opts?` | `Object` | Additional options. |
| `opts.overrides?` | `Overrides` | Optional transaction overrides. |
| `opts.recipient?` | [`AddressLike`](../modules#addresslike) | Optional address to receive the funds on L1. Defaults to sender. |
| `opts.signer?` | `Signer` | Optional signer to use to send the transaction. |

#### Returns

`Promise`<`TransactionResponse`\>

Transaction response for the withdraw transaction.

#### Defined in

[src/cross-chain-messenger.ts:1204](https://github.com/morph-l2/sdk/tree/97c4394/src/cross-chain-messenger.ts#L1204)
