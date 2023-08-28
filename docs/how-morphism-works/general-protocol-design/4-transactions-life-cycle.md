---
title: Transactions Life Cycle
lang: en-US
keywords: [morphism,ethereum,rollup,layer2,validity proof,optimstic zk-rollup]
description: Upgrade your blockchain experience with Morphism - the secure decentralized, cost0efficient, and high-performing optimstic zk-rollup solution. Try it now!
---

## How does a L2 transaction processed on Morphism

1. Submit Transaction
   
When users initial a transaction, it will be sent to the mempool and waiting for sequencers to process.

2. Transaction Consensus
   
Transactions need to go through consensus within the sequencer network, selected sequencer will propose the block which contains the transaction. Other Sequencer will check the validity of the block hence the the validity of the transction.

3. Transaction Excution
   
Selected sequencer will order the transactions it pulled from mempool, then excuted them with the order, and update the local L2 state.
   
4. Transaction Batching
   
Selected sequencer will put transctions into blocks, and blocks into batches by the rules
   
5. Batch Sequencing
   
Batch will eventually be submitted to Layer 1 contract for verfication and data avaiability.
   
6. Batch Verification 
   
Once the batch pass through the challenge period or get proved by sequencers, the batch and the block/transction within the batch will be marked with finalized and to be considered part of the L1/L2 state.

## Morphism Transaction Status

### Processing

When a user submits a transaction to Sequencers, the transaction will go through the consensus process and be put into a block before they are excuted.

### Confirmed

This means the Sequener has excuted the transactions and updated the local L2 state. Now the transaction will be put into a batch and submitted to Layer 1 and wait for a challenge period before it can be finalized.

### Finalized

Transactions need to go through the challenge period or the corresponding block & batch is verified by a ZK-Proof to be finalized and be part of the finalized Layer 1 & Layer 2 state. 