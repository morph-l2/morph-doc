[**@morph-l2/sdk**] • **Docs**

***

[@morph-l2/sdk](../1-globals.md) / getOEContract

# Function: getOEContract()

> **getOEContract**(`contractName`, `l2ChainId`, `opts`): `Contract`

Returns an ethers.Contract object for the given name, connected to the appropriate address for
the given L2 chain ID. Users can also provide a custom address to connect the contract to
instead. If the chain ID is not known then the user MUST provide a custom address or this
function will throw an error.

## Parameters

• **contractName**: keyof OEL2Contracts \| keyof OEL1Contracts

Name of the contract to connect to.

• **l2ChainId**: `number`

Chain ID for the L2 network.

• **opts**= `{}`

Additional options for connecting to the contract.

• **opts.address?**: [`AddressLike`](../type-aliases/AddressLike.md)

Custom address to connect to the contract.

• **opts.signerOrProvider?**: `Provider` \| `Signer`

Signer or provider to connect to the contract.

## Returns

`Contract`

An ethers.Contract object connected to the appropriate address and interface.

## Source

src/utils/contracts.ts:43
