---
title: Rollup
lang: en-US
keywords: [morph,ethereum,rollup]
description: Explain how rollup process works in Morph
---

:::info

As the foundation of a Layer 2 project, the "Rollup" process refers to the method by which Layer 2 assembles L2 transactions into batches and subsequently submits them to L1, along with the L2 state.

Within [Morph's architecture](../2-morph-modular-design.md), this Rollup process is executed by the ```Batch Submitter``` components.

:::

### An overview of Morph Rollup Design:

![rollup](../../../assets/docs/protocol/general/rollup/rollup.png)


## Constructing the Batch​

The L2 Node within the sequencer generates L2 blocks based on consensus results and updates the local state of L2. The batch submitter must query the L2 node to retrieve the latest L2 blocks.

The batch submitter then reconstructs L2 blocks, compiling:


- Transactions: All transactions contained within the blocks.
- Blockinfo : Essential information from each block.


The batch submitter continues fetching and reconstructing blocks until it processes a block with a BLS signature, indicating the batch point has been reached. The reconstructed block da is used to construct a batch, which contains:

- lastBlocknumber : The number of the final block in the batch
- Transactions : Encoded transactions within the batch.
- BlockWitness : Encoded blockinfos, utilized for zkProof
- PreStateRoot : The stateRoot before the batch is applied.
- PostStateRoot : The stateRoot after the batch is applied.
- WithdrawalRoot : L2 withdrawal Merkle tree root.
- Signature : The batch’s BLS signature.


:::info

Blockinfo (BlockWitness) is needed since Morph employs zk technology to prove the accuracy of submitted batch data. It serves as a witness in the Zero-Knowledge Proof.

:::


## Putting Multiple Batches into a Single Rollup Transaction​


 While it's standard for roll-up projects to include only one batch per L1 roll-up transaction, Morph optimizes by inserting as many batches as feasible into a single L1 transaction.

This efficiency-driven approach significantly reduces overall costs, as the L1 fee is a predominant component of the transaction costs associated with the L2. By optimizing the utilization of available space, Morph achieves cost-effectiveness without compromising transaction integrity.



## Submitting Batch Data to the Rollup Contract​

The batch submitter will eventually send an Ethereum transaction from its L1 account to Morph's main contract.

The transaction's calldata contains the batch data.

:::info

Based on the development process of ERC-4337, future batch data will likely be incorporated into a new ‘tree’ structure to further decrease costs.

::: 

Once the transaction is submitted and confirmed on Ethereum, validator nodes can reconstruct and verify the validity of sequencers' submissions using the transactional data within the batch.


## Finalize the batches

If batches are valid according to Morph's [responsive validity proof](../responsive-validity-proof/1-overview.md) standards, all transactions within the batches will be finalized, including withdrawal transactions. 

Consequently, withdrawal requests will be fulfilled, and the corresponding locked assets on Layer 1 will be released.
