[**@morph-l2/sdk**] • **Docs**

***

[@morph-l2/sdk](../1-globals.md) / L2Transaction

# Interface: L2Transaction

JSON transaction representation when returned by L2Geth nodes. This is simply an extension to
the standard transaction response type. You do NOT need to use this type unless you care about
having typed access to L2-specific fields.

## Extends

- `TransactionResponse`

## Properties

### accessList?

> `optional` **accessList**: `AccessList`

#### Inherited from

`TransactionResponse.accessList`

#### Source

node\_modules/@ethersproject/transactions/lib/index.d.ts:40

***

### blockHash?

> `optional` **blockHash**: `string`

#### Inherited from

`TransactionResponse.blockHash`

#### Source

node\_modules/@ethersproject/abstract-provider/lib/index.d.ts:26

***

### blockNumber?

> `optional` **blockNumber**: `number`

#### Inherited from

`TransactionResponse.blockNumber`

#### Source

node\_modules/@ethersproject/abstract-provider/lib/index.d.ts:25

***

### chainId

> **chainId**: `number`

#### Inherited from

`TransactionResponse.chainId`

#### Source

node\_modules/@ethersproject/transactions/lib/index.d.ts:35

***

### confirmations

> **confirmations**: `number`

#### Inherited from

`TransactionResponse.confirmations`

#### Source

node\_modules/@ethersproject/abstract-provider/lib/index.d.ts:28

***

### data

> **data**: `string`

#### Inherited from

`TransactionResponse.data`

#### Source

node\_modules/@ethersproject/transactions/lib/index.d.ts:33

***

### from

> **from**: `string`

#### Inherited from

`TransactionResponse.from`

#### Source

node\_modules/@ethersproject/abstract-provider/lib/index.d.ts:29

***

### gasLimit

> **gasLimit**: `BigNumber`

#### Inherited from

`TransactionResponse.gasLimit`

#### Source

node\_modules/@ethersproject/transactions/lib/index.d.ts:31

***

### gasPrice?

> `optional` **gasPrice**: `BigNumber`

#### Inherited from

`TransactionResponse.gasPrice`

#### Source

node\_modules/@ethersproject/transactions/lib/index.d.ts:32

***

### hash

> **hash**: `string`

#### Inherited from

`TransactionResponse.hash`

#### Source

node\_modules/@ethersproject/abstract-provider/lib/index.d.ts:24

***

### l1BlockNumber

> **l1BlockNumber**: `number`

#### Source

src/interfaces/l2-provider.ts:16

***

### l1TxOrigin

> **l1TxOrigin**: `string`

#### Source

src/interfaces/l2-provider.ts:17

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `BigNumber`

#### Inherited from

`TransactionResponse.maxFeePerGas`

#### Source

node\_modules/@ethersproject/transactions/lib/index.d.ts:42

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `BigNumber`

#### Inherited from

`TransactionResponse.maxPriorityFeePerGas`

#### Source

node\_modules/@ethersproject/transactions/lib/index.d.ts:41

***

### nonce

> **nonce**: `number`

#### Inherited from

`TransactionResponse.nonce`

#### Source

node\_modules/@ethersproject/transactions/lib/index.d.ts:30

***

### queueOrigin

> **queueOrigin**: `string`

#### Source

src/interfaces/l2-provider.ts:18

***

### r?

> `optional` **r**: `string`

#### Inherited from

`TransactionResponse.r`

#### Source

node\_modules/@ethersproject/transactions/lib/index.d.ts:36

***

### raw?

> `optional` **raw**: `string`

#### Inherited from

`TransactionResponse.raw`

#### Source

node\_modules/@ethersproject/abstract-provider/lib/index.d.ts:30

***

### rawTransaction

> **rawTransaction**: `string`

#### Source

src/interfaces/l2-provider.ts:19

***

### s?

> `optional` **s**: `string`

#### Inherited from

`TransactionResponse.s`

#### Source

node\_modules/@ethersproject/transactions/lib/index.d.ts:37

***

### timestamp?

> `optional` **timestamp**: `number`

#### Inherited from

`TransactionResponse.timestamp`

#### Source

node\_modules/@ethersproject/abstract-provider/lib/index.d.ts:27

***

### to?

> `optional` **to**: `string`

#### Inherited from

`TransactionResponse.to`

#### Source

node\_modules/@ethersproject/transactions/lib/index.d.ts:28

***

### type?

> `optional` **type**: `number`

#### Inherited from

`TransactionResponse.type`

#### Source

node\_modules/@ethersproject/transactions/lib/index.d.ts:39

***

### v?

> `optional` **v**: `number`

#### Inherited from

`TransactionResponse.v`

#### Source

node\_modules/@ethersproject/transactions/lib/index.d.ts:38

***

### value

> **value**: `BigNumber`

#### Inherited from

`TransactionResponse.value`

#### Source

node\_modules/@ethersproject/transactions/lib/index.d.ts:34

***

### wait()

> **wait**: (`confirmations`?) => `Promise`\<`TransactionReceipt`\>

#### Parameters

• **confirmations?**: `number`

#### Returns

`Promise`\<`TransactionReceipt`\>

#### Inherited from

`TransactionResponse.wait`

#### Source

node\_modules/@ethersproject/abstract-provider/lib/index.d.ts:31
