---
title: Overview
lang: en-US
---

## Summary

1. The verification of layer 2 state can be categorized into two types: fraud proof and validity proof. However, Morphism proposes a new verification method called Responsive Validity Proof that combines the benefits of both methods.

2. The problem with fraud proofs is the wastage of capital efficiency and low security assumptions. Additionally, no OP-Rollup has implemented a permissionless fraud-proof challenge mechanism. On the other hand, although validity proofs have high security assumptions and theoretical timeliness, practical operation faces cost and efficiency issues that impede the scalability of Rollups. 

3. Morphism combines Optimistic Rollup with Validity Proof and utilizes ZK-Proof to verify the correctness of the state. This approach is different from ZK-Rollups as the ZK-proof is only generated when there is a state challenge. This method reduces the high cost of ZK-proof generation and shortens withdrawal periods based on the nature of validity proofs.

4. By implementing ZK-Proof generation and verification, Morphism can seamlessly switch to a complete ZK-Rollup in the future.