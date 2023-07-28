[@morphism/sdk](../README) / [Exports](../modules) / TokenBridgeMessage

# Interface: TokenBridgeMessage

Describes a token withdrawal or deposit, along with the underlying raw cross chain message
behind the deposit or withdrawal.

## Table of contents

### Properties

- [amount](TokenBridgeMessage#amount)
- [blockNumber](TokenBridgeMessage#blocknumber)
- [data](TokenBridgeMessage#data)
- [direction](TokenBridgeMessage#direction)
- [from](TokenBridgeMessage#from)
- [l1Token](TokenBridgeMessage#l1token)
- [l2Token](TokenBridgeMessage#l2token)
- [logIndex](TokenBridgeMessage#logindex)
- [to](TokenBridgeMessage#to)
- [transactionHash](TokenBridgeMessage#transactionhash)

## Properties

### amount

• **amount**: `BigNumber`

#### Defined in

[src/interfaces/types.ts:218](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L218)

___

### blockNumber

• **blockNumber**: `number`

#### Defined in

[src/interfaces/types.ts:221](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L221)

___

### data

• **data**: `string`

#### Defined in

[src/interfaces/types.ts:219](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L219)

___

### direction

• **direction**: [`MessageDirection`](../enums/MessageDirection)

#### Defined in

[src/interfaces/types.ts:213](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L213)

___

### from

• **from**: `string`

#### Defined in

[src/interfaces/types.ts:214](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L214)

___

### l1Token

• **l1Token**: `string`

#### Defined in

[src/interfaces/types.ts:216](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L216)

___

### l2Token

• **l2Token**: `string`

#### Defined in

[src/interfaces/types.ts:217](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L217)

___

### logIndex

• **logIndex**: `number`

#### Defined in

[src/interfaces/types.ts:220](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L220)

___

### to

• **to**: `string`

#### Defined in

[src/interfaces/types.ts:215](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L215)

___

### transactionHash

• **transactionHash**: `string`

#### Defined in

[src/interfaces/types.ts:222](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L222)
