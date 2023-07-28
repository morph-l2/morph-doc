[@morphism/sdk](../README) / [Exports](../modules) / L2BlockWithTransactions

# Interface: L2BlockWithTransactions

JSON block representation when returned by L2Geth nodes. Just a normal block but with
L2Transaction objects instead of the standard transaction response object.

## Hierarchy

- `BlockWithTransactions`

  ↳ **`L2BlockWithTransactions`**

## Table of contents

### Properties

- [\_difficulty](L2BlockWithTransactions#_difficulty)
- [baseFeePerGas](L2BlockWithTransactions#basefeepergas)
- [difficulty](L2BlockWithTransactions#difficulty)
- [extraData](L2BlockWithTransactions#extradata)
- [gasLimit](L2BlockWithTransactions#gaslimit)
- [gasUsed](L2BlockWithTransactions#gasused)
- [hash](L2BlockWithTransactions#hash)
- [miner](L2BlockWithTransactions#miner)
- [nonce](L2BlockWithTransactions#nonce)
- [number](L2BlockWithTransactions#number)
- [parentHash](L2BlockWithTransactions#parenthash)
- [stateRoot](L2BlockWithTransactions#stateroot)
- [timestamp](L2BlockWithTransactions#timestamp)
- [transactions](L2BlockWithTransactions#transactions)

## Properties

### \_difficulty

• **\_difficulty**: `BigNumber`

#### Inherited from

BlockWithTransactions.\_difficulty

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:41

___

### baseFeePerGas

• `Optional` **baseFeePerGas**: `BigNumber`

#### Inherited from

BlockWithTransactions.baseFeePerGas

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:46

___

### difficulty

• **difficulty**: `number`

#### Inherited from

BlockWithTransactions.difficulty

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:40

___

### extraData

• **extraData**: `string`

#### Inherited from

BlockWithTransactions.extraData

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:45

___

### gasLimit

• **gasLimit**: `BigNumber`

#### Inherited from

BlockWithTransactions.gasLimit

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:42

___

### gasUsed

• **gasUsed**: `BigNumber`

#### Inherited from

BlockWithTransactions.gasUsed

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:43

___

### hash

• **hash**: `string`

#### Inherited from

BlockWithTransactions.hash

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:35

___

### miner

• **miner**: `string`

#### Inherited from

BlockWithTransactions.miner

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:44

___

### nonce

• **nonce**: `string`

#### Inherited from

BlockWithTransactions.nonce

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:39

___

### number

• **number**: `number`

#### Inherited from

BlockWithTransactions.number

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:37

___

### parentHash

• **parentHash**: `string`

#### Inherited from

BlockWithTransactions.parentHash

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:36

___

### stateRoot

• **stateRoot**: `string`

#### Defined in

[src/interfaces/l2-provider.ts:35](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/l2-provider.ts#L35)

___

### timestamp

• **timestamp**: `number`

#### Inherited from

BlockWithTransactions.timestamp

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:38

___

### transactions

• **transactions**: [[`L2Transaction`](L2Transaction)]

#### Overrides

BlockWithTransactions.transactions

#### Defined in

[src/interfaces/l2-provider.ts:36](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/l2-provider.ts#L36)
