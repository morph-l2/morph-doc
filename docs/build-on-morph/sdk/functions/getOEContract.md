[**@morph-l2/sdk**](../README.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / getOEContract

# Function: getOEContract()

> **getOEContract**(`contractName`, `l2ChainId`, `opts`): `Contract`

Returns an ethers.Contract object for the given name, connected to the appropriate address for
the given L2 chain ID. Users can also provide a custom address to connect the contract to
instead. If the chain ID is not known then the user MUST provide a custom address or this
function will throw an error.

## Parameters

• **contractName**: `"L1MessageQueueWithGasPriceOracle"` \| `"L1GatewayRouter"` \| `"L2GatewayRouter"` \| `"MorphStandardERC20"` \| `"L2WETH"` \| `"L1WETHGateway"` \| `"L2WETHGateway"` \| `"L2ToL1MessagePasser"` \| `"Sequencer"` \| `"Gov"` \| `"L2ETHGateway"` \| `"L2CrossDomainMessenger"` \| `"L2StandardERC20Gateway"` \| `"L2ERC721Gateway"` \| `"L2TxFeeVault"` \| `"L2ERC1155Gateway"` \| `"MorphStandardERC20Factory"` \| `"GasPriceOracle"` \| `"WrappedEther"` \| `"MorphToken"` \| `"L1CrossDomainMessenger"` \| `"Staking"` \| `"Rollup"` \| `"L1ETHGateway"` \| `"L1StandardERC20Gateway"` \| `"L1ERC721Gateway"` \| `"L1ERC1155Gateway"` \| `"EnforcedTxGateway"` \| `"WETH"`

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

src/utils/contracts.ts:42
