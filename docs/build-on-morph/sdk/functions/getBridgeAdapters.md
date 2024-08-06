[**@morph-l2/sdk**](../globals.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / getBridgeAdapters

# Function: getBridgeAdapters()

> **getBridgeAdapters**(`l2ChainId`, `messenger`, `opts`?): [`BridgeAdapters`](../interfaces/BridgeAdapters.md)

Gets a series of bridge adapters for the given L2 chain ID.

## Parameters

• **l2ChainId**: `number`

Chain ID for the L2 network.

• **messenger**: [`CrossChainMessenger`](../classes/CrossChainMessenger.md)

Cross chain messenger to connect to the bridge adapters

• **opts?**

Additional options for connecting to the custom bridges.

• **opts.contracts?**: [`DeepPartial`](../type-aliases/DeepPartial.md)\<[`OEContractsLike`](../interfaces/OEContractsLike.md)\>

• **opts.overrides?**: [`BridgeAdapterData`](../interfaces/BridgeAdapterData.md)

Custom bridge adapters.

## Returns

[`BridgeAdapters`](../interfaces/BridgeAdapters.md)

An object containing all bridge adapters

## Source

src/utils/contracts.ts:142
