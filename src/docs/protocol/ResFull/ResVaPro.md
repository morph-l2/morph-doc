---
title: Why Responsive Validity Proof?
lang: en-US
---

## Challenge Process

Consistent with all Rollup Projects, when L2 transactions are executed on L2, the execution results will be uploaded to Ethereum's contract in the form of a commitment.

Typically, ZK-Rollup uploads a zk proof at the same time as the commitment is uploaded and verifies the validity of the proof in the contract. If verification passes, then the execution result is valid. However, at present, generating a zk proof incurs high costs; therefore, we use fraud proofs to ensure state validity. Similar to Optimism rollup, we also need to set a challenge period during which, if no one challenges it, it means that the results are correct. However, it is different from OP's commonly used interactive proof method for determining validity through zk-proof verification instead. This is also done for better migration towards using ZK-rollup in the future.

The challenger needs to initiate a challenge and wait for the challenged party (in this case, the sequencer) to submit proof. If the challenger succeeds, they will receive the other party's penalty as a reward.

<!-- <img decoding="async" src="src\assets\docs\protocol\ResVaPro\c1.jpg" width="50%"> -->

The illustration of the challenge initiation
1. Bob uploaded block 100 and stake. 
2. Later, Bob continued to upload subsequent blocks 101 and 102.
3. Alice discovered that the data in Bob's block 101 did not match the right results, so she challenged him by also staking
4. Waiting for Bob's response, Bob needs to submit validity proof of block 101 within a certain time frame.
       A. If Bob uploads proof within the specified time and it is successfully proved, Alice's challenge fails and she must pay the collateral as punishment to Bob.


<!-- <img decoding="async" src="src\assets\docs\protocol\ResVaPro\c1.jpg" width="50%"> -->

Status if Bob passed the validity proof
In addition, since Bob's block 101 has already provided effective proof, it will be marked as "". When its preceding block 100 is confirmed after the challenge period, block 101 will also be immediately confirmed.

If Bob fails to upload the proof within the specified time or if the proof verification fails, then Alice's challenge is successful and Bob's deposit will be forfeited to Alice.


<!-- <img decoding="async" src="src\assets\docs\protocol\ResVaPro\c1.jpg" width="50%"> -->

  Status if Bob did not pass the validity proof
  
  Afterwards, block 101 and the subsequent  block 102 will be invalidated, while the previous block 100 will belong to Alice. 
  When block 100 is confirmed by passing the challenge period, Alice can apply to get her reward.
  If block100 is challenged, there are two situations here:
  ◦ If block 100 is invalid
  Then the correct proof does not exist 
  After block 100 is challenged, the reward that was originally supposed to be given to Alice will be given to the challenger of block 100. Alice does not lose anything (except for a layer of transaction fees), but she will lose the reward. Therefore, for challengers, it is necessary to judge the validity of blocks in order. Otherwise, rewards may be taken away.
  ◦ If block 100 is valid. 
  Then Alice needs to provide proof in response to the challenge and win the challenge reward money. 
  But if Alice as an ordinary user does not have the ability to provide zkp, she can support other capable people who can provide zkp in response to challenges and win challenger's deposit as a reward. However, if no one provides zkp, then Alice's reward will be won by challengers (this scenario should theoretically not occur).

## General Rules

- The uploaded execution result, namely commitment, is based on L2 blocks. Each block has an owner (the person who has stake on it), and the rewards of that block belong to the owner. At the same time, when that block is challenged, the owner is obligated to provide proof for that block.
- In this context, a block may exist in three different states.：
  - Confirmed:  Passed challenge period or proved & previous block confirmed
  - Unconfirmed： Did not pass challenge period & can be challenged 
  - Proved：Validity being confirmed by ZK Proof but it needs to wait for the previous block to be confirmed before it can be immediately confirmed.
- After a challenger successfully challenges a certain block, if there are still unconfirmed blocks preceding that block, their reward can only be obtained after all of these blocks have been confirmed. If the previous blocks get successfully challenged, then the challenger will lose their reward and it will be transferred to the challenger of the previous block. Therefore, it is recommended for challengers to challenge blocks in order.
- For the same block, only one challenge can exist at the same time. That is, multiple people can initiate a challenge to the same block.
- For challenges involving multiple blocks, they will be blocked in order of challenge sequence, extending the corresponding challenge time.
- When an unconfirmed block becomes confirmed, the following conditions must be met:
  - The current time has exceeded the challenge period since the block was first submitted (or after the nomadic block was staked).
  - The block currently has no challenges.
- After the challenge is successful, a portion of the challenged one's deposit will be rewarded to the challenger, and another portion will be locked elsewhere (for other purposes). This prevents malicious actors from initiating challenges and intentionally delaying the upload of correct blocks.

## What will happen to Layer 2 if the challenge succeeds?

If a certain block is successfully challenged, layer 2 will be frozen, which means no new batches and commitments can be uploaded before restarting. 
If there are still challenges when frozen is needed, they will be cancelled first and each deposit will be returned before freezing. 
There could be many reasons for a successful challenge of a block, so offline investigation is needed to identify the cause of the error and resolve it before restarting layer 2.

The community needs to vote to identify the specific scenario and protocol will apply different solutions.
Specific Scenarios & Corresponding solution:
1. The proof uploader is unable to upload zkp within the specified time due to activity issues.
Re-upload the ZK Proof for this block and activate layer 2. No need to rollback any data.
2. Sequencers upload the wrong commitment
Upload a correct commitment (state change), and the layer 2 nodes in the wrong state should rollback their state data by themselves. Other layer 2 nodes that generate correct states do not need to rollback.
3. Sequencer collective wrongdoing, tampering with user transactions, resulting in transactions with invalid signatures.
Re-elect the Sequencers. All layer 2 nodes need to rollback to the state before the erroneous block, including the transaction data.

- For a project party, providing liquidity for fast withdrawal to users needs to consider the risk of block rolled back. Thus, the project is encouraged and even required to excute the withdraw transactions itself to make sure the block commitment is valid.
- In scenario 1 & 2, since the final and correct state is what matters, and the withdraw transactions still happen, withdraw liquidity provider will not suffer any losses.
- But in scenario 3, a liquidity provider needs to bear the risk of transactions rolling back, so they are suggested to verify the layer 2 tx signature when the layer 1 tx request is initiated. They are also encouraged to play the role of challengers.

</details>

## How our mechanism shortens the withdrawal period:

In the design of the entire "withdrawal period", there are mainly two factors that affect the duration of the withdrawal period:
1. How long it takes for both parties to complete the challenge process.
2. Whether it can be ensured that there is sufficient time to eliminate malicious behavior that affects normal challenges (such as maliciously blocking challengers' transactions in L1).

Regarding these two points, we can propose two solutions:
1. A more concise and direct challenge process.
2. Preventing or eliminating malicious attacks economically

### A more concise and direct challenge process.

Among the existing active Optimistic Rollups, only Arbitrum has an actual fraud proof system in operation. The fraud proof mechanisms that Arbitrum and other OP-Rollups claim to implement are mostly based on multi-round interactions for error localization and challenge implementation.

While multi-round interaction is comprehensive in terms of mechanism, it requires a certain amount of time and cost to implement. In contrast, with Responsive Validity Proof, the entire challenge only requires one interaction (Sequencer uploads the challenged part of ZK-Proof and verifies it on layer 1), greatly reducing a major problem that affects the length of the challenge period - whether sufficient time can be given to the challenged party to prove their innocence. Therefore, it is possible to shorten the challenge period from 7 days to 1-3 days.


### Preventing or eliminating malicious attacks economically (TBD)

Furthermore, considering that in the original op rollup, a malicious sequencer can attack challengers by introducing malicious transactions into a batch, which may generate higher profits to cover the cost of the attack. In our solution, if a sequencer behaves maliciously, they must prove their innocence and can not attack challengers. If a challenger behaves maliciously and initiates a layer 1 DoS attack to block sequencer submission of proof, the highest profit they can obtain is the forfeited deposit, which is difficult to cover the cost of an attack.