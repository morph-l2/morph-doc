---
title: Morph's Staking System Design
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!
---

# What is Morph Staking System?

:::tip
Currently the Staking System is in beta testing phase, the design described in this document will change as the testing process progresses, and does not represent the final experience on the Mainnet.
:::

Morph Staking is a complete economic and engineering system built upon the decentralized sequencer network to ensure the operation and security of the network.

It can be divided into 2 parts:

**ETH Staking**

On Ethereum, potential sequencers are required to stake ETH in the layer 1 staking contract to become a staker first.

The ETH staking serves to increase the cost of malicious behavior by sequencers. 

In case of confirmed dishonesty or negligence by a sequencer, the staked ETH will be slashed. The required ETH staking amount is immutable.

**Morph token Staking**

Morph token is the governance token of Morph (Gas token is ETH). In the staking system, it will play the following roles: 

Staker is elected as the sequencer according to the amount of Morph tokens that token holders have delegated to them. So stakers need to attract Morph token holders to delegate their tokens to them. Only sequencers can receive network rewards. 
Morph token holders can delegate stake their tokens to any stakers, which will determine whether stakers can be selected as sequencer. Sequencers receive rewards from the inflation of the Morph token based on the sequencer’s contribution, and delegators share a portion of the rewards based on their delegation amount.

## Roles within the Staking System:

1. Staker (Sequencer Candidate): Anyone (required in the whitelist in the early stage) can stake ETH to L1 staking contract and become a staker. Only stakers can join the sequencer election.
2. Sequencer: Sequencers are able to perform the sequencer tasks and get reward from it. Sequencers are selected according to the delegation amount of  Morph tokens.
3. Delegator: Morph token holders can delegate stake their tokens to any of the stakers. Delegators can share the rewards gained by delegated sequencer based on the delegation amounts.

## Details of sequencer set election:

The determination of the sequencer set will be based on two points:

1. Sequencers must have staked a fixed amount of ETH in Layer 1 staking contract.
2. Assuming the maximum size of the sequencer set is X, based on the delegation amount of  Morph token, select up to X sequencers from all valid candidates as sequencer set.


The sequencer set will be updated in real-time based on the above principles.

When there's a new MorphToken stake, the L2 staking contract will check if this would cause the sequencer set to change, and update the sequencer set if needed.

Joining the sequencer set means that all sequencers will have the right to participate in the current network operations to earn rewards, while also bearing the responsibility of maintaining the network's efficient and normal operation.

In practice, each sequencer, regardless of the delegation amount, has the same weight.

Sequencers can exit at any time. They need to submit an exit request on Layer 1 staking contract, then enter a lock-up period. After Layer 2 contracts complete the exit process and reach the unlocking block height, they are unlocked and could claim the staked ETH.


## Rewards & Slash

### Rewards

There are 3 potential rewards for sequencers within the Morph ecosystem.

**L2 MorphToken staking rewards.**

The Morph token is inflationary that increases 6% of the initial max total supply each year as the L2 Morph token staking rewards.

These 6% will be distributed everyday (one day is an epoch) to all the current running sequencers.

Sequencers will take commission first and distribute the rest to the delegators based on their delegation amount.

**L2 Gas Income:**

Sequencers take ETH from layer 2 users (Layer2 income) and spend ETH to submit batches to layer1 (Layer1 cost).

If the Layer1 cost is less than Layer2 income, the remaining value theoretically becomes the profit of Layer 2.

At the very beginning, the network collects all the Layer2 incomes and pays ETH to sequencers to cover their Layer 1 cost. In the future, we’ll have a more detailed plan about how this part of the funds will be utilized.

**ETH Re-staking yield:**

To improve capital efficiency, we plan to leverage staker’s ETH deposit to generate yield in restaking products, and the yield will still be allocated to stakers.



#### How to decide each sequencer’s MorphToken rewards?

This is based on the block production records.

In each epoch, the total reward received by each sequencer and their delegators is calculated as follows:

**sequencer_reward = (sequencer_produced_block / total_produced_blocks) * total_morph_token_inflation**


The sequencer rewards are eventually distributed to delegators (although sequencers can be their own delegators too). Sequencer can set a commission rate to take a share from it and the rate is adjustable.

**sequencer_commission = sequencer_reward * commission_rate**


The reward each delegator of this sequencer receives is the remaining portion multiplied by the percentage of their staked amount:

**delegator_reward = (sequencer_reward - sequencer_commission) * delegation_amount / total_delegation_amount**

The user’s delegation rewards will be calculated starting from the next epoch after the user stakes.

**Example:**

If today’s (this epoch’s) total Morph Inflation is 100, and there are 100 blocks produced in this epoch.

Sequencer A produced 10 blocks within this epoch, so he will receive:

**sequencer_reward = (sequencer_produced_block / total_produced_blocks) * total_morph_token_inflation  = (10/100) * 100 = 10 MorphToken.**

If sequencer’s commission rate is 5%

**sequencer_commission = sequencer_reward * commission_rate = 10 * 0.05 = 5 MorphToken**

If one delegator staked 100 MorphToken and then there are a total 1000 MorphToken delegated to the sequencer.

**delegator_reward = (sequencer_reward - sequencer_commission) * delegation_amount / total_delegation_amount = (100 - 5) * (100/1000) = 9.5 MorphToken**

Ideally, since the weights for each sequencer is the same, each sequencer will be able to produce the same amount of blocks within a certain epoch. Thus their rewards should be the same.

However, if the sequencer failed to perform their duties, the block production will be much lower thus their rewards would be much lower too.


### Slash

Based on the optimistic zkEVM design, there will be validators constantly verifying the batch submitted by sequencers, and if they think sequencers committed fraud, validators will start a challenge through the L1 rollup contract.

[Read more about the challenge here:](../3-optimistic-zkevm.md)

To prevent fraudulent behavior by Sequencers from affecting network security, the following rules need are established:

- Validators will challenge a fixed batch, and all sequencers who signed that batch will collectively be challenged.
- When a sequencer takes on the role of batch submitter, repeated instances of timeouts accumulating to a certain extent will result in a deduction of rewards or removal from the sequencer set. (Not fully implemented yet)
- Sequencers with long periods that have not produced blocks will be removed from the sequencer set. (Not fully implemented yet)

:::tip
The submitter rotation and submission timeout is part of decentralized rollup design, you can read the details [here](../general-protocol-design/1-rollup.md)
:::

For the reward and slash functionalities, we have 2 contracts:

- L2 Record Contract: The off-chain data affecting rewards and penalties will be collected and recorded in the L2 Record contract through an Oracle, primarily consisting of rollup data and Block data.
- L2 Distribute Contract: Sequencers and Delegator will manually claim rewards based on the Record.

## Governance:

We have a governance contract right now that decides some of the network parameters. Currently, only sequencers can create proposals and vote. 

In the next phase of the roadmap, we are planning to build a complete governance system that allows all Morph token holders to decide every aspect of the network.

## Major Process

### Staking & Sequencer Selection

Morph token staking will be divided into 2 stages based on the network status:

- Phase 1: Morph token inflation and staking rewards not started yet.
Sequencer elections will be FCFS at the beginning, but delegate stake is allowed. No morph token rewards since there is no new token generation yet.

- Phase 2: Morph token inflation and staking rewards is started.
The sequencer election will officially start and based on the delegation amount of Morph token, the rewards will start to be distributed too.

How is the sequencer set generated?

1. `L1` Staking Contract: Add potential sequencers to the whitelist.
2. `L1` Staking Contract: Potential sequencer will be able to register and stake eth on Ethereum to become eligible for sequencer election (become staker)
3. An `add staker` message will be sent as a cross-layer message from L1 staking contract to L2 staking contract.
4. `L2` Staking Contract: Will update stakers with the message synced.
5. `L2` Staking Contract: Users will be able to delegate/undelegate stake MorphToken to a staker
6. `L2` Sequencer Contract: L2 staking contract will update the sequencer set by calling L2 sequencer contact based on the ranking of the Morph token delegation amount, the top staker will be elected as sequencer.

### Sequencer network consensus & Verification on Layer 1

- Every submitted batch requires the BLS signature of more than 2/3 of the sequencers within the sequencer set to be accepted  by the L1 rollup contract.

Notice: Currently, the BLS 12-381 signature pre-compiled contract has not been implemented on Ethereum. Therefore, the L1 rollup contract cannot verify whether the batch is signed by the L2 sequencer set.
Until this functionality is available, the rollup contracts only allow batch submission from stakers included in the whitelist. This measure is in place to enable us to slash the ETH deposit in case of fraudulent submissions. After signature verification is implemented, the submitter will be permissionless and the sequencers which signed the fraudulent batch will be slashed instead of the submitter.


1. `L1` Rollup Contract: Batch submitter commits the batch to rollup contract.
2.  `L1` Rollup Contract: Rollup contract verifies the batch’s BLS signature and compares it with the sequencer set sync from L1 staking contract. It will only accept the batch if the verification passed.

### Slash for Sequencers

#### What happens if validators successfully challenge sequencers?

- Sequencer will be slashed all stake ETH and removed from sequencer set if challenger succeeds.
- Even if get proven fraud by multiple challenges, each sequencer will only be slash once
- The challenger reward for a successful challenge is a fixed proportion of the staking amount
- If the slash makes all the sequencers go down, then the L2 will stop running. We can restart by upgrading the L1 staking contract, reset stakers and sequencer sets. This does not affect the Layer 2 state as no transactions will be processed because of this.

Process:

1. `L1` Staking Contract: Slash staked ETH of sequencers who signed the fraud batch and remove them from sequencer set
2. `L1` Staking Contract: Distribute validator rewards
3. A `remove staker` message will be sent as a cross-layer message from L1 staking contract to L2 staking contract.
4. `L2`Staking Contract: Update sequencer set

### Delegation Stake

1. `L2` Staking Contract: Staker set delegation commission rate by their own will.
2. `L2` Oracle: Upload sequencers work records (block production records, submitter work records, expect work records) on the epoch basis (an epoch is a day)
3. `L2` MorphToken Contract: Mint MorphToken (inflation) as delegation reward and sent to L2 distributor contract.
4. `L2` Staking Contract: Users claim delegation reward, sequencers claim commission

### Staker/Sequencer exit

The exit lock period should be long enough to ensure that stakers and sequencers in L2 have been updated and greater than the challenge period of sequencer’s last produced block (if staker is also sequencer).


1. `L1` Staking Contract: Stakers apply to exit, the stake ETH is locked to enter the lock period
2. A `remove staker` message will be sent as a cross-layer message from L1 staking contract to L2 staking contract.
3. `L2` Staking Contract: Received the message, remove staker, and sequencers (if the staker is also sequencer)
4. `L1` Staking Contract: Withdraw allowed until reach unlock block height，remove staker info after claiming