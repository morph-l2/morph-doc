---
title: How does RVP applied in Morphism
lang: en-US
---

![RVP](../../../assets/docs/protocol/ResVaPro/res1.jpg)

## TL;DR

1. Validators will need to constantly verify the transactions and new state sequencers submitted to Layer 1.
2. If they find the txns & states are not correct, they will initial the challenge.
3. Sequencers need to answer the challenge by providing ZK-Proof and pass verification
4. If Sequencer can't finish the verification process during a certain period, the fraud behaviour is settled.


:::tip

In this sections, the two challenger counter parties would be referred as the role in the challenge process sometime.

- Challenger is Validator
- The challenged is Seuqencer
:::

## Pre Challenge

### Sequencer：

When a Sequencer is elected, they will stake a fixed amount of assets at once, which will serve as the cryptographic economic guarantee for the validity of the batch they submit. 

If a batch submitted by the Sequencer is proven to be fraudulent, the stake of the Sequencer will be confiscated and they will be removed from the Sequencer network depending on the situation.

### Validator:

Validators use the calldata of transaction submitted by Sequencer through sequencer commit transaction to extract transaction data and corresponding batch state claimed by Sequencer. 

First, Validators verify the validity of these transactions alone. If verification fails, they may initiate a challenge. 

Validators execute batch transactions based on the previous batch state they have maintained to obtain a new state tree, from which they extract a new stateroot. 

By comparing the new stateroot (validator) with the batch stateroot (sequencer), it can be confirmed whether the Sequencer has committed fraud. 

If the two are the same, the validator takes no action and continues to wait for the verification of the next sequencer batch submission. 

If the two are different, the challenger calls the challenge method of the challenge contract to initiate a challenge and must transfer a certain amount of assets to the challenge contract as collateral.

## Process challenge

When Layer 1 receives a challenge request, it generates a challenge including the initiating challenge address, challenge initiation time, stake amount, challenged batch, challenge status, and other information, and triggers an event. 

By monitoring the event, the Sequencer can determine if the submitted Batch has been challenged. 

If challenged, the Sequencer needs to complete the following operations before the end of the challenge period: 

1. Call ZK Prover to initiate a request to generate the ZK Proof for the Batch and provide corresponding parameters 
2. Obtain the ZK Proof from the ZK Prover once it is generated 
3. Submit the ZK Proof to the Layer 1 contract for verification 

As long as the challenge period has not ended, the Sequencer can continue to initiate proof verification operations.

### How to determine the success or failure of a challenge?

#### A challenge is considered successful if any of the following conditions occur:

• The Sequencer fails to submit a ZK Proof within the challenge period.

• The Sequencer submits a ZK Proof during the challenge period, but it fails to pass verification.

• The Sequencer submits a Proof during the challenge period, and it is still being verified at the end of the challenge period, but the verification fails.

This can also be summarized as the Sequencer failing to submit a valid ZK Proof within the challenge period.

#### A challenge is only considered failed if:

• The Sequencer submits a ZK Proof during the challenge period and ultimately passes the Proof verification.

## After Challenge

### If challenge fails:

If a Validator successfully challenges, they will receive a generous reward while also making an important contribution to the security of the network. However, if there are malicious challenges, it can also disrupt the normal operation of the network. For example, a malicious challenge against the Sequencer could result in the Sequencer having to pay the cost of generating ZK Proofs while also slowing down the confirmation of the challenged Batch.

Therefore, when initiating challenges, Validators need to stake some funds. If the challenge fails, meaning that there was no issue with the challenged Batch, the Validator's stake funds will be fully seized. 80% of the seized funds will be given to the DAO treasury, while 20% will be paid to the challenged Sequencer.

### If the challenge is successful

In most cases, Sequencer wants to extract long-term benefits by reliably providing services, but we can not assume that fraudulent situations will not occur. 
Depending on the reasons, we need to have different handling for a successful challenge:

First of all, regardless of the reason for the successful challenge, the main contract will be paused to prevent subsequent batches from being submitted to Layer1.

This pause operation will be executed by the account that controls the main contract and is controlled by the DAO, and all other ongoing challenges will be canceled, with the stake returned to each party.

A successful challenge means that no valid ZK Proof was verified within the specified time, which is usually due to one of the following reasons:

1. Due to the liveness issue of the Sequencer, the Proof was not submitted in time.
2. The Sequencer submitted an incorrect Commitment, resulting in the inability to generate the correct Proof.
3. The Sequencer collectively engaged in malicious behavior and forged invalid transactions to break through the Layer 2 consensus, resulting in the inability to generate the correct Proof.
4. The vulnerability of Layer 2 itself resulted in the mechanism not functioning properly.

Specific situations need to be investigated by professionals and ultimately reflected on the chain through DAO voting.

The handling methods for these four situations are as follows:

#### Due to the liveness issue of the Sequencer, the Proof was not submitted in time.

- The address controlled by the DAO will generate a corresponding ZK Proof and be verified, and the Sequencer corresponding to this Batch will be penalized with 40% of their staked funds to the corresponding challenger, with an additional 10% of their staked funds being penalized to the DAO treasury for paying the cost of ZK Proof and other purposes. 

- In this case, the Layer 2 status synchronized by each node is not problematic, so no action is required from other network participants.

- After the ZK Proof is verified, the main contract will be restarted by the DAO and continue to operate normally.

#### The Sequencer submitted an incorrect Commitment, resulting in the inability to generate the correct Proof.

- The Sequencer corresponding to this Batch will have 80% of the staked funds penalized and given to the corresponding challenger, with an additional 20% of the staked funds penalize and deposited into the DAO treasury.

- The investigation team will continue to investigate the validity of the previous Batch's state, and ultimately provide a Batch validity report to the DAO. Once approved by the DAO, Layer 2 will be restarted and all Layer 2 states will be considered valid.

- All nodes need to continue operating according to the new Layer 2 state.

#### The Sequencer collectively engaged in malicious behavior and forged invalid transactions to break through the Layer 2 consensus, resulting in the inability to generate the correct Proof.

- All Sequencers involved in wrongdoing will have 80% of their staked funds penalized and given to the corresponding challenger, and an additional 20% of their staked funds seized and deposited into the DAO treasury.

- The investigation team will continue to verify the validity of previous Batches and ultimately provide a Batch validity report to the DAO. Once approved by the DAO, Layer 2 will be restarted with all Layer 2 states being valid.

- All nodes must continue to operate according to the new Layer 2 state.


#### The vulnerability of Layer 2 itself resulted in the mechanism not functioning properly.

- After confirming that there is a problem with the Layer 2 service itself (such as a code error), the relevant responsible party will compensate for the loss towards DAO and return the corresponding challenge's stake to both parties.