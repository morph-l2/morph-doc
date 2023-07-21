---
title: Understand Transaction cost on Morphism
lang: en-US
---

Transaction fees on Morphism work a lot like fees on Ethereum.
However, Layer 2 introduces some new paradigms that means it can never be exactly like Ethereum.
Luckily, Morphism's EVM equivalence makes these differences easy to understand and even easier to handle within your app.

This page includes the formula for calculating the gas cost of transactions on Morphism.


<!--You can also [use our SDK]() to calculate those costs for you. -->
 

There are two costs for transaction on Morphism: the L2 execution fee and the L1 data/security fee.

## The L2 execution fee

Just like on Ethereum, transactions on Morphism have to pay **gas** for the amount of computation and storage that they use.

Every L2 transaction will pay some **execution fee**, equal to the amount of gas used by the transaction multiplied by the gas price attached to the transaction.

We support [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) as a way to process L2 transaction fee.

In EIP-1559 the cost of a unit of gas is composed of two components:

- **Base fee**: This fee is the same for all transactions in a block. It varies between blocks based on the difference between the actual size of the blocks (which depends on the demand for block space) and the target block size. When the block uses more gas than the target block size the base fee goes up to discourage demand. When the block uses less gas than the target block size the base fee goes down to encourage demand.
- **Priority fee**: This fee is specified in the transaction itself and varies between transactions. Block proposers are expected to select the transactions that offer them the highest priority fees first.

There are some differences between Ethereum and Morphism in this regard:

- ETH is not burned. Burning ETH on L2 would only lock it in the bridge forever.
- Some EIP 1559 parameters are different:

  | Parameter | Morphism value | Ethereum value (for reference) |
  | - | -: | -: |
  | Block gas limit | 30,000,000 gas | 30,000,000 gas
  | Block gas target | 5,000,000 gas | 15,000,000 gas
  | EIP-1559 elasticity multiplier | 6 | 2
  | EIP-1559 denominator | 50 | 8
  | Maximum base fee increase (per block) | 10% | 12.5%
  | Maximum base fee decrease (per block) | 2% | 12.5%
  | Block time in seconds | 2 | 12


From an application development perspective, EIP-1559 introduces the following changes:

- The `BASEFEE` opcode is now supported. The `BASEFEE` opcodes returns the base fee of the current block.
- The `eth_maxPriorityFeePerGas` and `eth_feeHistory` RPC methods are now supported. `eth_maxPriorityFeePerGas` returns a fee per gas that is an estimate of how much you can pay as a priority fee, or 'tip', to get a transaction included in the current block. `eth_feeHistory` returns a collection of historical gas information from which you can decide what to submit as your `maxFeePerGas` and/or `maxPriorityFeePerGas`.



Here's the (simple) math:

```
l2_execution_fee = transaction_gas_price * l2_gas_used

transaction_gas_price = l2_base_fee + l2_priority_fee

```

The amount of L2 gas used depends on the particular transaction that you're trying to send.
Thanks to EVM equivalence, transactions typically use approximately the same amount of gas on Morphism as they do on Ethereum.

<!---->
<!--
/* Gas prices fluctuate with time and congestion, but you can always check the current estimated L2 gas price on the [public Morphism dashboard](https://optimism.io/gas-tracker).-->


## The L1 data fee

Morphism differs from Ethereum because all transactions on Morphism are also published to Ethereum.

This step is crucial to the security properties of Morphism because it means that all of the data you need to sync an Morphism node is always publicly available on Ethereum.

It's what makes Morphism an L2.

Users on Morphism have to pay for the cost of submitting their transactions to Ethereum.

We call this the **L1 data fee**, and it's the primary discrepancy between Morphism (and other L2s) and Ethereum.

Because the cost of gas is so expensive on Ethereum, the L1 data fee typically dominates the total cost of a transaction on Morphism.

This fee is based on four factors:

1. The current gas price on Ethereum - l1_base_fee
2. The gas cost to publish the transaction to Ethereum. This scales roughly with the size of the transaction (in bytes) - tx_data_gas
3. A fixed overhead cost denominated in gas. This is currently set to 2100.
4. A dynamic overhead cost which scales the L1 fee paid by a fixed number. This is currently set to 1.0. (which shows in GasPriceOracle.sol as scaler/1e9 )

Here's the math:

```
l1_data_fee = l1_base_fee * (tx_data_gas + fixed_overhead) * dynamic_overhead
```

Where `tx_data_gas` is:

```
tx_data_gas = count_zero_bytes(tx_data) * 4 + count_non_zero_bytes(tx_data) * 16
```
:::tip
You can read the parameter values from the [gas oracle contract](https://github.com/morphism-labs/contracts/blob/main/contracts/L2/GasPriceOracle.sol).
:::


<!--
::: warning NOTE
Ethereum has limited support for adding custom transaction types.
As a result, unlike the L2 execution fee, **users are not able to set limits for the L1 data fee that they may be charged**.
The L1 gas price used to charge the data fee is automatically updated when new data is received from Ethereum.
**Spikes in Ethereum gas prices may result in users paying a higher or lower than estimated L1 data fee, by up to 25%.**

[See here for a detailed explanation why the difference is capped at 25%](https://help.optimism.io/hc/en-us/articles/4416677738907-What-happens-if-the-L1-gas-price-spikes-while-a-transaction-is-in-process).
:::
-->

## Transaction fees' effect on software development

### Sending transactions

The process of sending a transaction on Morphism is identical to the process of sending a transaction on Ethereum.

When sending a transaction, you should provide a gas price greater than or equal to the current L2 gas price.

Like on Ethereum, you can query this gas price with the `eth_gasPrice` RPC method.

Similarly, you should set your transaction gas limit in the same way that you would set your transaction gas limit on Ethereum (e.g. via `eth_estimateGas`).

### Responding to gas price updates

Gas prices on L2 default to 0.001 Gwei but can increase dynamically if the network is congested.

When this happens, the lowest fee that the network will accept increases.

Unlike Ethereum, Morphism currently does not have a mempool to hold transactions with too low a fee.

Instead, Morphism nodes will reject the transaction with the message `Fee too low`.

You may need to handle this case explicitly and retry the transaction with a new gas price when this happens.

### Displaying fees to users

Many Ethereum applications display estimated fees to users by multiplying the gas price by the gas limit.

However, as discussed earlier, users on Morphism are charged both an L2 execution fee and an L1 data fee.

As a result, you should display the sum of both of these fees to give users the most accurate estimate of the total cost of a transaction.

<!--
[See here for a code sample using the JavaScript SDK](https://github.com/ethereum-optimism/optimism-tutorial/tree/main/sdk-estimate-gas)
-->

#### Estimating the L2 execution fee

You can estimate the L2 execution fee by multiplying the gas price by the gas limit, just like on Ethereum.

#### Estimating the L1 data fee
<!--
You can use the SDK [(see here)](https://github.com/ethereum-optimism/optimism-tutorial/tree/main/sdk-estimate-gas).
-->
<!--
Alternatively, you can estimate the L1 data fee using the `GasPriceOracle` predeployed smart contract located at [`0x420000000000000000000000000000000000000F`]().
[The `GasPriceOracle` contract](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/L2/predeploys/OVM_GasPriceOracle.sol) is located at the same address on every Morphism network (mainnet and testnet).
To do so, call `GasPriceOracle.getL1Fee(<unsigned RLP encoded transaction>)`.
-->




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

This is a custom RPC error that Morphism returns when a transaction is rejected because the gas price is too low.
See the section on [Responding to gas price updates](#responding-to-gas-price-updates) for more information.

### Gas price too high
- Error code: `-32000`
- Error message: `gas price too high: X wei, use at most tx.gasPrice = Y wei`

This is a custom RPC error that Morphism returns when a transaction is rejected because the gas price is too high.
We include this as a safety measure to prevent users from accidentally sending a transaction with an extremely high L2 gas price.
See the section on [Responding to gas price updates](#responding-to-gas-price-updates) for more information.