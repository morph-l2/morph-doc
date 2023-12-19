[@morph-l2/sdk](../intro.md) / [Exports](../modules) / L2Block

# Interface: L2Block

JSON block representation when returned by L2Geth nodes. Just a normal block but with
an added stateRoot field.

## Hierarchy

- `Block`

  ↳ **`L2Block`**

## Table of contents

### Properties

- [\_difficulty](L2Block#_difficulty)
- [baseFeePerGas](L2Block#basefeepergas)
- [difficulty](L2Block#difficulty)
- [extraData](L2Block#extradata)
- [gasLimit](L2Block#gaslimit)
- [gasUsed](L2Block#gasused)
- [hash](L2Block#hash)
- [miner](L2Block#miner)
- [nonce](L2Block#nonce)
- [number](L2Block#number)
- [parentHash](L2Block#parenthash)
- [stateRoot](L2Block#stateroot)
- [timestamp](L2Block#timestamp)
- [transactions](L2Block#transactions)

## Properties

### \_difficulty

• **\_difficulty**: `BigNumber`

#### Inherited from

Block.\_difficulty

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:41

___

### baseFeePerGas

• `Optional` **baseFeePerGas**: `BigNumber`

#### Inherited from

Block.baseFeePerGas

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:46

___

### difficulty

• **difficulty**: `number`

#### Inherited from

Block.difficulty

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:40

___

### extraData

• **extraData**: `string`

#### Inherited from

Block.extraData

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:45

___

### gasLimit

• **gasLimit**: `BigNumber`

#### Inherited from

Block.gasLimit

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:42

___

### gasUsed

• **gasUsed**: `BigNumber`

#### Inherited from

Block.gasUsed

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:43

___

### hash

• **hash**: `string`

#### Inherited from

Block.hash

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:35

___

### miner

• **miner**: `string`

#### Inherited from

Block.miner

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:44

___

### nonce

• **nonce**: `string`

#### Inherited from

Block.nonce

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:39

___

### number

• **number**: `number`

#### Inherited from

Block.number

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:37

___

### parentHash

• **parentHash**: `string`

#### Inherited from

Block.parentHash

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:36

___

### stateRoot

• **stateRoot**: `string`

#### Defined in

[src/interfaces/l2-provider.ts:27](https://github.com/morph-l2/sdk/tree/97c4394/src/interfaces/l2-provider.ts#L27)

___

### timestamp

• **timestamp**: `number`

#### Inherited from

Block.timestamp

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:38

___

### transactions

• **transactions**: `string`[]

#### Inherited from

Block.transactions

#### Defined in

node_modules/@ethersproject/abstract-provider/lib/index.d.ts:49
