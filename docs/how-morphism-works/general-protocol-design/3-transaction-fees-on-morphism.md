---
title: Transaction fees on Morphism
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

This is exactly how fees work on Ethereum with the added bonus that gas prices on Morphism are seriously low.

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
<!--You can read the parameter values from the [gas oracle contract]().-->


<!--
::: warning NOTE
Ethereum has limited support for adding custom transaction types.
As a result, unlike the L2 execution fee, **users are not able to set limits for the L1 data fee that they may be charged**.
The L1 gas price used to charge the data fee is automatically updated when new data is received from Ethereum.
**Spikes in Ethereum gas prices may result in users paying a higher or lower than estimated L1 data fee, by up to 25%.**

[See here for a detailed explanation why the difference is capped at 25%](https://help.optimism.io/hc/en-us/articles/4416677738907-What-happens-if-the-L1-gas-price-spikes-while-a-transaction-is-in-process).
:::
-->

