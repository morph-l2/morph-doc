---
title: Transaction fees on Morph
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimstic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimstic zk-rollup solution. Try it now!
---

On Morph, transaction fees share similarities with those on Ethereum, but the Layer 2 environment introduces distinct aspects that preclude a direct one-to-one comparison. Fortunately, Morph’s commitment to EVM compatibility simplifies these distinctions, facilitating a seamless and manageable experience within your applications.

Outlined below is the formula used to calculate gas costs associated with transactions on Morph.

There are two cost components for a transaction on Morph: the L2 execution fee and the L1 data/security fee.


<!--You can also [use our SDK]() to calculate those costs for you. -->


## The L2 execution fee

Transactions on Morph, much like those on Ethereum, incur **gas** fees proportional to the computation and storage they consume.

Every L2 transaction incurs some **execution fee**, which is the product of the gas used by the transaction and the gas price specified for that transaction.

This mirrors fees on  Ethereum, with the added advantage that gas prices on Morph are significantly lower.

The calculation is straightforward:

```
l2_execution_fee = transaction_gas_price * l2_gas_used

transaction_gas_price = l2_base_fee + l2_priority_fee

```

The amount of L2 gas consumed depends on the particular transaction in question. Due to EVM compatibility, transactions typically use approximately the same amount of gas on Morph as they do on Ethereum.


## The L1 data fee

Morph diverges from Ethereum in that it also commits all transactions to Ethereum’s blockchain. This step is crucial to Morph’s security model, ensuring the data necessary to synchronize a Morph node is always publicly available on Ethereum, thereby classifying Morph as a true Layer 2 solution.

Users on Morph cover the costs associated with transmitting their transactions to Ethereum. This is referred to as the L1 data fee, and it's the primary cost discrepancy between Morph (or other L2s) and Ethereum.

Due to Ethereum’s higher gas costs, the **L1 data fee** typically constitutes the majority of a transaction’s total cost on Morph.


This fee is based on four factors:

1. The current gas price on Ethereum - l1_base_fee
2. The gas cost to publish the transaction to Ethereum. This scales roughly with the size of the transaction (in bytes) - tx_data_gas
3. A fixed overhead cost denominated in gas. This is currently set to 2100.
4. A dynamic overhead cost which scales the L1 fee paid by a fixed number. This is currently set to 1.0. (which shows in GasPriceOracle.sol as scaler/1e9 )

The mathematical representation is as follows:

```
l1_data_fee = l1_base_fee * (tx_data_gas + fixed_overhead) * dynamic_overhead
```

Where `tx_data_gas` is:

```
tx_data_gas = count_zero_bytes(tx_data) * 4 + count_non_zero_bytes(tx_data) * 16
```

