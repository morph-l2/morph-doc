---
title: Bridge between Morph and Ethereum
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimstic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimstic zk-rollup solution. Try it now!
---

## Bridging basics

Although Morph is an Ethereum Layer 2 (and therefore fundamentally connected to Ethereum), it's also a separate blockchain system. 

App developers often have a need to move data and assets between Morph and Ethereum, a process we call "bridging".

### Sending tokens

For the most common usecase, moving tokens around, we've created [the Standard Token Bridge](#using-the-standard-bridge). The Standard Token Bridge is a simple smart contract with all the functionality you need to move tokens between Morph and Ethereum. It also allows you to easily create L2 representations of existing tokens on Ethereum.

### Sending data

If the Standard Token Bridge doesn't fully cover your usecase, you can also [send arbitrary data between L1 and L2](#send-messages-between-morph-and-ethereum). You can use this functionality to have a contract on Ethereum trigger a contract function on Morph, and vice versa. 

We've made this process as easy as possible by giving developers a simple API for triggering a cross-chain function call. 


## Utilize Standard Bridge Contract

To facilitate common interactions like transferring ETH and ERC20 tokens between the two networks, we offer the "Standard Bridge". This bridge simplifies the transfer of assets between L1 and L2.

- Standard Bridge Functionality: It allows for ETH or ERC20 token to be deposited on L1 and locked in exchange for an equivalent amount on L2, and vice versa. This is known as "bridging a token," e.g., depositing 100 USDC on L1 for 100 USDC on L2. .

The Standard Bridge is composed of two main contracts the [`L1StandardBridge`](https://github.com/morph-l2/contracts/tree/main/contracts/L1/L1StandardBridge.sol) (for Layer 1) and the [`L2StandardBridge`](https://github.com/morph-l2/contracts/tree/main/contracts/L2/L2StandardBridge.sol) (for Layer 2).

Here we'll go over the basics of using this bridge to move tokens between Layer 1 and Layer 2.

## Deposits
<!-- 
::: warning NOTICE
We're working hard to get more smart contract wallet software deployed and tested on Morph.
However, as a safety measure, **we currently block smart contract wallets from calling the `depositETH` and `depositERC20` functions**.
If you want to deposit using a smart contract wallet and you know what you're doing, you can use the `depositETHTo` and `depositERC20To` functions instead.
:::
-->

### Depositing ERC20s

ERC20 deposits into L2 can be triggered via the `depositERC20` and `depositERC20To` functions on the [`L1StandardBridge`](https://github.com/morph-l2/contracts/tree/main/contracts/L1/L1StandardBridge.sol).

Ensure the Standard Token Bridge is **approved** to use the tokens you wish to deposit.


### Depositing ETH

ETH deposits into L2 can be triggered via the `depositETH` and `depositETHTo` functions on the [`L1StandardBridge`](https://github.com/morph-l2/contracts/tree/main/contracts/L1/L1StandardBridge.sol#L119C20-L119C20).
ETH deposits can alternatively be triggered by sending ETH directly to the `L1StandardBridge`.
Once your deposit is detected and finalized, your account will be funded with the corresponding amount of ETH on L2.

## Withdrawals

### Withdrawing ERC20s

ERC20 withdrawals can be triggered via the `withdraw` or `withdrawTo` functions on the [`L2StandardBridge`](https://github.com/morph-l2/contracts/tree/main/contracts/L2/L2StandardBridge.sol#L121).

### Withdrawing ETH

Unlike on L1, we do not have a separate function on L2 for withdrawing ETH.
Instead, you can use the `withdraw` or `withdrawTo` functions on the [`L2StandardBridge`](https://github.com/morph-l2/contracts/tree/main/contracts/L2/L2StandardBridge.sol#L121) and use the address `0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000` as the L2 token address.


## Send messages between Morph and Ethereum

Apps on Morph can be made to interact with apps on Ethereum via a process called "bridging".
In a nutshell, **contracts on Morph can trigger contract functions on Ethereum, and vice versa**.
With just a little bit of elbow grease, you also can create contracts that bridge the gap between Layer 1 and Layer 2!

<details>

<summary><b>Understanding contract calls</b></summary>

To understand the process of creating bridges between contracts on Layer 1 and Layer 2, you should first have a basic understanding of the way contracts on *Ethereum* communicate with one another.
If you're a smart contract developer, you might be familiar with stuff like this:

```solidity
contract MyContract {
    function doSomething(uint256 myFunctionParam) public {
        // ... some sort of code goes here
    }
}

contract MyOtherContract {
    function doTheThing(address myContractAddress, uint256 myFunctionParam) public {
        MyContract(myContractAddress).doSomething(myFunctionParam);
    }
}
```

Here, `MyOtherContract.doTheThing` triggers a "call" to `MyContract.doSomething`.
A "call" is defined by a few key input parameters, mainly a `target address` and some `calldata`.
In this specific example, the `target address` is going to be the address of our instance of `MyContract`.
The `calldata`, on the other hand, depends on the function we're trying to call.
Solidity uses an encoding scheme called [Contract ABI](https://docs.soliditylang.org/en/v0.8.4/abi-spec.html) to both [select which function to call](https://docs.soliditylang.org/en/v0.8.4/abi-spec.html#function-selector) and to [encode function input arguments](https://docs.soliditylang.org/en/v0.8.4/abi-spec.html#argument-encoding).

Solidity gives us some useful tools to perform this same encoding manually.
For the sake of learning, let's take a look at how we can duplicate the same code with a manual encoding:

```solidity
contract MyContract {
    function doSomething(uint256 myFunctionParam) public {
        // ... some sort of code goes here
    }
}

contract MyOtherContract {
    function doTheThing(address myContractAddress, uint256 myFunctionParam) public {
        myContractAddress.call(
            abi.encodeWithSignature(
                "doSomething(uint256)",
                myFunctionParam
            )
        );
    }
}
```

Here we're using the [low-level "call" function](https://docs.soliditylang.org/en/v0.8.4/units-and-global-variables.html#members-of-address-types) and one of the [ABI encoding functions built into Solidity](https://docs.soliditylang.org/en/v0.8.4/units-and-global-variables.html#abi-encoding-and-decoding-functions).

Although these two code snippets look a bit different, they're actually functionally identical.

</details>

### Communication basics between layers

At a high level, this process is pretty similar to the same process for two contracts on Ethereum (with a few caveats).
**Communication between L1 and L2 is enabled by two special smart contracts called the "messengers"**.

Each layer has its own messenger contract which serves to abstract away some lower-level communication details, a lot like how HTTP libraries abstract away physical network connections.

We won't get into *too* much detail about these contracts here — the only thing you really need to know about is the `sendMessage` function attached to each messenger:

```solidity
function sendMessage(
    address _target,
    bytes memory _message,
    uint32 _gasLimit
) public;
```

It's the same as that `call` function used for contract messaging within L1 Ethereums.
We have an extra `_gasLimit` field here, but `call` has that too.
This is basically equivalent to:

```solidity
address(_target).call{gas: _gasLimit}(_message);
```

Except, of course, that we're calling a contract on a completely different network.

We're glossing over a lot of the technical details that make this whole thing work under the hood.
Point is, it works.
Want to call a contract on Morph from a contract on Ethereum?
It's dead simple:

```solidity
// Pretend this is on L2
contract MyContract {
    function doSomething(uint256 myFunctionParam) public {
        // ... some sort of code goes here
    }
}

// And pretend this is on L1
contract MyOtherContract {
    function doTheThing(address myOptimisticContractAddress, uint256 myFunctionParam) public {
        ovmL1CrossDomainMessenger.sendMessage(
            myOptimisticContractAddress,
            abi.encodeWithSignature(
                "doSomething(uint256)",
                myFunctionParam
            ),
            1000000 // use whatever gas limit you want
        )
    }
}
```

:::tip 

Using the messenger contracts
Our messenger contracts, the [`L1CrossDomainMessenger`](https://github.com/morph-l2/contracts/tree/main/contracts/L1/L1CrossDomainMessenger.sol) and [`L2CrossDomainMessenger`](https://github.com/morph-l2/contracts/tree/main/contracts/L2/L2CrossDomainMessenger.sol), always come pre-deployed to each of our networks.

:::

### Fees for L2 ⇒ L1 transactions

Each message from L2 to L1 requires three transactions:

1. An L2 transaction that *initiates* the transaction, which is priced the same as any other transaction made on Morph.

2. An L1 transaction that *proves* the transaction.
   This transaction can only be submitted after the state root is submitted to L1.
   This transaction is expensive because it includes verifying a [Merkle trie](https://eth.wiki/fundamentals/patricia-tree) inclusion proof.

3. An L1 transaction that *finalizes* the transaction. 
   This transaction can only be submitted after the transaction challenge period has passed. 

The total cost of an L2 to L1 transaction is therefore the combined cost of the L2 initialization transaction and the two L1 transactions.

The L1 proof and finalization transactions are typically significantly more expensive than the L2 initialization transaction.

### Understanding the challenge period

ne of the most important things to understand about L1 ⇔ L2 interactions is that **messages sent from Layer 2 to Layer 1 cannot be relayed during the challenge period**
.
This means that any messages you send from Layer 2 will only be received on Layer 1 after this period has elapsed.


:::tip

Read about Morph's unique challenge design based on [Responsive validity proof](../../how-morph-works/responsive-validity-proof/1-overview.md)

:::

We call this period of time the "challenge period" because it is the time during which a transaction can be challenged.This period is critical for ensuring the integrity of transactions between Layer 2 and Layer 1.

Comparing Rollup Approaches:
- In a basic Optimistic Rollup, identifying and correcting incorrect transactions or states (like a fraudulent withdrawal transaction aiming to redirect your ETH to a hacker's address) requires significant time and effort. This involves interactions with the sequencer to prove the transaction is incorrect.
- Morph’s approach differs. With Responsive Validity Proof, the sequencer is required to prove their correctness by submitting a zk (zero-knowledge) validity proof. This system necessitates a specific period for challengers to detect issues and initiate a challenge.

Implications for Smart Contracts:
- It’s crucial not to make decisions about Layer 2 transaction results from within a smart contract on Layer 1 until the challenge period has elapsed. Doing so prematurely might lead to decisions based on invalid transaction results.
- Consequently, messages sent from Layer 2 to Layer 1, using the standard messenger contracts, cannot be relayed until they have completed the full challenge period.


<!--
::: tip On the length of the challenge period
The challenge period on Morph testnet is currently for test purposes.
:::
-->