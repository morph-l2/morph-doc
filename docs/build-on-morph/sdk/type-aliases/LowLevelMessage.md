[**@morph-l2/sdk**](../README.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / LowLevelMessage

# Type alias: LowLevelMessage

> **LowLevelMessage**: [`CoreCrossChainMessage`](../interfaces/CoreCrossChainMessage.md) & `object`

Describes messages sent inside the L2ToL1MessagePasser on L2. Happens to be the same structure
as the CoreCrossChainMessage so we'll reuse the type for now.

## Type declaration

### encodedMessage

> **encodedMessage**: `string`

### messageHash

> **messageHash**: `string`

### messageSender

> **messageSender**: `string`

### messageTarget

> **messageTarget**: `string`

## Source

src/interfaces/types.ts:258
