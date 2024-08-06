[**@morph-l2/sdk**](../globals.md) • **Docs**

***

[@morph-l2/sdk](../globals.md) / L2Provider

# Type alias: L2Provider\<TProvider\>

> **L2Provider**\<`TProvider`\>: `TProvider` & `object`

Represents an extended version of an normal ethers Provider that returns additional L2 info and
has special functions for L2-specific interactions.

## Type declaration

### \_isL2Provider

> **\_isL2Provider**: `true`

Internal property to determine if a provider is a L2Provider
You are likely looking for the isL2Provider function

### estimateL1Gas()

Estimates the L1 (data) gas required for a transaction.

#### Parameters

• **tx**: `TransactionRequest`

Transaction to estimate L1 gas for.

#### Returns

`Promise`\<`BigNumber`\>

Estimated L1 gas.

### estimateL1GasCost()

Estimates the L1 (data) gas cost for a transaction in wei by multiplying the estimated L1 gas
cost by the current L1 gas price.

#### Parameters

• **tx**: `TransactionRequest`

Transaction to estimate L1 gas cost for.

#### Returns

`Promise`\<`BigNumber`\>

Estimated L1 gas cost.

### estimateL2GasCost()

Estimates the L2 (execution) gas cost for a transaction in wei by multiplying the estimated L1
gas cost by the current L2 gas price. This is a simple multiplication of the result of
getGasPrice and estimateGas for the given transaction request.

#### Parameters

• **tx**: `TransactionRequest`

Transaction to estimate L2 gas cost for.

#### Returns

`Promise`\<`BigNumber`\>

Estimated L2 gas cost.

### estimateTotalGasCost()

Estimates the total gas cost for a transaction in wei by adding the estimated the L1 gas cost
and the estimated L2 gas cost.

#### Parameters

• **tx**: `TransactionRequest`

Transaction to estimate total gas cost for.

#### Returns

`Promise`\<`BigNumber`\>

Estimated total gas cost.

### getL1GasPrice()

Gets the current L1 (data) gas price.

#### Returns

`Promise`\<`BigNumber`\>

Current L1 data gas price in wei.

## Type parameters

• **TProvider** *extends* `Provider`

## Source

src/interfaces/l2-provider.ts:43
