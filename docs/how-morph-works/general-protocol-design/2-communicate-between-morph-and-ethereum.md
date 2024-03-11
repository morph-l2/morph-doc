---
title: Communication between Morph and Ethereum
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimstic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimstic zk-rollup solution. Try it now!
---

Although Morph is a Layer 2 solution built atop Ethereum, it remains as a separate and distinct blockchain. Thus, it’s essential to establish a communication channel between Morph and Ethereum to facilitate the smooth transfer of assets and messages. The communication can occur in two directions: from Ethereum to Morph and from Morph to Ethereum.

## The Basic Idea of the Morph \<\=\> Ethereum Bridge​

To transfer an asset between Ethereum and Morph, a user must lock the asset in the cross-layer bridge. When the lock is confirmed, Morph mints a Wrapped Token that reflects the value of the locked asset–a process referred to as a "deposit".

Once the minting is complete, a user or intended recipient can claim the asset in Morph. In the reverse scenario, the bridge can unlock the original asset on Ethereum by burning the Wrapped Token, a process called "withdraw".

Furthermore, the bridge’s utility extends beyond asset bridging, as token transfers operate under the same principle as message transfers. The bridge can, therefore, also facilitate cross-layer message bridging, allowing for data payloads to be transported between networks.

## Understand Gateway

Gateway is the direct entry point for users to interact with the entire bridge system. Even though the underlying mechanism for cross-layer asset transfers still relies on cross-layer message transmission to achieve the desired outcome, we recommend using the Gateway approach for your cross-layer asset needs.

For various cross-layer asset requirements, we have designed different Gateways such as the ETH Gateway, standard ERC20 Gateway, etc. On top of the Gateways, we have implemented the Gateway Router to call different Gateways based on the type of assets you have, allowing you to interact seamlessly with the Gateway Router contract.



| L1 Gateway Contract         | Description                                                      |
| ------------------------ | ---------------------------------------------------------------- |
| `L1GatewayRouter`        | The gateway router supports the deposit of ETH and ERC20 tokens. |
| `L1ETHGateway`           | The gateway to deposit ETH.                                      |
| `L1StandardERC20Gateway` | The gateway for standard ERC20 token deposits.                   |
| `L1CustomERC20Gateway`   | The gateway for custom ERC20 token deposits.                     |
| `L1WETHGateway`          | The gateway for Wrapped ETH deposits.                            |


| L2 Gateway Contract         | Description                                                      |
| ------------------------ | ---------------------------------------------------------------- |
| `L2GatewayRouter`        | The gateway router supports the withdraw of ETH and ERC20 tokens. |
| `L2ETHGateway`           | The gateway to withdraw ETH.                                      |
| `L2StandardERC20Gateway` | The gateway for standard ERC20 token withdraw.                   |
| `L2CustomERC20Gateway`   | The gateway for custom ERC20 token withdraw.                     |
| `L2WETHGateway`          | The gateway for Wrapped ETH withdraw.                            |


## Deposit (L1 to L2 message) 

![Deposit Process](../../../assets/docs/protocol/general/bridge/deposit.png)

### Construct a deposit request through Gateway

A bridge request, whether it is for ETH, ERC20, or ERC721, is essentially a cross-layer message, which necessitates the initial construction of a message. Generally, the message structure remains consistent, especially for ETH & ERC20 Gateways.

Employing a token gateway assembles a conventional token bridge message and relays it to the ```CrossDomainMessenger```

### Pass the message through CrossDomainMessenger


The ```CrossDomainMessenger`` is the basic unit of cross-layer communication.
There are messenger contracts on both Layer 1 and Layer 2. 

For a deposit, the L1 messenger sends a message to the L2 messenger.

The interaction mirrors a contract call on Layer 1, which means custom messages (contract interactions) can be constructed to perform various types of cross-layer interactions.

### Execute the message on Layer 2

The cross-domain message is delivered to the ```L1MessageQueueWithGasPriceOracle```, which then triggers an event called ```QueueTransaction```.

The Sequencer will monitor this event and include a Layer 2 transaction in its next block.

:::info How to make sure Sequencer don't fake a deposit transaction?

Sequencers may have the motivation to forge a non-existent deposit transaction, such as mint a large amount of Layer 2 tokens and transferring them to their own address. 

Morph prevents such events through two barriers. 

Firstly, due to the decentralized Sequencer architecture used by Morph, forging transactions would require control of at least two-thirds of the Sequencers, which is not easy. 

Secondly, within Morph's optimistic zkEVM framework, challengers will be able to detect such malicious behavior and initiate challenges to correct any misconduct.
:::


A Layer 2 executor, holding the cross-layer message, interacts with the L2 messenger to execute the message, which may include transferring L2 ETH or ERC20 tokens to the recipient.




## Withdraw (L2 -> L1 message) 

![Withdraw Process](../../../assets/docs/protocol/general/bridge/withdraw.png)

The withdrawal process is, in essence, the inverse of the deposit process, yet it has two main differences.

### Withdraw Tree 

The action of withdrawal means interacting with L1 assets/contracts as a result of a Layer 2 transaction. Consequently, it’s imperative to verify the existence of a Layer 2 transaction that triggers a withdrawal request in a manner that is verifiable on Layer 1.

To achieve this, we introduce a structure known as a Withdraw Tree, which records every L2 withdrawal transaction within a Merkel tree. Thus, a Merkel tree's characteristics can be leveraged to confirm the occurrence of a withdrawal request.

The term Withdraw Tree refers to an append-only Sparse Merkle Tree (SMT) whose leaf nodes record information on assets being transferred out of the network.
A leaf within the Withdraw Tree is termed a Withdraw leaf. These withdraw leaves are classified into two types: type 0 for recording asset(s) information and type 1 for recording messaging information.

A withdraw leaf, in particular, is a Keccak256 hash of the ABI encoded packed structure with cross domain message:

The Withdraw Tree is instrumental in cataloging withdrawal transactions and ascertaining the legitimacy of withdrawal requests.

Morph has pre-deployed a Simple Merkle Tree contract dedicated to constructing the Layer 2 withdraw tree.

This tree incorporates three methods:

1. ```getTreeroot``` - return current tree's root hash
2. ```appendMessageHash``` - append a new leaf node to the tree
3. ```verifyMerkleProof``` - verify if a leaf node existed in the tree (which means bridge request represented by the leaf is valid)

### Verify the withdraw tree

A withdrawal request on Layer 2 will culminate in the emission of an event. 

Our official bridge frontend and SDK provide a service that uses a Tree Prover to construct the appropriate Merkel proof.

Bridgers require this proof, the withdrawTree root and the cross-domain message data (accessible by SDK),to invoke ```proveMessage``` within the ```L1CrossDomainMessenger``` contract to substantiate their withdrawal request. Typically:

```solidity
function proveMessage(
        address _from,
        address _to,
        uint256 _value,
        uint256 _nonce,
        bytes memory _message,
        bytes32[32] calldata _withdrawalProof,
        bytes32 _withdrawalRoot
    )
```

Once validated, the withdrawal request will be marked as proven and await finalization.

### Challenge Period

Additionally, because of the Optimistic zkEVM design, every transaction (including withdrawals) on Layer 2 must be submitted to Layer 1 and face a challenge period before finalization.

This process is vital to validate the Layer 2 state, including withdrawal transactions. 

The withdraw tree root, integral for withdrawal request verification, is also submitted by sequencers once the challenge period, batches, and states have been finalized.

If the withdrawal is proven and finalized, bridgers may then call the ```relayMessage``` method within the ```L1CrossDomainMessenger``` contract to execute the withdraw message.

```solidity
function relayMessage(
        address _from,
        address _to,
        uint256 _value,
        uint256 _nonce,
        bytes memory _message
    )
```

In most cases, it is the ETH trasfer from the bridge conrtact to users.

## Cross-layer (Bridge) Errors

In the design of cross-layer bridges, the cross-layer message for deposit needs to be executed and have its Layer 2 states updated before it is considered "finalized". 

Prior to this, there is a possibility of the cross-layer message failing during execution on the Layer 2. This section outlines the potential scenarios and solutions for handling failed cross-layer deposit messages.

### Cross-layer (Bridge) Failure Scenarios:

- Cross-layer messages sent from the L1 to the L2 may fail in execution on the L2 due to limitations in gasLimit or code logic. Some data executions may cause overflow in the circuits of the L2 nodes, leading to the skipping of cross-layer messages.

- When a cross-layer message is sent by the L1CrossdomainMessenger contract on the L1, the corresponding message hash is stored, but the gasLimit is not included in the calculation. The L2CrossdomainMessenger on the L2 performs the same calculation after executing the information, storing the contract call result in mapping(isL1MessageExecuted) to prevent multiple executions of the same message and to update gasLimit parameters for resending failed messages.

 
### Handling Cross-layer (Bridge) Failures:

- If gasLimit is insufficient, causing a failed execution on the L2, a new cross-layer message with a different gasLimit parameter can be sent by calling L1CrossdomainMessenger.replayMessage.
- Messages dropped due to excessive gasLimit parameters or circuit overflow on the L2 can be skipped and not executed. Custom cross-layer calling contracts need to implement the onDropMessage method.
- The gateway contract includes the onDropMessage method, which refunds the initiator of the cross-layer message. Calling L1CrossdomainMessenger.dropMessage discards the cross-layer message and triggers the onDropMessage method of the sending contract, with the transaction's value and message as msg.value and method parameters, respectively.