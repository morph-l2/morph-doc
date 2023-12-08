---
title: Communication between Morph and Ethereum
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimstic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimstic zk-rollup solution. Try it now!
---

Although Morph is a Layer 2 solution built atop Ethereum, it remains as a separate and distinct blockchain. Thus, it’s essential to establish a communication channel between Morph and Ethereum to facilitate the smooth transfer of assets and messages. The communication can occur in two directions: from Ethereum to Morph and from Morph to Ethereum.

## The Basic Idea of the Morph <=> Ethereum Bridge​

To transfer an asset between Ethereum and Morph, a user must lock the asset in the cross-layer bridge. When the lock is confirmed, Morph mints a Wrapped Token that reflects the value of the locked asset–a process referred to as a "deposit".

Once the minting is complete, a user or intended recipient can claim the asset in Morph. In the reverse scenario, the bridge can unlock the original asset on Ethereum by burning the Wrapped Token, a process called "withdraw".

Furthermore, the bridge’s utility extends beyond asset bridging, as token transfers operate under the same principle as message transfers. The bridge can, therefore, also facilitate cross-layer message bridging, allowing for data payloads to be transported between networks.



## Deposit (L1 to L2 message) 

![Deposit Process](../../../assets/docs/protocol/General/bridge/deposit.png)

### Construct a deposit request through Standard Bridge (Optional)

A bridge request, whether it is for ETH, ERC20, or ERC721, is essentially a cross-chain message, which necessitates the initial construction of a message. Generally, the message structure remains consistent, especially for ETH & ERC20 token bridges.

Employing a standard bridge assembles a conventional token bridge message and relays it to the ```CrossDomainMessenger```

### Pass the message through CrossDomainMessenger


The ```CrossDomainMessenger`` is the basic unit of cross-layer communication.
There are messenger contracts on both Layer 1 and Layer 2. For a deposit, the L1 messenger sends a message to the L2 messenger.

The interaction mirrors a contract call on Layer 1, which means custom messages (contract interactions) can be constructed to perform various types of cross-layer interactions.

### Execute the message on Layer 2

The cross-domain message is delivered to the ```MophismPortal```, which then triggers an event called ```TransactionDeposited```.

The Sequencer will monitor this event and include a Layer 2 transaction in its next block.

A Layer 2 executor, holding the cross-chain message, interacts with the L2 messenger to execute the message, which may include transferring L2 ETH or ERC20 tokens to the recipient.


## Withdraw (L2 -> L1 message) 

![Withdraw Process](../../../assets/docs/protocol/General/bridge/withdraw.png)

The withdrawal process is, in essence, the inverse of the deposit process, yet it has two main differences.

### Withdraw Tree 

The action of withdrawal means interacting with L1 assets/contracts as a result of a Layer 2 transaction. Consequently, it’s imperative to verify the existence of a Layer 2 transaction that triggers a withdrawal request in a manner that is verifiable on Layer 1.

To achieve this, we introduce a structure known as a Withdraw Tree, which records every L2 withdrawal transaction within a Merkel tree. Thus, a Merkel tree's characteristics can be leveraged to confirm the occurrence of a withdrawal request.

The term Withdraw Tree refers to an append-only Sparse Merkle Tree (SMT) whose leaf nodes record information on assets being transferred out of the network.
A leaf within the Withdraw Tree is termed a Withdraw leaf. These withdraw leaves are classified into two types: type 0 for recording asset(s) information and type 1 for recording messaging information.

A withdraw leaf, in particular, is a Keccak256 hash of the ABI encoded packed structure with the following parameters:

The Withdraw Tree is instrumental in cataloging withdrawal transactions and ascertaining the legitimacy of withdrawal requests.
Morph has pre-deployed a Simple Merkle Tree contract dedicated to constructing the Layer 2 withdraw tree.

This tree incorporates three methods:

1. ```getTreeroot``` - return current tree's root hash
2. ```appendMessageHash``` - append a new leaf node to the tree
3. ```verifyMerkleProof``` - verify if a leaf node existed in the tree (which means bridge request represented by the leaf is valid)

### Verify the withdraw tree

A withdrawal request on Layer 2 will culminate in the emission of an event. Our official bridge frontend and SDK provide a service that uses a Tree Prover to construct the appropriate Merkel proof.

Bridgers require this proof to invoke ```proveWithdrawTransaction``` within the ```MorphPortal``` contract to substantiate their withdrawal request. Once validated, the withdrawal request will be marked as proven and await finalization.

### Challenge Period

Additionally, because of the Optimistic zkEVM design, every transaction (including withdrawals) on Layer 2 must be submitted to Layer 1 and face a challenge period before finalization.

This process is vital to validate the Layer 2 state, including withdrawal transactions. The withdraw tree root, integral for withdrawal request verification, is also submitted by sequencers once the challenge period, batches, and states have been finalized.

If the withdrawal is proven and finalized, bridgers may then employ the "MorphPortal" to process the withdrawal on Layer 1.
