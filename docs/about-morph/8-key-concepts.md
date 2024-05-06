---
title: Key Concepts
lang: en-US
keywords: [morph,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!
---

## Optimistic Rollups


Optimistic Rollups are pivotal in Layer 2 scaling, designed to augment Ethereum's throughput. These protocols offload transaction processing from the main chain, delivering significant boosts in speed. Their distinct advantage lies in inheriting security directly from Ethereum Mainnet by posting transaction outcomes on-chain. In contrast to other solutions like sidechains, optimistic rollups ensure integrity and security through on-chain verification and fraud proofs. This approach, focusing on off-chain computation, can lead to scalability improvements by 10-100 times, while also reducing gas costs through efficient calldata usage.

[Learn more about Optimistic Rollups](https://ethereum.org/en/developers/docs/scaling/optimistic-rollups/)

## ZK Rollups

Zero-Knowledge Rollups (ZK-rollups) are another Layer 2 solution enhancing Ethereum's capacity. They process transactions in batches off-chain, submitting only essential summary data to Mainnet. This data encapsulates state changes and cryptographic proofs, ensuring accuracy and integrity. ZK-rollups excel in processing efficiency, allowing thousands of transactions to be handled swiftly and securely. Though the tradeoff here is that the proofs submitted by ZKRs can become quite large which eventually increase the cost.

[Explore in-depth information on ZK Rollups here.](https://ethereum.org/en/developers/docs/scaling/zk-rollups/)

## Sequencers

Sequencers are the linchpins in Layer 2 solutions, orchestrating transaction order and aggregation. In optimistic rollups, they collect, validate, and batch off-chain transactions for submission to Ethereum Mainnet. Sequencers adhere to specific rules and consensus mechanisms, upholding fairness, consistency, and verifiable security. They are integral to efficiently managing high transaction volumes within Layer 2 networks.

## Fraud Proof

Fraud Proof is a security mechanism critical to certain Layer 2 solutions. Transactions are batched and assumed valid upon submission to Ethereum, but they remain open to challenges. If fraud is suspected, a fraud proof process is initiated to verify the transaction's integrity. This method balances transaction speed with robust security.

## Validity Proof

Validity Proof is a security model where Layer 2 transactions are batched and submitted to Ethereum with accompanying proofs of their validity. Computation is performed off-chain, and the results are supplied to the main chain with assurance of their correctness. This approach enhances transaction capacity while maintaining a secure environment.

## zkEVM

zkEVM, or Zero-Knowledge Ethereum Virtual Machine, extends the traditional EVM to support zero-knowledge proofs in Layer 2 scaling solutions. It allows developers to craft smart contracts with enhanced privacy, preserving compatibility with existing Ethereum applications. zkEVM introduces privacy-focused features into Layer 2 solutions, balancing scalability with data confidentiality.

## BLS Signatures

BLS (Boneh-Lynn-Shacham) signatures are cryptographic tools essential for efficient and secure operations in Layer 2 protocols. They enable compact signature aggregation, optimizing storage and bandwidth usage. In Layer 2 environments like rollups, BLS signatures are instrumental in verifying and validating transaction logs, ensuring integrity and authenticity in a scalable manner

## Data availability

Data availability is crucial in Layer 2 scaling solutions, ensuring that all necessary transaction data is accessible to participants. This transparency is vital for security and trust, enabling participants to verify and process transactions independently. Effective data availability mechanisms are key to preventing data manipulation and maintaining the integrity of Layer 2 infrastructures.

## EIP - 4844

EIP-4844 proposes a new transaction type for Ethereum, allowing "blobs" of data to be stored temporarily in beacon nodes. This proposal aligns with Ethereum's scaling roadmap, balancing data size with disk usage management.

[Discover how EIP-4844 impacts Morph and other rollups.](https://www.eip4844.com/)
