---
title: Rollup
lang: en-US
keywords: [morph,ethereum,rollup]
description: Explain how rollup process works in Morph
---

:::info

As the foundation of a Layer 2 project, the "Rollup" process refers to the method by which Layer 2 assembles L2 transactions and state into batches and subsequently submits them to L1, along with the L2 state.

Within [Morph's architecture](../2-morph-modular-design.md), this Rollup process is executed by the ```Batch Submitter``` components.

:::

### An overview of Morph Rollup Design:

![rollup](../../../assets/docs/protocol/general/rollup/rollup.png)


## Constructing the Batch​

The L2 Node within the sequencer generates L2 blocks based on consensus results and updates the local state of L2. The batch submitter must query the L2 node to retrieve the latest L2 blocks.

The batch submitter then reconstructs L2 blocks, compiling:


- Transactions: All transactions contained within the blocks.
- Blockinfo: Essential information from each block.


The batch submitter continues fetching and reconstructing blocks until it processes a block with a BLS signature, indicating the batch point has been reached. The reconstructed block data is used to construct a batch, which contains:

- lastBlocknumber: The number of the final block in the batch.
- Transactions: Encoded transactions within the batch.
- BlockWitness: Encoded blockinfos, utilized for zkProof.
- PreStateRoot: The stateRoot before the batch is applied.
- PostStateRoot: The stateRoot after the batch is applied.
- WithdrawalRoot: L2 withdrawal Merkle tree root.
- Signature: The batch’s BLS signature.


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

Based on the development process of ERC-4337, future batch data will likely be incorporated into a new ‘blob’ structure to further decrease costs.

::: 

Once the transaction is submitted and confirmed on Ethereum, validator nodes can reconstruct and verify the validity of sequencers' submissions using the transactional data within the batch.


## Finalize the batches

If batches are valid according to Morph's [responsive validity proof](../3-optimistic-zkevm.md) standards, all transactions within the batches will be finalized, including withdrawal transactions. 

Consequently, withdrawal requests will be fulfilled, and the corresponding locked assets on Layer 1 will be released.


# Decentralize Batch Submitter


## What is Batch Submitter?



A Batch Submitter plays a crucial role in the "rollup" process, acting as the bridge that connects Layer 2 (L2) data with Ethereum (Layer 1 or L1). Their primary responsibilities include:
- Collecting L2 transactions and block data, assembling them into a cohesive batch.
- Embedding this batch data within a Layer 1 transaction.
- Executing this transaction by calling the Layer 1 contract to complete the rollup process.


![rollup](../../../assets/docs/protocol/general/rollup/rollup.png)

## What is the relationship between Sequencers & Batch Submitters？

The Batch submitter function is often integrated within the broader 'sequencer' role. In a decentralized sequencer network architecture, each sequencer is equipped with or has access to a batch submitter component. This integration is key to achieving and maintaining the highest levels of decentralization.

This structure ensures that the data uploaded to Layer 1 remains decentralized, preventing a single entity from controlling the rollup process.

## How to decentralize the Batch Submitter？

To uphold the aforementioned principles, it is essential to ensure that multiple sequencers can share rollup tasks evenly within the same time frame. Our approach to achieving this involves a rotation system for sequencers to take turns with the responsibility of calling the batch submitter, as detailed below:

### Submitter Rotation

- **Epoch Cycle Role Switching**: Sequencers alternate roles as batch submitters within an established Epoch cycle.
- **Cross-Epoch Execution Capability**: Any Sequencer can perform a Rollup for another Sequencer's Epoch.
- **Timeout Logging**: The system records instances when not a single rollup happens during an epoch, the epoch will be marked as “timeout” as well as the responsible sequencer.

### Timeout

- **Timeout Identification**: If an epoch passes without a rollup (batch submission), it's identified as a "timeout." The timing of a rollup is pegged to the confirmation time of the Layer 1 rollup transaction.

- **Epoch Rotation**: The duration of an epoch and the rotation schedule are governed by the sequencer network governance. Sequencers are assigned indexes which determine their responsibility for an epoch. With changes in the sequencer set, indexes are reassigned, and epochs rotate accordingly based on these new assignments.

### Penalties for Timeout
- **Accumulated Penalties**: Sequencers that frequently exhibit timeout behaviors may face penalties that related to their Layer 1 ETH staking, if the timeout records reaches to a certain level, sequencer may/will be slashed from the sequencer network.

## Module Design

Below you can find the contracts that are responsible for each module and their responsibilities:

### Layer1
- **RollupContract**: records the rollup executor and sync with L2

### Layer2
- **SequencerContract**: Sync Sequencers
- **GovContract**: Manage Batch & Epoch Parameters
- **SubmitterContract**:
  - Record Epoch information
  - Record Rollup history
  - Record Submitter Workload
  - Record Submitter Timeouts
- **IncentiveContract**: Conducts Incentive and Penalty actions

