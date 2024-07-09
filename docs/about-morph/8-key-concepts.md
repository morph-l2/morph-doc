---
title: Key Concepts
lang: en-US
keywords: [morph,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!
---

## Optimistic Rollups


Optimistic rollups are a Layer 2 scaling solution for blockchains that enhance transaction throughput and reduce costs by assuming transactions are valid and only verifying them if a challenge is raised. This method relies on a challenge period during which validators can dispute transactions they believe to be incorrect. If no disputes are raised, the transactions are considered final. Optimistic rollups significantly improve scalability while maintaining security, making them an efficient solution for handling a higher volume of transactions on blockchain networks.

[Learn more about Optimistic Rollups](https://ethereum.org/en/developers/docs/scaling/optimistic-rollups/)

## ZK Rollups

ZK rollups, or zero-knowledge rollups, are a Layer 2 scaling solution that uses cryptographic proofs to verify the validity of transactions off-chain before bundling them and submitting a proof to the main blockchain. Each batch of transactions is accompanied by a zero-knowledge proof, which ensures that all transactions within the batch are valid without revealing the underlying data. This method provides immediate finality and high security, as the main chain only needs to verify the proof rather than each individual transaction, significantly reducing the computational load and enhancing scalability.

[Learn more about ZK Rollups](https://ethereum.org/en/developers/docs/scaling/zk-rollups/)

## Sequencers

Sequencers are specialized nodes responsible for ordering and bundling transactions in Layer 2 scaling solutions like rollups. They play a crucial role in determining the sequence of transactions, creating blocks, and periodically committing these blocks to the main blockchain. In decentralized systems, multiple sequencers work together to enhance security and prevent single points of failure. By ensuring transactions are processed efficiently and securely, sequencers help maintain the integrity and performance of Layer 2 networks.

## Fraud Proof

Fraud proof is a mechanism used in blockchain scaling solutions like optimistic rollups to ensure transaction validity. When a sequencer submits a batch of transactions, they are assumed to be valid unless contested. During a designated challenge period, any validator or network participant can submit a fraud proof if they detect an incorrect transaction. This proof involves verifying the transaction data and demonstrating the error to the main blockchain. If the fraud proof is validated, the incorrect transaction is rejected, ensuring the integrity and security of the network while minimizing computational costs.

## Validity Proof

Validity proof is a cryptographic method used to ensure that transactions within a rollup are correct before they are finalized on the main blockchain. In systems like ZK rollups, each batch of transactions is accompanied by a validity proof that verifies the correctness of all transactions within the batch. This approach enhances security and efficiency by eliminating the need for individual transaction verification on the main chain, providing immediate finality and reducing computational overhead.

## zkEVM

zkEVM, or Zero-Knowledge Ethereum Virtual Machine, is an advanced implementation of the Ethereum Virtual Machine that integrates zero-knowledge proofs to enhance scalability and security. By using zk proofs, zkEVM allows for the validation of transactions off-chain, ensuring that only valid state transitions are submitted to the main chain. This method provides high throughput and lower transaction costs while maintaining the security and trustlessness of Ethereum.

## BLS Signatures

BLS (Boneh-Lynn-Shacham) signatures are a cryptographic technique used to aggregate multiple signatures into a single compact signature. This is particularly useful in blockchain networks for reducing the data size and improving the efficiency of transaction verification. BLS signatures enable multiple validators to sign a message collectively, resulting in a single signature that can be verified quickly and cost-effectively, enhancing the overall scalability of the network.

## Data availability

Data availability refers to the assurance that all necessary data for verifying blockchain transactions is accessible and retrievable. In the context of rollups, ensuring data availability is crucial for maintaining the integrity and security of off-chain transactions. It guarantees that anyone can download and verify the data used in rollup proofs, preventing scenarios where transactions are finalized without the possibility of verification.

## EIP - 4844

EIP-4844, also known as Proto-Danksharding, is an Ethereum Improvement Proposal aimed at introducing a new type of transaction that reduces data costs and improves scalability. It involves adding a new transaction format that can efficiently handle large amounts of data, laying the groundwork for future sharding implementations. This proposal enhances the network's ability to manage data more effectively, contributing to overall improvements in throughput and cost-efficiency.

[Discover how EIP-4844 impacts Morph and other rollups.](https://www.eip4844.com/)
