[@morph-l2/sdk](README) / Exports

# @morph-l2/sdk

## Table of contents

### Enumerations

- [L1ChainID](enums/L1ChainID)
- [L2ChainID](enums/L2ChainID)
- [MessageDirection](enums/MessageDirection)
- [MessageReceiptStatus](enums/MessageReceiptStatus)
- [MessageStatus](enums/MessageStatus)

### Classes

- [CrossChainMessenger](classes/CrossChainMessenger)
- [DAIBridgeAdapter](classes/DAIBridgeAdapter)
- [ECOBridgeAdapter](classes/ECOBridgeAdapter)
- [ETHBridgeAdapter](classes/ETHBridgeAdapter)
- [StandardBridgeAdapter](classes/StandardBridgeAdapter)

### Interfaces

- [BridgeAdapterData](interfaces/BridgeAdapterData)
- [BridgeAdapters](interfaces/BridgeAdapters)
- [CoreCrossChainMessage](interfaces/CoreCrossChainMessage)
- [CrossChainMessage](interfaces/CrossChainMessage)
- [CrossChainMessageRequest](interfaces/CrossChainMessageRequest)
- [IBridgeAdapter](interfaces/IBridgeAdapter)
- [L2Block](interfaces/L2Block)
- [L2BlockWithTransactions](interfaces/L2BlockWithTransactions)
- [L2Transaction](interfaces/L2Transaction)
- [MessageReceipt](interfaces/MessageReceipt)
- [OEContracts](interfaces/OEContracts)
- [OEContractsLike](interfaces/OEContractsLike)
- [OEL1Contracts](interfaces/OEL1Contracts)
- [OEL2Contracts](interfaces/OEL2Contracts)
- [ProvenWithdrawal](interfaces/ProvenWithdrawal)
- [StateRoot](interfaces/StateRoot)
- [StateRootBatch](interfaces/StateRootBatch)
- [StateRootBatchHeader](interfaces/StateRootBatchHeader)
- [TokenBridgeMessage](interfaces/TokenBridgeMessage)
- [WithdrawMessageProof](interfaces/WithdrawMessageProof)
- [WithdrawalEntry](interfaces/WithdrawalEntry)

### Type Aliases

- [AddressLike](modules#addresslike)
- [DeepPartial](modules#deeppartial)
- [L2Provider](modules#l2provider)
- [LowLevelMessage](modules#lowlevelmessage)
- [MessageLike](modules#messagelike)
- [MessageRequestLike](modules#messagerequestlike)
- [NumberLike](modules#numberlike)
- [OEL1ContractsLike](modules#oel1contractslike)
- [OEL2ContractsLike](modules#oel2contractslike)
- [ProviderLike](modules#providerlike)
- [SignerLike](modules#signerlike)
- [SignerOrProviderLike](modules#signerorproviderlike)
- [TransactionLike](modules#transactionlike)

### Variables

- [BRIDGE\_ADAPTER\_DATA](modules#bridge_adapter_data)
- [CHAIN\_BLOCK\_TIMES](modules#chain_block_times)
- [CONTRACT\_ADDRESSES](modules#contract_addresses)
- [DEFAULT\_L2\_CONTRACT\_ADDRESSES](modules#default_l2_contract_addresses)
- [DEPOSIT\_CONFIRMATION\_BLOCKS](modules#deposit_confirmation_blocks)

### Functions

- [asL2Provider](modules#asl2provider)
- [estimateL1Gas](modules#estimatel1gas)
- [estimateL1GasCost](modules#estimatel1gascost)
- [estimateL2GasCost](modules#estimatel2gascost)
- [estimateTotalGasCost](modules#estimatetotalgascost)
- [getAllOEContracts](modules#getalloecontracts)
- [getBridgeAdapters](modules#getbridgeadapters)
- [getL1GasPrice](modules#getl1gasprice)
- [getOEContract](modules#getoecontract)
- [hashLowLevelMessage](modules#hashlowlevelmessage)
- [hashMessageHash](modules#hashmessagehash)
- [isL2Provider](modules#isl2provider)
- [migratedWithdrawalGasLimit](modules#migratedwithdrawalgaslimit)
- [omit](modules#omit)
- [toAddress](modules#toaddress)
- [toBigNumber](modules#tobignumber)
- [toNumber](modules#tonumber)
- [toProvider](modules#toprovider)
- [toSignerOrProvider](modules#tosignerorprovider)
- [toTransactionHash](modules#totransactionhash)

## Type Aliases

### AddressLike

Ƭ **AddressLike**: `string` \| `Contract`

Stuff that can be coerced into an address.

#### Defined in

[src/interfaces/types.ts:327](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L327)

___

### DeepPartial

Ƭ **DeepPartial**<`T`\>: { [P in keyof T]?: DeepPartial<T[P]\> }

Utility type for deep partials.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/utils/type-utils.ts:4](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/type-utils.ts#L4)

___

### L2Provider

Ƭ **L2Provider**<`TProvider`\>: `TProvider` & { `_isL2Provider`: ``true`` ; `estimateL1Gas`: (`tx`: `TransactionRequest`) => `Promise`<`BigNumber`\> ; `estimateL1GasCost`: (`tx`: `TransactionRequest`) => `Promise`<`BigNumber`\> ; `estimateL2GasCost`: (`tx`: `TransactionRequest`) => `Promise`<`BigNumber`\> ; `estimateTotalGasCost`: (`tx`: `TransactionRequest`) => `Promise`<`BigNumber`\> ; `getL1GasPrice`: () => `Promise`<`BigNumber`\>  }

Represents an extended version of an normal ethers Provider that returns additional L2 info and
has special functions for L2-specific interactions.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TProvider` | extends `Provider` |

#### Defined in

[src/interfaces/l2-provider.ts:43](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/l2-provider.ts#L43)

___

### LowLevelMessage

Ƭ **LowLevelMessage**: [`CoreCrossChainMessage`](interfaces/CoreCrossChainMessage)

Describes messages sent inside the L2ToL1MessagePasser on L2. Happens to be the same structure
as the CoreCrossChainMessage so we'll reuse the type for now.

#### Defined in

[src/interfaces/types.ts:206](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L206)

___

### MessageLike

Ƭ **MessageLike**: [`CrossChainMessage`](interfaces/CrossChainMessage) \| [`TransactionLike`](modules#transactionlike) \| [`TokenBridgeMessage`](interfaces/TokenBridgeMessage)

Stuff that can be coerced into a CrossChainMessage.

#### Defined in

[src/interfaces/types.ts:295](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L295)

___

### MessageRequestLike

Ƭ **MessageRequestLike**: [`CrossChainMessageRequest`](interfaces/CrossChainMessageRequest) \| [`CrossChainMessage`](interfaces/CrossChainMessage) \| [`TransactionLike`](modules#transactionlike) \| [`TokenBridgeMessage`](interfaces/TokenBridgeMessage)

Stuff that can be coerced into a CrossChainMessageRequest.

#### Defined in

[src/interfaces/types.ts:303](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L303)

___

### NumberLike

Ƭ **NumberLike**: `string` \| `number` \| `BigNumber`

Stuff that can be coerced into a number.

#### Defined in

[src/interfaces/types.ts:332](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L332)

___

### OEL1ContractsLike

Ƭ **OEL1ContractsLike**: { [K in keyof OEL1Contracts]: AddressLike }

Convenience type for something that looks like the L1 OE contract interface but could be
addresses instead of actual contract objects.

#### Defined in

[src/interfaces/types.ts:72](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L72)

___

### OEL2ContractsLike

Ƭ **OEL2ContractsLike**: { [K in keyof OEL2Contracts]: AddressLike }

Convenience type for something that looks like the L2 OE contract interface but could be
addresses instead of actual contract objects.

#### Defined in

[src/interfaces/types.ts:80](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L80)

___

### ProviderLike

Ƭ **ProviderLike**: `string` \| `Provider`

Stuff that can be coerced into a provider.

#### Defined in

[src/interfaces/types.ts:312](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L312)

___

### SignerLike

Ƭ **SignerLike**: `string` \| `Signer`

Stuff that can be coerced into a signer.

#### Defined in

[src/interfaces/types.ts:317](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L317)

___

### SignerOrProviderLike

Ƭ **SignerOrProviderLike**: [`SignerLike`](modules#signerlike) \| [`ProviderLike`](modules#providerlike)

Stuff that can be coerced into a signer or provider.

#### Defined in

[src/interfaces/types.ts:322](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L322)

___

### TransactionLike

Ƭ **TransactionLike**: `string` \| `TransactionReceipt` \| `TransactionResponse`

Stuff that can be coerced into a transaction.

#### Defined in

[src/interfaces/types.ts:290](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/types.ts#L290)

## Variables

### BRIDGE\_ADAPTER\_DATA

• `Const` **BRIDGE\_ADAPTER\_DATA**: { [ChainID in L2ChainID]?: BridgeAdapterData }

Mapping of L1 chain IDs to the list of custom bridge addresses for each chain.

#### Defined in

[src/utils/chain-constants.ts:95](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/chain-constants.ts#L95)

___

### CHAIN\_BLOCK\_TIMES

• `Const` **CHAIN\_BLOCK\_TIMES**: { [ChainID in L1ChainID]: number }

#### Defined in

[src/utils/chain-constants.ts:20](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/chain-constants.ts#L20)

___

### CONTRACT\_ADDRESSES

• `Const` **CONTRACT\_ADDRESSES**: { [ChainID in L2ChainID]: OEContractsLike }

Mapping of L1 chain IDs to the appropriate contract addresses for the OE deployments to the
given network. Simplifies the process of getting the correct contract addresses for a given
contract name.

#### Defined in

[src/utils/chain-constants.ts:51](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/chain-constants.ts#L51)

___

### DEFAULT\_L2\_CONTRACT\_ADDRESSES

• `Const` **DEFAULT\_L2\_CONTRACT\_ADDRESSES**: [`OEL2ContractsLike`](modules#oel2contractslike)

Full list of default L2 contract addresses.
TODO(tynes): migrate to predeploys from contracts-bedrock

#### Defined in

[src/utils/chain-constants.ts:33](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/chain-constants.ts#L33)

___

### DEPOSIT\_CONFIRMATION\_BLOCKS

• `Const` **DEPOSIT\_CONFIRMATION\_BLOCKS**: { [ChainID in L2ChainID]: number }

#### Defined in

[src/utils/chain-constants.ts:12](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/chain-constants.ts#L12)

## Functions

### asL2Provider

▸ **asL2Provider**<`TProvider`\>(`provider`): [`L2Provider`](modules#l2provider)<`TProvider`\>

Returns an provider wrapped as an Morph L2 provider. Adds a few extra helper functions to
simplify the process of estimating the gas usage for a transaction on Morph. Returns a COPY
of the original provider.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TProvider` | extends `Provider` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | `TProvider` | Provider to wrap into an L2 provider. |

#### Returns

[`L2Provider`](modules#l2provider)<`TProvider`\>

Provider wrapped as an L2 provider.

#### Defined in

[src/l2-provider.ts:168](https://github.com/morph-l2/sdk/tree/97c4394/src/l2-provider.ts#L168)

___

### estimateL1Gas

▸ **estimateL1Gas**(`l2Provider`, `tx`): `Promise`<`BigNumber`\>

Estimates the amount of L1 gas required for a given L2 transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l2Provider` | [`ProviderLike`](modules#providerlike) | L2 provider to query the gas usage from. |
| `tx` | `TransactionRequest` | Transaction to estimate L1 gas for. |

#### Returns

`Promise`<`BigNumber`\>

Estimated L1 gas.

#### Defined in

[src/l2-provider.ts:68](https://github.com/morph-l2/sdk/tree/97c4394/src/l2-provider.ts#L68)

___

### estimateL1GasCost

▸ **estimateL1GasCost**(`l2Provider`, `tx`): `Promise`<`BigNumber`\>

Estimates the amount of L1 gas cost for a given L2 transaction in wei.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l2Provider` | [`ProviderLike`](modules#providerlike) | L2 provider to query the gas usage from. |
| `tx` | `TransactionRequest` | Transaction to estimate L1 gas cost for. |

#### Returns

`Promise`<`BigNumber`\>

Estimated L1 gas cost.

#### Defined in

[src/l2-provider.ts:92](https://github.com/morph-l2/sdk/tree/97c4394/src/l2-provider.ts#L92)

___

### estimateL2GasCost

▸ **estimateL2GasCost**(`l2Provider`, `tx`): `Promise`<`BigNumber`\>

Estimates the L2 gas cost for a given L2 transaction in wei.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l2Provider` | [`ProviderLike`](modules#providerlike) | L2 provider to query the gas usage from. |
| `tx` | `TransactionRequest` | Transaction to estimate L2 gas cost for. |

#### Returns

`Promise`<`BigNumber`\>

Estimated L2 gas cost.

#### Defined in

[src/l2-provider.ts:116](https://github.com/morph-l2/sdk/tree/97c4394/src/l2-provider.ts#L116)

___

### estimateTotalGasCost

▸ **estimateTotalGasCost**(`l2Provider`, `tx`): `Promise`<`BigNumber`\>

Estimates the total gas cost for a given L2 transaction in wei.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l2Provider` | [`ProviderLike`](modules#providerlike) | L2 provider to query the gas usage from. |
| `tx` | `TransactionRequest` | Transaction to estimate total gas cost for. |

#### Returns

`Promise`<`BigNumber`\>

Estimated total gas cost.

#### Defined in

[src/l2-provider.ts:133](https://github.com/morph-l2/sdk/tree/97c4394/src/l2-provider.ts#L133)

___

### getAllOEContracts

▸ **getAllOEContracts**(`l2ChainId`, `opts?`): [`OEContracts`](interfaces/OEContracts)

Automatically connects to all contract addresses, both L1 and L2, for the given L2 chain ID. The
user can provide custom contract address overrides for L1 or L2 contracts. If the given chain ID
is not known then the user MUST provide custom contract addresses for ALL L1 contracts or this
function will throw an error.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l2ChainId` | `number` | Chain ID for the L2 network. |
| `opts` | `Object` | Additional options for connecting to the contracts. |
| `opts.l1SignerOrProvider?` | `Provider` \| `Signer` | - |
| `opts.l2SignerOrProvider?` | `Provider` \| `Signer` | - |
| `opts.overrides?` | [`DeepPartial`](modules#deeppartial)<[`OEContractsLike`](interfaces/OEContractsLike)\> | Custom contract address overrides for L1 or L2 contracts. |

#### Returns

[`OEContracts`](interfaces/OEContracts)

An object containing ethers.Contract objects connected to the appropriate addresses on
both L1 and L2.

#### Defined in

[src/utils/contracts.ts:102](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/contracts.ts#L102)

___

### getBridgeAdapters

▸ **getBridgeAdapters**(`l2ChainId`, `messenger`, `opts?`): [`BridgeAdapters`](interfaces/BridgeAdapters)

Gets a series of bridge adapters for the given L2 chain ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l2ChainId` | `number` | Chain ID for the L2 network. |
| `messenger` | [`CrossChainMessenger`](classes/CrossChainMessenger) | Cross chain messenger to connect to the bridge adapters |
| `opts?` | `Object` | Additional options for connecting to the custom bridges. |
| `opts.contracts?` | [`DeepPartial`](modules#deeppartial)<[`OEContractsLike`](interfaces/OEContractsLike)\> | - |
| `opts.overrides?` | [`BridgeAdapterData`](interfaces/BridgeAdapterData) | Custom bridge adapters. |

#### Returns

[`BridgeAdapters`](interfaces/BridgeAdapters)

An object containing all bridge adapters

#### Defined in

[src/utils/contracts.ts:163](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/contracts.ts#L163)

___

### getL1GasPrice

▸ **getL1GasPrice**(`l2Provider`): `Promise`<`BigNumber`\>

Gets the current L1 gas price as seen on L2.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `l2Provider` | [`ProviderLike`](modules#providerlike) | L2 provider to query the L1 gas price from. |

#### Returns

`Promise`<`BigNumber`\>

Current L1 gas price as seen on L2.

#### Defined in

[src/l2-provider.ts:54](https://github.com/morph-l2/sdk/tree/97c4394/src/l2-provider.ts#L54)

___

### getOEContract

▸ **getOEContract**(`contractName`, `l2ChainId`, `opts?`): `Contract`

Returns an ethers.Contract object for the given name, connected to the appropriate address for
the given L2 chain ID. Users can also provide a custom address to connect the contract to
instead. If the chain ID is not known then the user MUST provide a custom address or this
function will throw an error.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contractName` | keyof [`OEL1Contracts`](interfaces/OEL1Contracts) \| keyof [`OEL2Contracts`](interfaces/OEL2Contracts) | Name of the contract to connect to. |
| `l2ChainId` | `number` | Chain ID for the L2 network. |
| `opts` | `Object` | Additional options for connecting to the contract. |
| `opts.address?` | [`AddressLike`](modules#addresslike) | Custom address to connect to the contract. |
| `opts.signerOrProvider?` | `Provider` \| `Signer` | Signer or provider to connect to the contract. |

#### Returns

`Contract`

An ethers.Contract object connected to the appropriate address and interface.

#### Defined in

[src/utils/contracts.ts:52](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/contracts.ts#L52)

___

### hashLowLevelMessage

▸ **hashLowLevelMessage**(`message`): `string`

Utility for hashing a LowLevelMessage object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`CoreCrossChainMessage`](interfaces/CoreCrossChainMessage) | LowLevelMessage object to hash. |

#### Returns

`string`

Hash of the given LowLevelMessage.

#### Defined in

[src/utils/message-utils.ts:23](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/message-utils.ts#L23)

___

### hashMessageHash

▸ **hashMessageHash**(`messageHash`): `string`

Utility for hashing a message hash. This computes the storage slot
where the message hash will be stored in state. HashZero is used
because the first mapping in the contract is used.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messageHash` | `string` | Message hash to hash. |

#### Returns

`string`

Hash of the given message hash.

#### Defined in

[src/utils/message-utils.ts:42](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/message-utils.ts#L42)

___

### isL2Provider

▸ **isL2Provider**<`TProvider`\>(`provider`): provider is L2Provider<TProvider\>

Determines if a given Provider is an L2Provider.  Will coerce type
if true

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TProvider` | extends `Provider` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | `TProvider` | The provider to check |

#### Returns

provider is L2Provider<TProvider\>

Boolean

**`Example`**

```ts
if (isL2Provider(provider)) {
  // typescript now knows it is of type L2Provider
  const gasPrice = await provider.estimateL2GasPrice(tx)
}
```

#### Defined in

[src/l2-provider.ts:154](https://github.com/morph-l2/sdk/tree/97c4394/src/l2-provider.ts#L154)

___

### migratedWithdrawalGasLimit

▸ **migratedWithdrawalGasLimit**(`data`, `chainID`): `BigNumber`

Compute the min gas limit for a migrated withdrawal.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` |
| `chainID` | `number` |

#### Returns

`BigNumber`

#### Defined in

[src/utils/message-utils.ts:53](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/message-utils.ts#L53)

___

### omit

▸ **omit**<`T`, `K`\>(`obj`, `...keys`): `Omit`<`T`, `K`\>

Returns a copy of the given object ({ ...obj }) with the given keys omitted.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | `T` | Object to return with the keys omitted. |
| `...keys` | `K`[] | Keys to omit from the returned object. |

#### Returns

`Omit`<`T`, `K`\>

A copy of the given object with the given keys omitted.

#### Defined in

[src/utils/misc-utils.ts:11](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/misc-utils.ts#L11)

___

### toAddress

▸ **toAddress**(`addr`): `string`

Converts an address-like into a 0x-prefixed address string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `addr` | [`AddressLike`](modules#addresslike) | Address-like to convert into an address. |

#### Returns

`string`

Address-like as an address.

#### Defined in

[src/utils/coercion.ts:104](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/coercion.ts#L104)

___

### toBigNumber

▸ **toBigNumber**(`num`): `BigNumber`

Converts a number-like into an ethers BigNumber.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `num` | [`NumberLike`](modules#numberlike) | Number-like to convert into a BigNumber. |

#### Returns

`BigNumber`

Number-like as a BigNumber.

#### Defined in

[src/utils/coercion.ts:84](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/coercion.ts#L84)

___

### toNumber

▸ **toNumber**(`num`): `number`

Converts a number-like into a number.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `num` | [`NumberLike`](modules#numberlike) | Number-like to convert into a number. |

#### Returns

`number`

Number-like as a number.

#### Defined in

[src/utils/coercion.ts:94](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/coercion.ts#L94)

___

### toProvider

▸ **toProvider**(`provider`): `Provider`

Converts a ProviderLike into a Provider. Assumes that if the input is a string then it is a
JSON-RPC url.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | [`ProviderLike`](modules#providerlike) | ProviderLike to turn into a Provider. |

#### Returns

`Provider`

Input as a Provider.

#### Defined in

[src/utils/coercion.ts:46](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/coercion.ts#L46)

___

### toSignerOrProvider

▸ **toSignerOrProvider**(`signerOrProvider`): `Provider` \| `Signer`

Converts a SignerOrProviderLike into a Signer or a Provider. Assumes that if the input is a
string then it is a JSON-RPC url.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signerOrProvider` | [`SignerOrProviderLike`](modules#signerorproviderlike) | SignerOrProviderLike to turn into a Signer or Provider. |

#### Returns

`Provider` \| `Signer`

Input as a Signer or Provider.

#### Defined in

[src/utils/coercion.ts:25](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/coercion.ts#L25)

___

### toTransactionHash

▸ **toTransactionHash**(`transaction`): `string`

Pulls a transaction hash out of a TransactionLike object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transaction` | [`TransactionLike`](modules#transactionlike) | TransactionLike to convert into a transaction hash. |

#### Returns

`string`

Transaction hash corresponding to the TransactionLike input.

#### Defined in

[src/utils/coercion.ts:62](https://github.com/morph-l2/sdk/tree/97c4394/src/utils/coercion.ts#L62)
