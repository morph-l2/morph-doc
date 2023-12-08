---
title: Transactions Life Cycle
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimstic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimstic zk-rollup solution. Try it now!
---

## How does a L2 transaction processed on Morph

1. Submit Transaction
   
Users-initiated transactions are first sent to the mempool, where they await selection and processing by a sequencer.


2. Transaction Consensus
   
Within the sequencer network, transactions undergo a consensus process. A selected sequencer proposes a block containing the transaction. Other sequencers then validate this block, effectively verifying the transaction's legitimacy.

3. Transaction Execution
   
The chosen sequencer orders transactions retrieved from the mempool, executes them sequentially, and updates the local L2 state accordingly.
   
4. Transaction Batching
   
The sequencer compiles transactions into blocks and subsequently groups these blocks into batches according to specific rules.
   
5. Batch Sequencing
   
These batches are ultimately submitted to the Layer 1 (L1) contract for both verification and to ensure data availability.
   
6. Batch Verification 
   
After successfully facing a challenge period and once validated by sequencers, the batches, along with the transactions they contain, are marked as finalized, solidifying their status within the L1 and L2 state.

## Morph Transaction Status

### Processing​
Once submitted, a transaction enters the consensus phase managed by sequencers and is placed into a block pre-execution.

### Confirmed​
Post-execution by the Sequencer, the transaction’s updated state is local to L2. It is then batched and sent to L1, where it must undergo a challenge period before finalization.

### Finalized​
A transaction is considered finalized after it survives the challenge period or is verified by a Zero-Knowledge Proof (ZK-Proof). Only then is it officially integrated into the final L1 and L2 state.
