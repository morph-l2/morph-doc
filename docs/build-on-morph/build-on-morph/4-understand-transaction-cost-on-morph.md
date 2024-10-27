---
title: Understand Transaction Cost on Morph
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!
---

Transaction fees on Morph work similarly to fees on Ethereum. However, Layer 2 introduces some unique aspects. Morph's optimistic zkEVM makes these differences easy to understand and even easier to handle. 

This page includes the formula for calculating the gas cost of transactions on Morph.
There are two kinds of costs for transactions on Morph: the L2 execution fee and the L1 data/security fee.


<!--
:::tip

The transaction fees are collected into the `SequencerFeeVault` contract balance. This contract also tracks the amount we’ve historically withdrawn to L1 using `totalProcessed()(uint256)`.

The block producer receives no direct reward, and the `COINBASE` opcode returns the fee vault address.

:::
-->

## The L2 execution fee

Like Ethereum, transactions on Morph incur gas costs for computation and storage usage.

Every L2 transaction will pay some **execution** fee, equal to the amount of gas used multiplied by the gas price of the transaction.

Morph supports EIP-1559 transaction type. The EIP-1559 pricing model, which comprises a base fee and a priority fee, contributes to a more predictable and stable transaction fee.

The formula is straightforward:
```
l2_execution_fee = l2_gas_price * l2_gas_used
l2_gas_price = l2_base_fee + l2_priority_fee
```

The amount of L2 gas used depends on the specific transaction. Due to EVM compatibility, gas usage on Morph is typically similar to Ethereum.


## The L1 data fee

Morph transactions are also published to Ethereum, crucial to Morph’s security as it ensures all data needed to verify Morph's state is always publicly available on Ethereum. 

Users must pay for the cost of submitting their transactions to Ethereum, known as the L1 data fee. This fee typically represents most of the total cost of a transaction on Morph.

Formula:

```
l1DataFee = (l1BaseFee * commitScalar + l1BlobBaseFee * tx_data_gas * blobScalar) / rcfg.Precision
```

where tx_data_gas is

```
tx_data_gas = count_zero_bytes(tx_data) * 4 + count_non_zero_bytes(tx_data) * 16
```

And other parameters:

1. l1BaseFee：Layer1 base fee
2. commitScalar: a factor used to measure the gas cost for data commitment
3. l1BlobBaseFee: the blobBaseFee on L1
4. blobScalar: a factor used to measure the gas cost for one transaction to be stored in EIP-4844 blob


:::tip
You can read the parameter values from the GasPrice oracle contract. Morph has pre-deployed `GasPriceOracle`, accessible on Morph Holesky at [GasPriceOracle](https://explorer-holesky.morphl2.io/address/0x530000000000000000000000000000000000000F).
:::



## Transaction fees' effect on software development

### Sending transactions

The process of sending a transaction on Morph is identical to sending a transaction on Ethereum.

When sending a transaction, you should provide a gas price that is greater than or equal to the current L2 gas price.

Like on Ethereum, you can query this gas price with the `eth_gasPrice` RPC method.

Similarly, you should set your transaction gas limit in the same way that you would set it on Ethereum (e.g. via `eth_estimateGas`).


### Displaying fees to users

Many Ethereum applications display estimated fees to users by multiplying the gas price by the gas limit.

However, as discussed earlier, users on Morph are charged both an L2 execution fee and an L1 data fee.

As a result, you should display the sum of both of these fees to give users the most accurate estimate of the total cost of a transaction.


#### Estimating the L2 execution fee

You can estimate the L2 execution fee by multiplying the gas price by the gas limit, just like on Ethereum.

#### Estimating the L1 data fee

You can utilize the pre-deployed `L1GasPriceOracle` at `0x5300000000000000000000000000000000000002`. It offers a `getL1Fee` method to estimate the L1 data fee for the raw data of a given transaction.

```javascript
function getL1Fee(bytes memory _data) external view override returns (uint256);
```

:::tip

Once the sequencer has processed a transaction, a user's L1 fee is secured, and any fluctuations will not impact what a user pays.

Due to Morph's ~1s block time, any changes in L1 gas between a transaction's submission and its inclusion in a block should be minimal. The sequencer will account for any variations in L1 gas costs between a transaction's inclusion in a block and when the sequencer commits the data to L1.

:::


#### Estimating the total fee

You can estimate the total fee by combining your estimates for the L2 execution fee and L1 data fee.

### Sending max ETH

Sending the maximum amount of ETH that a user has in their wallet is a relatively common use case.

When doing this, you will need to subtract the estimated L2 execution fee and the estimated L1 data fee from the amount of ETH you want the user to send.

Use the logic described above for estimating the total fee.

## Common RPC Errors

### Insufficient funds

- Error code: `-32000`
- Error message: `invalid transaction: insufficient funds for l1Fee + l2Fee + value`

You'll get this error when attempting to send a transaction and you don't have enough ETH to pay for the value of the transaction, the L2 execution fee, and the L1 data fee.
You might get this error when attempting to send max ETH if you aren't properly accounting for both the L2 execution fee and the L1 data fee.

### Gas price too low

- Error code: `-32000`
- Error message: `gas price too low: X wei, use at least tx.gasPrice = Y wei`

This is a custom RPC error that Morph returns when a transaction is rejected because the gas price is too low.
See the section on [Responding to gas price updates](#responding-to-gas-price-updates) for more information.

### Gas price too high
- Error code: `-32000`
- Error message: `gas price too high: X wei, use at most tx.gasPrice = Y wei`

This is a custom RPC error that Morph returns when a transaction is rejected because the gas price is too high.
We include this as a safety measure to prevent users from accidentally sending a transaction with an extremely high L2 gas price.
See the section on [Responding to gas price updates](#responding-to-gas-price-updates) for more information.