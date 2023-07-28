[@morphism/sdk](../README) / [Exports](../modules) / CrossChainMessage

# Interface: CrossChainMessage

Describes a message that is sent between L1 and L2. Direction determines where the message was
sent from and where it's being sent to.

## Hierarchy

- [`CoreCrossChainMessage`](CoreCrossChainMessage)

  ↳ **`CrossChainMessage`**

## Table of contents

### Properties

- [blockNumber](CrossChainMessage#blocknumber)
- [direction](CrossChainMessage#direction)
- [logIndex](CrossChainMessage#logindex)
- [message](CrossChainMessage#message)
- [messageNonce](CrossChainMessage#messagenonce)
- [minGasLimit](CrossChainMessage#mingaslimit)
- [sender](CrossChainMessage#sender)
- [target](CrossChainMessage#target)
- [transactionHash](CrossChainMessage#transactionhash)
- [value](CrossChainMessage#value)

## Properties

### blockNumber

• **blockNumber**: `number`

#### Defined in

[src/interfaces/types.ts:198](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L198)

___

### direction

• **direction**: [`MessageDirection`](../enums/MessageDirection)

#### Defined in

[src/interfaces/types.ts:196](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L196)

___

### logIndex

• **logIndex**: `number`

#### Defined in

[src/interfaces/types.ts:197](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L197)

___

### message

• **message**: `string`

#### Inherited from

[CoreCrossChainMessage](CoreCrossChainMessage).[message](CoreCrossChainMessage#message)

#### Defined in

[src/interfaces/types.ts:185](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L185)

___

### messageNonce

• **messageNonce**: `BigNumber`

#### Inherited from

[CoreCrossChainMessage](CoreCrossChainMessage).[messageNonce](CoreCrossChainMessage#messagenonce)

#### Defined in

[src/interfaces/types.ts:186](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L186)

___

### minGasLimit

• **minGasLimit**: `BigNumber`

#### Inherited from

[CoreCrossChainMessage](CoreCrossChainMessage).[minGasLimit](CoreCrossChainMessage#mingaslimit)

#### Defined in

[src/interfaces/types.ts:188](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L188)

___

### sender

• **sender**: `string`

#### Inherited from

[CoreCrossChainMessage](CoreCrossChainMessage).[sender](CoreCrossChainMessage#sender)

#### Defined in

[src/interfaces/types.ts:183](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L183)

___

### target

• **target**: `string`

#### Inherited from

[CoreCrossChainMessage](CoreCrossChainMessage).[target](CoreCrossChainMessage#target)

#### Defined in

[src/interfaces/types.ts:184](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L184)

___

### transactionHash

• **transactionHash**: `string`

#### Defined in

[src/interfaces/types.ts:199](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L199)

___

### value

• **value**: `BigNumber`

#### Inherited from

[CoreCrossChainMessage](CoreCrossChainMessage).[value](CoreCrossChainMessage#value)

#### Defined in

[src/interfaces/types.ts:187](https://github.com/morphism-labs/sdk/blob/97c4394/src/interfaces/types.ts#L187)
