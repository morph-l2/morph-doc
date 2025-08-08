---
title: Key Concepts
lang: en-US
keywords: [morph,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!
---

## Optimistic Rollups


A Layer 2 scaling solution that improves transaction throughput and reduces costs by assuming transactions are valid unless challenged. During a set challenge period, validators can dispute transactions they believe are incorrect. If no disputes are raised, transactions become final. Optimistic rollups enhance scalability while maintaining security, making them effective for handling higher transaction volumes.  


[Learn more about Optimistic Rollups](https://ethereum.org/en/developers/docs/scaling/optimistic-rollups/)

## ZK Rollups

Also known as zero-knowledge rollups, this Layer 2 scaling method uses cryptographic proofs to verify transactions off-chain before submitting them to the main blockchain. Each batch is accompanied by a zero-knowledge proof, ensuring all transactions are valid without revealing sensitive data. ZK rollups provide immediate finality, strong security, and reduced computational load on the main chain.  

[Learn more about ZK Rollups](https://ethereum.org/en/developers/docs/scaling/zk-rollups/)

## Sequencers

Specialized nodes that order and bundle transactions in Layer 2 systems such as rollups. Sequencers determine transaction order, create blocks, and periodically commit them to the main blockchain. In decentralized setups, multiple sequencers improve security and remove single points of failure. They are essential for ensuring efficiency, fairness, and performance.  


## Fraud Proof

A mechanism used in optimistic rollups to validate transactions. When a sequencer submits a batch, it is assumed valid unless contested during the challenge period. If a participant detects an error, they can submit a fraud proof to the main chain. If verified, the incorrect transaction is rejected, protecting the network’s integrity while minimizing computation.  


## Validity Proof

A cryptographic proof that confirms all transactions in a batch are correct before finalization on the main chain. In ZK rollups, each batch includes a validity proof, ensuring immediate finality and eliminating the need for individual transaction verification. This improves security and reduces computational overhead.  


## zkEVM

A Zero-Knowledge Ethereum Virtual Machine that integrates zk proofs into Ethereum’s execution environment. It validates transactions off-chain and only submits valid state transitions to the main chain. zkEVM improves throughput and lowers costs while maintaining Ethereum’s security and trustless nature.

## BLS Signatures

A cryptographic technique (Boneh–Lynn–Shacham) that aggregates multiple signatures into one compact signature. This reduces data size and speeds up verification. In blockchain networks, BLS signatures allow multiple validators to collectively sign a message, improving efficiency and scalability.

## Data availability

The guarantee that all data needed to verify transactions is accessible and retrievable. In rollups, this ensures that anyone can download and check the data used in proofs, preventing finalized transactions from becoming unverifiable.

## EIP - 4844

An Ethereum Improvement Proposal introducing a new transaction type that reduces data costs and improves scalability. It allows large amounts of data to be processed more efficiently, laying the groundwork for full sharding in the future. EIP-4844 increases throughput and cost efficiency for rollups like Morph.

[Discover how EIP-4844 impacts Morph and other rollups.](https://www.eip4844.com/)
