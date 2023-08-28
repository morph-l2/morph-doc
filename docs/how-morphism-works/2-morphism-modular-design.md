---
title: Morphism Modular Design
lang: en-US
keywords: [morphism,ethereum,rollup,layer2,validity proof,optimstic zk-rollup]
description: Upgrade your blockchain experience with Morphism - the secure decentralized, cost0efficient, and high-performing optimstic zk-rollup solution. Try it now!
---



## TL;DR

1. Due to its improved composability, the modular design of blockchain has become a trend, and we have incorporated this design into the construction of Morphism.
2. The architectural design of Morphism can be divided into three parts: high-level consensus, execution, and state verification, which correspond to different functions.
3. Each part contains different components that can be combined in various ways to perform functions in different roles. Different roles also correspond to multiple components to maintain independence..

## Overview

A general Layer 2 workflow is as follows:

1. Users send transactions to sequencers.
2. Sequencers receive the transactions, generate blocks, and execute them.
3. Transactions are put into batches and submitted to Layer 1 contracts for data availability.

In addition to the basic workflow, Morphism aims to achieve a balance between decentralization, security, and scalability by implementing various measures, including:

- Sequencers needing to reach consensus with each other before executing transactions.
- Validators (any user that runs an L2 node) can start a challenge that requires sequencers to provide the zk proof.
- Sequencers can call the zkProver to generate a validity proof.

To achieve these features, we designed several modules:
- L1 Contracts
1. Consensus Staking Contract
2. Rollup Contracts
3. ZK Proof Contract
4. Challenge Contract
5. Bridge Contract
- Sequencer
  - Txns/State Submitter
  - Consensus Module
  - L2 Node
- Full Node
- Validator
- Prover
The skeletal architecture of Morphism is shown below:
![arichitecture](../../assets/docs/protocol/archi.png)

### L2 Node

L2 node plays a pivotal role in overall architecture design, serving as a hub for multiple other modules to interact and exchange information through. Various roles require L2 node as an integral part of their normal operation.

L2 node itself is also divided into different components, each with its own specific function:

### Transactions Manager (Mempool)

The L2 node will use this component to manage all Layer 2 transactions, including:

1. Accepting user-initiated transactions and storing them in the Mempool
2. Responding to the consensus layer by providing the latest transactions from the Mempool for block generation when certain conditions are met
3. Recording and storing Layer 2 transactions.

### Executor

The L2 node will maintain the real-time status of Layer 2, and currently Morphism has made some modifications to Geth specifically for ZK-Proof, using it as the execution layer. After receiving consensus-approved blocks, the L2 node applies them to the current state to achieve state transition.
Based on this logic, the execution layer ensures Ethereum compatibility and allows developers to have a consistent development experience.

### Synchronizer

There is often a need for synchronization between L2 nodes to restore network status, so the L2 node includes a synchronizer to synchronize data with each other. The frequency and functionality of synchronization vary depending on the role used. For example, for an L2 node running a sequencer, it will first synchronize blocks among various sequencers to achieve consensus, and then synchronize blocks to full nodes. As for full nodes, other roles in the network such as validator and prover will synchronize blocks from the full node to complete their work.

### Sequencers

As the most important part of the network, sequencers serve the following functions:

1. Receiving Layer 2 users' transactions and form the block (L2 Node)
2. Reach block consensus with other sequencers (Consensus)
3. Excute blocks and apply state transmission (L2 Node)
4. Batch the blocks and submit them to Layer 1 along with the new Layer 2 state ()
5. Sync the blocks with full nodes
6. Utilize provers to generate validity proof when being challenged

### Validator

Validator is a role that can be taken on by any user, and becoming a validator is completely permissionless. Validators need to determine whether the state submitted by the Sequencer to L1 is correct, and the best way to do this is to maintain an L2 Node that synchronizes transactions and state changes in L2.
When a validator identifies an incorrect state, they can trigger a challenge by calling the contract's method, which will require the sequencer to generate and submit a zk proof for the challenged block.

### Prover

Prover is an indispensable part of the Morphism architecture. When a sequencer is challenged by a validator, in order to prove its innocence, the sequencer needs to call the prover to generate zk proofs for the corresponding state change. 

The Prover module needs to maintain two components: L2 Node and zkEVM. It will synchronize the required Layer 2 transaction information through L2 Node and generate corresponding zk proofs through zkEVM component.

Under the current framework of Morphism, the prover is only called when the sequencer is challenged due to inefficient performance and high cost in generating zk proofs with current technology conditions. After relevant issues are properly resolved in the future, Morphism will be converted into a complete ZK Rollup that generates zk proof for each Layer 2 block.