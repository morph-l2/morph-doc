---
title: Bridge between Morphism and Ethereum
lang: en-US
---

## Bridging basics

Although Morphism is an Ethereum Layer 2 (and therefore fundamentally connected to Ethereum), it's also a separate blockchain system. 
App developers commonly need to move data and assets between Morphism and Ethereum. We call the process of moving data and assets between the two networks "bridging".

### Sending tokens

For the most common usecase, moving tokens around, we've created [the Standard Token Bridge](#using-the-standard-bridge). The Standard Token Bridge is a simple smart contract with all the functionality you need to move tokens between Morphism and Ethereum. It also allows you to easily create L2 representations of existing tokens on Ethereum.

### Sending data

If the Standard Token Bridge doesn't fully cover your usecase, you can also [send arbitrary data between L1 and L2](## Send messages between Morphism and Ethereum). You can use this functionality to have a contract on Ethereum trigger a contract function on Morphism, and vice versa. We've made this process as easy as possible by giving developers a simple API for triggering a cross-chain function call. 


## Utilize Standard Bridge Contract

Certain interactions, like transferring ETH and ERC20 tokens between the two networks, are common enough that we've built the "Standard Bridge" to make moving these assets between L1 and L2 as easy as possible.

The standard bridge functionality provides a method for an ERC20 token to be deposited and locked on L1 in exchange of the same amount of an equivalent token on L2. This process is known as "bridging a token", e.g. depositing 100 USDC on L1 in exchange for 100 USDC on L2 and also the reverse - withdrawing 100 USDC on L2 in exchange for the same amount on L1. In addition to bridging tokens the standard bridge is also used for ETH.

The Standard Bridge is composed of two main contracts the [`L1StandardBridge`](https://github.com/morphism-labs/contracts/blob/main/contracts/L1/L1StandardBridge.sol) (for Layer 1) and the [`L2StandardBridge`](https://github.com/morphism-labs/contracts/blob/main/contracts/L2/L2StandardBridge.sol) (for Layer 2).

Here we'll go over the basics of using this bridge to move ERC20 assets between Layer 1 and Layer 2.

## Deposits
<!-- 
::: warning NOTICE
We're working hard to get more smart contract wallet software deployed and tested on Morphism.
However, as a safety measure, **we currently block smart contract wallets from calling the `depositETH` and `depositERC20` functions**.
If you want to deposit using a smart contract wallet and you know what you're doing, you can use the `depositETHTo` and `depositERC20To` functions instead.
:::
-->

### Depositing ERC20s

ERC20 deposits into L2 can be triggered via the `depositERC20To` and `depositERC20To` functions on the [`L1StandardBridge`](https://github.com/morphism-labs/contracts/blob/main/contracts/L1/L1StandardBridge.sol).

You **must** approve the Standard Token Bridge to use the amount of tokens that you want to deposit or the deposit will fail.


### Depositing ETH

ETH deposits into L2 can be triggered via the `depositETH` and `depositETHTo` functions on the [`L1StandardBridge`](https://github.com/morphism-labs/contracts/blob/main/contracts/L1/L1StandardBridge.sol#L119C20-L119C20).
ETH deposits can alternatively be triggered by sending ETH directly to the `L1StandardBridge`.
Once your deposit is detected and finalized, your account will be funded with the corresponding amount of ETH on L2.

## Withdrawals

### Withdrawing ERC20s

ERC20 withdrawals can be triggered via the `withdraw` or `withdrawTo` functions on the [`L2StandardBridge`](https://github.com/morphism-labs/contracts/blob/main/contracts/L2/L2StandardBridge.sol#L121).

### Withdrawing ETH

Unlike on L1, we do not have a separate function on L2 for withdrawing ETH.
Instead, you can use the `withdraw` or `withdrawTo` functions on the [`L2StandardBridge`](https://github.com/morphism-labs/contracts/blob/main/contracts/L2/L2StandardBridge.sol#L121) and use the address `0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000` as the L2 token address.


## Send messages between Morphism and Ethereum

Apps on Morphism can be made to interact with apps on Ethereum via a process called "bridging".
In a nutshell, **contracts on Morphism can trigger contract functions on Ethereum, and vice versa**.
With just a little bit of elbow grease, you can create contracts that bridge the gap between Layer 1 and Layer 2 as well!

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

It's the same as that `call` function used for contract messaging within L1 Ethereum.
We have an extra `_gasLimit` field here, but `call` also has that.
This is basically equivalent to:

```solidity
address(_target).call{gas: _gasLimit}(_message);
```

Except, of course, that we're calling a contract on a completely different network.

We're glossing over a lot of the technical details that make this whole thing work under the hood.
Point is, it works.
Want to call a contract on Morphism from a contract on Ethereum?
It's dead simple:

```solidity
// Pretend this is on L2
contract MyOptimisticContract {
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

::: tip Using the messenger contracts
Our messenger contracts, the [`L1CrossDomainMessenger`](https://github.com/morphism-labs/contracts/blob/main/contracts/L1/L1CrossDomainMessenger.sol) and [`L2CrossDomainMessenger`](https://github.com/morphism-labs/contracts/blob/main/contracts/L2/L2CrossDomainMessenger.sol), always come pre-deployed to each of our networks.

:::

### Fees for L2 ⇒ L1 transactions

Each message from L2 to L1 requires three transactions:

1. An L2 transaction that *initiates* the transaction, which is priced the same as any other transaction made on Morphism.

2. An L1 transaction that *proves* the transaction.
   This transaction can only be submitted after the state root is submitted to L1.
   This transaction is expensive because it includes verifying a [Merkle trie](https://eth.wiki/fundamentals/patricia-tree) inclusion proof.

3. An L1 transaction that *finalizes* the transaction. 
   This transaction can only be submitted after the transaction challenge period has passed. 

The total cost of a L2 to L1 transaction is therefore the combined cost of the L2 initialization transaction and the two L1 transactions.

The L1 proof and finalization transactions are typically significantly more expensive than the L2 initialization transaction.

### Understanding the challenge period

One of the most important things to understand about L1 ⇔ L2 interaction is that **messages sent from Layer 2 to Layer 1 cannot be relayed for the challenge period**.

This means that any messages you send from Layer 2 will only be received on Layer 1 after this period has elapsed.

:::tip

Read about Morphism's unique challenge design based on [Responsive validity proof](../../how-morphism-works/responsive-validity-proof/1-overview.md)

:::

We call this period of time the "challenge period" because it is the time during which a transaction can be challenged.

Unlike the basic Optismtic Rollup, when you find out that some incorrect transactions or state are submitted to Layer 1 (such as a fake withdraw transction which want to withdraw your ETH to hacker's address) you need to spend a long time and energy to interact with sequencer to prove it is wrong.

Morphism's responsive validity proof makes sequencer to prove they are right by submitting zk validity proof.

And this requires a cetain period for you or any other chanllenge to find out the problem and start a challenge/

Anyway, the point here is that **you don't want to be making decisions about Layer 2 transaction results from inside a smart contract on Layer 1 until this challenge period has elapsed**.

Otherwise you might be making decisions based on an invalid transaction result.

As a result, L2 ⇒ L1 messages sent using the standard messenger contracts cannot be relayed until they've waited out the full challenge period.

<!--
::: tip On the length of the challenge period
The challenge period on Morphism testnet is currently for test purposes.
:::
-->