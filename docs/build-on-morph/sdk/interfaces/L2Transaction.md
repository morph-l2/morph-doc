[@morph-l2/sdk](../intro.md) / [Exports](../modules) / L2Transaction

# Interface: L2Transaction

JSON transaction representation when returned by L2Geth nodes. This is simply an extension to
the standard transaction response type. You do NOT need to use this type unless you care about
having typed access to L2-specific fields.

## Hierarchy

- `TransactionResponse`

  ↳ **`L2Transaction`**

## Table of contents

### Properties

- [accessList](L2Transaction#accesslist)
- [blockHash](L2Transaction#blockhash)
- [blockNumber](L2Transaction#blocknumber)
- [chainId](L2Transaction#chainid)
- [confirmations](L2Transaction#confirmations)
- [data](L2Transaction#data)
- [from](L2Transaction#from)
- [gasLimit](L2Transaction#gaslimit)
- [gasPrice](L2Transaction#gasprice)
- [hash](L2Transaction#hash)
- [l1BlockNumber](L2Transaction#l1blocknumber)
- [l1TxOrigin](L2Transaction#l1txorigin)
- [maxFeePerGas](L2Transaction#maxfeepergas)
- [maxPriorityFeePerGas](L2Transaction#maxpriorityfeepergas)
- [nonce](L2Transaction#nonce)
- [queueOrigin](L2Transaction#queueorigin)
- [r](L2Transaction#r)
- [raw](L2Transaction#raw)
- [rawTransaction](L2Transaction#rawtransaction)
- [s](L2Transaction#s)
- [timestamp](L2Transaction#timestamp)
- [to](L2Transaction#to)
- [type](L2Transaction#type)
- [v](L2Transaction#v)
- [value](L2Transaction#value)
- [wait](L2Transaction#wait)

## Properties

### accessList

• `Optional` **accessList**: `AccessList`

#### Inherited from

TransactionResponse.accessList

#### Defined in

node_modules/@ethersproject/transactions/lib/index.d.ts:40

___

### blockHash

• `Optional` **blockHash**: `string`

#### Inherited from

TransactionResponse.blockHash

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:26

___

### blockNumber

• `Optional` **blockNumber**: `number`

#### Inherited from

TransactionResponse.blockNumber

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:25

___

### chainId

• **chainId**: `number`

#### Inherited from

TransactionResponse.chainId

#### Defined in

node_modules/@ethersproject/transactions/lib/index.d.ts:35

___

### confirmations

• **confirmations**: `number`

#### Inherited from

TransactionResponse.confirmations

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:28

___

### data

• **data**: `string`

#### Inherited from

TransactionResponse.data

#### Defined in

node_modules/@ethersproject/transactions/lib/index.d.ts:33

___

### from

• **from**: `string`

#### Inherited from

TransactionResponse.from

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:29

___

### gasLimit

• **gasLimit**: `BigNumber`

#### Inherited from

TransactionResponse.gasLimit

#### Defined in

node_modules/@ethersproject/transactions/lib/index.d.ts:31

___

### gasPrice

• `Optional` **gasPrice**: `BigNumber`

#### Inherited from

TransactionResponse.gasPrice

#### Defined in

node_modules/@ethersproject/transactions/lib/index.d.ts:32

___

### hash

• **hash**: `string`

#### Inherited from

TransactionResponse.hash

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:24

___

### l1BlockNumber

• **l1BlockNumber**: `number`

#### Defined in

[src/interfaces/l2-provider.ts:16](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/l2-provider.ts#L16)

___

### l1TxOrigin

• **l1TxOrigin**: `string`

#### Defined in

[src/interfaces/l2-provider.ts:17](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/l2-provider.ts#L17)

___

### maxFeePerGas

• `Optional` **maxFeePerGas**: `BigNumber`

#### Inherited from

TransactionResponse.maxFeePerGas

#### Defined in

node_modules/@ethersproject/transactions/lib/index.d.ts:42

___

### maxPriorityFeePerGas

• `Optional` **maxPriorityFeePerGas**: `BigNumber`

#### Inherited from

TransactionResponse.maxPriorityFeePerGas

#### Defined in

node_modules/@ethersproject/transactions/lib/index.d.ts:41

___

### nonce

• **nonce**: `number`

#### Inherited from

TransactionResponse.nonce

#### Defined in

node_modules/@ethersproject/transactions/lib/index.d.ts:30

___

### queueOrigin

• **queueOrigin**: `string`

#### Defined in

[src/interfaces/l2-provider.ts:18](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/l2-provider.ts#L18)

___

### r

• `Optional` **r**: `string`

#### Inherited from

TransactionResponse.r

#### Defined in

node_modules/@ethersproject/transactions/lib/index.d.ts:36

___

### raw

• `Optional` **raw**: `string`

#### Inherited from

TransactionResponse.raw

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:30

___

### rawTransaction

• **rawTransaction**: `string`

#### Defined in

[src/interfaces/l2-provider.ts:19](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/l2-provider.ts#L19)

___

### s

• `Optional` **s**: `string`

#### Inherited from

TransactionResponse.s

#### Defined in

node_modules/@ethersproject/transactions/lib/index.d.ts:37

___

### timestamp

• `Optional` **timestamp**: `number`

#### Inherited from

TransactionResponse.timestamp

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:27

___

### to

• `Optional` **to**: `string`

#### Inherited from

TransactionResponse.to

#### Defined in

node_modules/@ethersproject/transactions/lib/index.d.ts:28

___

### type

• `Optional` **type**: `number`

#### Inherited from

TransactionResponse.type

#### Defined in

node_modules/@ethersproject/transactions/lib/index.d.ts:39

___

### v

• `Optional` **v**: `number`

#### Inherited from

TransactionResponse.v

#### Defined in

node_modules/@ethersproject/transactions/lib/index.d.ts:38

___

### value

• **value**: `BigNumber`

#### Inherited from

TransactionResponse.value

#### Defined in

node_modules/@ethersproject/transactions/lib/index.d.ts:34

___

### wait

• **wait**: (`confirmations?`: `number`) => `Promise`<`TransactionReceipt`\>

#### Type declaration

▸ (`confirmations?`): `Promise`<`TransactionReceipt`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `confirmations?` | `number` |

##### Returns

`Promise`<`TransactionReceipt`\>

#### Inherited from

TransactionResponse.wait

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:31
