---
title: Rollup
lang: en-US
keywords: [morphism,ethereum,rollup]
description: Explain how rollup process works in Morphism
---

:::info

As the foundation of a Layer 2 project, the "Rollup" process refers to the process in which Layer 2 packages L2 transactions into batches and submits them to L1 along with the new L2 state. 

Within [Morphism's architecture](../2-morphism-modular-design.md), this process is carried out by the ```Batch Submitter``` components.

:::


### An overview of Morphism Rollup Design:

![rollup](../../../assets/docs/protocol/General/rollup/rollup.png)


## Construct the batch

The L2 Node of the sequencer will generate L2 blocks based on the consensus results and update the local state of L2. The batch submitter will need to query the L2 node to retrieve the latest L2 blocks.

Then batch submitter will need to reconstructe L2 blocks into:

- Transactions : All the transactions within the blocks
- Blockinfo : Each blocks important information

The batch submitter will continue fetching and reconstructing the blocks until it processes a block with BLS signature, which means the batch point has been reached. All the reconstructed block information will be used to construct a batch. Each batch contains:

- lastBlocknumber : The block number of the last block within the batch
- Transactions : Encodes of all the transactions within the batch
- BlockWitness : Encoides of block's blockinfos, this is for zkProof
- PreStateRoot : stateRoot that before apply the batch
- PostStateRoot : stateRoot that after applying the batch
- WithdrawalRoot : L2 withdraw merkle tree root
- Signature : Batch BLS signature


:::info

Blockinfo (BlockWitness) is needed because morphism leverages zk technology to prove the correctness of the submitted batch data. It will be used as the ZK Proof witness.

:::


## Put multiple batch into 1 rollup transaction

For the majority of roll-up projects, it is common practice to include only one batch in each L1 roll-up transaction, even if there is available space to accommodate more batches.

However, in the morphism approach, we maximize efficiency by including as many batches as possible within a single roll-up transaction on Layer 1.

This strategic approach significantly aids in reducing overall costs, given that the L1 fee constitutes the major portion of the transaction costs associated with Layer 2. By optimizing the utilization of available space, morphism ensures cost-effectiveness while maintaining transaction integrity.


## Submit batch data to Rollup contract

The batch submitter will eventually send an Ethereum transaction from its Layer 1 account to Morphism's main contract.

The batch data will be contained within this transaction's calldata.


:::info

Based on the development process of ERC-4337, future batch data will be likely put into the new blob structure to reduce cost.

::: 

Once submitted and transaction is confirmed on Ethereum, validator nodes could use the transactions within the batch data to reconstruct and verify the validity of sequencers' submission.


## Finalize the batches

If batches are proven to be valid under the rules of morphism's [responsive validity proof](../responsive-validity-proof/1-overview.md), all the transactions within the batches will be finalized, including withdraw transactions. Withdrawal requests will be fulfilled, and the locked assets on Layer 1 will be freed.