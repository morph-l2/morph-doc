---
title: Morphism's decentralized sequencer network
lang: en-US
---

## Why do we need decentralized sequencers?

### What is sequencer & What does it do?

In classical Layer 1 blockchains, transactions are packaged and processed by miners (or validator nodes in POS) who gain the power to package, sequence, and produce blocks through computational power competition or stake-based elections.

However, in current Layer 2 designs, there often exists a single role responsible for all the packaging and sequencing of Layer 2 transactions. This process lacks competition or staking costs.

This role is known as the sequencer, who not only sequences and generates L2 blocks but also periodically commits Layer 2 transactions and state changes to Layer 1 and addresses any potential challenges to the states it submits.

The main issue with centralized sequencers arises from their monopoly over the power to sequence and package Layer 2 transactions. The problems that arise from this power largely revolve around this characteristic.

### What are the problems with centralized sequencers?

#### Potential single point of failure

The operation of the sequencer directly affects the activity of Layer 2. If the sequencer stops working, transactions from all Layer 2 users will not be processed, and Layer 2 will essentially be down.

When only one entity is running the sequencer, if that entity fails, the entire Layer 2 will be paralyzed, resulting in a single point of failure. Therefore, centralized sequencers pose significant potential risks to the operation of Layer 2. 

#### Excessive transaction censorship

Centralized sequencers have the ability to reject user-submitted transactions, causing these transactions to be unprocessable. This essentially constitutes a form of censorship. Imagine a scenario where a centralized Layer 2 refuses to process any transactions involving their governance tokens (even though this might cause more panic and selling among users). This is entirely feasible for centralized sequencers.

In some schemes, users can submit the transactions they intend to execute on Layer 1, but this process often takes several hours and incurs equivalent Gas Fees on Layer 1. Therefore, this does not fundamentally solve the problem.

On the other hand, with decentralized sequencers, even if a single sequencer refuses to include a transaction, users can still submit it to other sequencers, and the content of the next block is ultimately determined through consensus, without any single entity being able to censor transactions according to their own interest. 

#### Monopoly on MEV

Since the sequencer has the freedom to order (or "sequence") the received transactions, it effectively monopolizes all the MEV (Miner Extractable Value). For a single centralized sequencer, users will have to bear any potential losses caused by its control over MEV, relying on an additional assumption of trust in the sequencer.
Decentralized sequencers, on the other hand, introduce a game among multiple parties to compete for MEV, eliminating the monopoly status of a single sequencer and reducing the impact of uncontrolled MEV on users.


## What's Morphism's solution?

Unlike most Rollup project，Morphism have decentralizing sequencer network setup at the beginning. 
When designing this system, we followed the following principles.

### The principles

#### Scalability on the essence 
Morphism is first and foremost an Ethereum scaling solution. The solution we are seeking aims to ensure fast execution and confirmation of transactions at the Layer 2 level while preserving decentralization to the greatest extent possible.

#### Layer 1 Level Safety 
Simply decentralizing the sequencer at Layer 2 level does not completely solve the potential security impacts of a single sequencer. In a centralized design, Layer 1 contracts and other Layer 2 nodes (such as Layer 2 validator and full nodes) can only obtain block and state information from a single sequencer.

Even with a decentralized sequencer, there could still be issues because Layer 1 contracts and other Layer 2 nodes do not have an effective way to verify that the synchronized information has been through consensus. The sequencer could still potentially synchronize incorrect information to other nodes.

#### Modular

The various components of the Sequencer network are decomposed into independent modules. Each module has specific functions and responsibilities, and can interact with other modules. This modular structure allows different aspects of the system to develop and improve independently without impacting the entire network.

By adopting a modular design, we can more easily introduce new, more efficient and secure modules. For example, when more efficient protocols or algorithms emerge, we can upgrade them as independent modules into the Sequencer network. This flexibility enables the entire system to stay up-to-date and adapt to future, potentially more efficient and secure requirements.

At the same time, the modular design will support sharing our decentralized sequencer network with other architecturally similar rollups in the foreseeable future.

Based on the above design principles, our implementation will be based on the BFT algorithm and require participants to perform BLS aggregated signatures during the consensus process. This signature can be used to verify whether the received information has undergone consensus validation among Layer 1 and other Layer 2 nodes.

:::tip
**Why BLS signature?** 

If we use the current basic signature algorithm, such as ECDSA, in Ethereum, there will be a problem of excessive cost. Because the signature data needs to be submitted to the Layer1 contract and requires payment of the corresponding cost, as the number of validators increases, this cost will also increase proportionally.
:::

By using BLS signatures, the cost of uploading signatures can be maintained at a constant level, unaffected by the gradual growth of the sequencer's quantity.

### Architecture

Here is a brief architecture of the Morphism decentralized sequencing network.

#### Sequencer Set Selection

A complete Morphism decentralized sequencer network consists of two parts:

- Sequencer Set
- Sequencer Staking Contract

![Sequencer Network Archi](../../../assets/docs/protocol/Dese/dese1.png)

The sequencer staking contract will determine the composition of the sequencer set through election, and the selected sequencers will collectively provide services for the network.

At the same time, the election results will be periodically synchronized to the Layer 1 Rollup contract, which can be used to obtain BLS aggregate signatures of sequencer network participants for comparison and verification.

#### Produce Layer 2 Blocks
In particular, based on Morphism's modular design, each Sequencer will run a consensus client that runs BFT to communicate with other Sequencers.

![2](../../../assets/docs/protocol/Dese/consensusBlock.png)

The Sequencer will follow the BFT consensus process. The selected sequencer will extract transactions from the mempool to construct blocks and synchronize the blocks with other sequencers for verification and voting. Ultimately, it will generate new Layer 2 blocks.

#### Generate Batch

Considering the cost of uploading signatures to Layer 1 and the cost of validating signatures on Layer 1, sequencers will perform the corresponding BLS signatures on multiple blocks, i.e., a batch, at designated checkpoints to ensure that the scalability goal is not compromised.

After the signing is completed, the selected sequencer will submit these blocks as a batch to Layer 1 through its batch submitter component.

For more detail on how batch is generated, please go to the [rollup](../../How%20Morphism%20Works/3-Rollups.md) section.

#### Consensus verification

The Sequencer responsible for constructing blocks needs to submit the aggregated BLS signatures, transaction batch, and state acquired from consensus to the Layer 1 contract. The Layer 1 contract will verify this signature to confirm the transaction's consensus.

At the same time, other participants in Layer 2 networks, such as full nodes and archival nodes, can also verify transactions by validating this signature when synchronizing transactions through consensus.

### Wrap up

- Morphism builds a native centralized sequencer network based on BFT consensus.
- Through protocol and network optimization, Morphism maximizes the scalability of Ethereum while ensuring decentralization.
- Based on BLS signatures, other participants in Layer 1 and Layer 2 can effectively verify the consensus results of Layer 2, ensuring that the security provided by the Sequencer Network is at Layer 1 level.

### What's on the Roadmap?

- Decentralized Sequencer Network Live

- Open election of sequencer network

- Shared Sequencer Network

