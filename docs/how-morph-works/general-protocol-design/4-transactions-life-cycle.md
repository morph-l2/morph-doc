---
title: Transactions Life Cycle
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost-efficient, and high-performing optimistic zk-rollup solution. Try it now!
---

## How is a L2 transaction processed on Morph

1. Submit Transaction  
User-initiated transactions are first sent to the L2 node's mempool, where they await selection and processing by a sequencer.

2. Transaction Consensus  
Within the sequencer network, transactions undergo a consensus process. A selected sequencer proposes a block containing the transaction and then send the blocks to the consensus layer (consensus client).
Other sequencers then validate this block by executing this block, effectively verifying the transaction's legitimacy.

4. Transaction Execution   
Once all the votes on the block are finalized, each sequencer & node will apply this block to update its local state.
   
5. Transaction Batching  
When batch point is reached, each sequencer will need to construct the batch with all the blocks consensussed for the last epoch, the batch will go through consensus by requiring each sequencer to sign, all of the signature will be aggregated with BLS signature.
   
6. Batch Sequencing  
The [selected sequencer](../general-protocol-design/1-rollup.md) will commit the batches to the Layer 1 Rollup contract for both verification and to ensure data availability.
   
7. Batch Verification  
A batch (so do the transactions within the batch) will first go through the BLS signature verification by the rollup contract to confirm the L2 consensus results, and then a batch will go through a [challenge period](../3-optimistic-zkevm.md) to be marked as finalized, solidifying their status within the L1 and L2 state.

## Morph Transaction Status

### Processing​

Once submitted, a transaction enters the consensus phase managed by sequencers and is placed into a block pre-execution.

### Confirmed​

Post-execution by the Sequencer, the transaction’s updated state is local to L2. It is then batched and sent to L1, where it must undergo a challenge period before finalization.

### Safe

The batch that contains the transaction is submitted to Layer 1 but not finalized yet.

### Finalized​

A transaction is considered finalized after it survives the challenge period or is verified by a Zero-Knowledge Proof (ZK-Proof). Only then is it officially integrated into the final L1 and L2 state.
