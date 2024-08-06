[**@morph-l2/sdk**](../README.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / getAllOEContracts

# Function: getAllOEContracts()

> **getAllOEContracts**(`l2ChainId`, `opts`): [`OEContracts`](../interfaces/OEContracts.md)

Automatically connects to all contract addresses, both L1 and L2, for the given L2 chain ID. The
user can provide custom contract address overrides for L1 or L2 contracts. If the given chain ID
is not known then the user MUST provide custom contract addresses for ALL L1 contracts or this
function will throw an error.

## Parameters

• **l2ChainId**: `number`

Chain ID for the L2 network.

• **opts**= `{}`

Additional options for connecting to the contracts.

• **opts.l1SignerOrProvider?**: `Provider` \| `Signer`

• **opts.l2SignerOrProvider?**: `Provider` \| `Signer`

• **opts.overrides?**: [`DeepPartial`](../type-aliases/DeepPartial.md)\<[`OEContractsLike`](../interfaces/OEContractsLike.md)\>

Custom contract address overrides for L1 or L2 contracts.

## Returns

[`OEContracts`](../interfaces/OEContracts.md)

An object containing ethers.Contract objects connected to the appropriate addresses on
both L1 and L2.

## Source

src/utils/contracts.ts:88
