---
title: Architecture - Morphism Modular Design
lang: en-US
---


## TL;DR

1. Due to its better composability, the modular design of blockchain has become a trend, and we have introduced this design into the construction of L2. 
2. The architectural design of Morph can be simply divided into three parts: high-level consensus-execution-state verification, which correspond to different network functions. 3.
3. At the same time, each part contains different components that can be combined arbitrarily to perform functions in different roles. Different roles also correspond to multiple components to maintain independence.

## Overview



A General Layer2 workflow is like this:
1. Users send transactions to sequencers
2. Sequencer receives the transaction, generates block and excute block
3. Transactions will be put into batches and submitted to Layer1 Contracts for data availability

Besides the basic workflow, by implementing various measures, Morphism aims to achieve a balance between decentralization, security, and scalability, this includes:
- Sequencers need to reach consensus with each other before executing transactions
- Validator (Any user that runs L2 Node)can start a challenge that requires Sequencers to provide the zk Proof
- Sequencers can call the zkProver to generate Validity Proof

To achieve these features, we designed several modules, they are:
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


![arichitecture](../../\assets\docs\protocol\archi.png)


### L2 Node

L2 Node plays a pivotal role in overall architecture design, serving as a hub for multiple other modules to interact and exchange information through. Various roles require L2 Node as an integral part of their normal operation.

L2 Node itself is also divided into different components, each with its own specific function:

#### Transactions Manager (Mempool)
The L2 Node will use this component to manage all Layer 2 transactions, including:
1. Accepting user-initiated transactions and storing them in the Mempool
2. Responding to the consensus layer by providing the latest transactions from the Mempool for block generation when certain conditions are met
3. Recording and storing Layer 2 transactions.

#### Executor
The L2 Node will maintain the real-time status of Layer 2, and currently Morphism has made some modifications to Geth specifically for ZK-Proof, using it as the execution layer. After receiving consensus-approved blocks, the L2 Node applies them to the current state to achieve state transition.
Based on this logic, the execution layer ensures Morphism's Ethereum compatibility and allows developers to have a consistent development experience.

#### Synchronizer
There is often a need for synchronization between L2 Nodes to restore network status, so the L2 Node includes a Synchronizer to synchronize data with each other. The frequency and functionality of synchronization vary depending on the role used. For example, for an L2 Node running Sequencer, it will first synchronize blocks among various Sequencers to achieve consensus, and then synchronize blocks to full nodes. As for full nodes, other roles in the network such as Validator and Prover will synchronize blocks from the full node to complete their work.

### Sequencers

As the most important part of the network, sequencers serve the following functions:
1. Receiving Layer 2 users' transactions and form the block (L2 Node)
2. Reach block consensus with other Sequencers (Consensus)
3. Excute blocks and apply state transmission (L2 Node)
4. Batch the blocks and submit them to Layer1 along with the new Layer 2 state ()
5. Sync the blocks with full nodes
6. Utilize provers to generate validity proof when being challenged


### Validator

Validator is a role that can be taken on by any user, and becoming a Validator is completely permissionless. Validators need to determine whether the state submitted by the Sequencer to L1 is correct, and the best way to do this is to maintain an L2 Node that synchronizes transactions and state changes in L2. 
When a Validator identifies an incorrect state, they can trigger a challenge by calling the contract's method, which will require the Sequencer to generate and submit a ZK Proof for the challenged block. 


### Prover

Prover is an indispensable part of the Morphism architecture. When Sequencer is challenged by Validator, in order to prove its innocence, Sequencer needs to call Prover to generate zk proof for the corresponding state change. In other words, the main function of Prover is to generate verifiable zero-knowledge proofs for Layer2's state changes, which determines the complexity of Prover.

The Prover module needs to maintain two components: L2 Node and zkEVM. It will synchronize the required Layer2 transaction information through L2 Node and generate corresponding proofs through zkEVM component.

Prover is an important component of Morphism. Under the current framework of Morphism, Prover is only called when Sequencer is challenged due to inefficient performance and high cost in generating ZK Proof with current technology conditions. After relevant issues are properly resolved in the future, Morphism will be converted into a complete ZK Rollup that generates ZK Proof for each Layer2 transaction.
