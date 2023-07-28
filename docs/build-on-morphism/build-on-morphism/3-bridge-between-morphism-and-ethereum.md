---
title: Bridge between Morphism and Ethereum
lang: en-US
---

## Bridging basics

Although Morphism is an Ethereum Layer2 (and therefore fundamentally connected to Ethereum), it's also a separate blockchain system. 
App developers commonly need to move data and assets between Morphism and Ethereum. We call the process of moving data and assets between the two networks "bridging".

### Sending tokens

For the most common usecase, moving tokens around, we've created [the Standard Token Bridge](#using-the-standard-bridge). The Standard Token Bridge is a simple smart contract with all the functionality you need to move tokens between Morphism and Ethereum. It also allows you to easily create L2 representations of existing tokens on Ethereum.

### Sending data

If the Standard Token Bridge doesn't fully cover your usecase, you can also [send arbitrary data between L1 and L2](## Send messages between Morphism and Ethereum). You can use this functionality to have a contract on Ethereum trigger a contract function on Morphism and vice versa. We've made this process as easy as possible by giving developers a simple API for triggering a cross-chain function call. 


## Utilize Standard Bridge Contract

Certain interactions, like transferring ETH and ERC20 tokens between the two networks, are common enough that we've built the "Standard Bridge" to make moving these assets between L1 and L2 as easy as possible.

The standard bridge functionality provides a method for an ERC20 token to be deposited and locked on L1 in exchange of the same amount of an equivalent token on L2. This process is known as "bridging a token", e.g. depositing 100 USDC on L1 in exchange for 100 USDC on L2 and also the reverse - withdrawing 100 USDC on L2 in exchange for the same amount on L1. In addition to bridging tokens the standard bridge is also used for ETH.

The Standard Bridge is composed of two main contracts the [`L1StandardBridge`](https://github.com/morphism-labs/contracts/blob/main/contracts/L1/L1StandardBridge.sol) (for Layer 1) and the [`L2StandardBridge`](https://github.com/morphism-labs/contracts/blob/main/contracts/L2/L2StandardBridge.sol) (for Layer 2).

Here we'll go over the basics of using this bridge to move ERC20 assets between Layer 1 and Layer 2.

<!-- -->
<!-- 
::: tip 
[See here for a step by step tutorial](https://github.com/ethereum-optimism/optimism-tutorial/tree/main/cross-dom-bridge-erc20)
:::
-->
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

<!-- 
Note that the bridge does *not* support certain ERC-20 configurations:

- [Fee on transfer tokens](https://github.com/d-xo/weird-erc20#fee-on-transfer)
- [Tokens that modify balances without emitting a Transfer event](https://github.com/d-xo/weird-erc20#balance-modifications-outside-of-transfers-rebasingairdrops)

::: danger Use the standard bridge contract only with standard bridge tokens
The standard bridge can only be used with tokens that have a properly configured ERC-20 version on Morphism.
If you send any other type of token to the standard bridge directly (not using the user interface or the API), it gets stuck there and you lose that value.

Note that if you use the [Morphism bridge UI](https://app.optimism.io/bridge), or the [Optimism SDK]() it automatically chooses the correct bridge contract, so this problem does not happen.

There are two ways to check if a token can use the standard bridge:

1. Look in [the token list](https://static.optimism.io/optimism.tokenlist.json). 
   If a token can use the standard bridge, then the `"chainId": 10` entry will have the standard L2 bridge address, `0x4200..0010`. For example, this entry shows that on Morphism `0xBTC` can use the standard bridge.

   ```json
       {
      "chainId": 10,
      "address": "0xe0BB0D3DE8c10976511e5030cA403dBf4c25165B",
      "name": "0xBitcoin",
      "symbol": "0xBTC",
      "decimals": 8,
      "logoURI": "https://ethereum-optimism.github.io/data/0xBTC/logo.png",
      "extensions": {
        "optimismBridgeAddress": "0x4200000000000000000000000000000000000010"
      }
    },
   ```

   In the token exists in the token list but does not use the standard bridge, the `extensions.optimismBridgeAddress` value is different. For example, this entry shows that on Morphism `DAI` uses a different bridge:

   ```json
       {
      "chainId": 10,
      "address": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      "name": "Dai stable coin",
      "symbol": "DAI",
      "decimals": 18,
      "logoURI": "https://ethereum-optimism.github.io/data/DAI/logo.svg",
      "extensions": {
        "optimismBridgeAddress": "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65"
      }
    },
   ```

2. You can "ask" the L2 token contract by calling it. 
   ERC-20 tokens that can use the standard bridge not only if they:
   - Have an `l2Bridge` method
   - That method returns `0x4200...0010`. 

   For example, [this link](https://optimistic.etherscan.io/address/0xe0bb0d3de8c10976511e5030ca403dbf4c25165b#readContract#F5) can be used to see that `0xBTC` uses the standard bridge.

   Note that you cannot query the L1 token contract the same way.
   L2 contracts know the identity of their L1 counterpart, but L1 contracts only need to implement the standard ERC-20 methods.

:::
-->

### Depositing ETH

ETH deposits into L2 can be triggered via the `depositETH` and `depositETHTo` functions on the [`L1StandardBridge`](https://github.com/morphism-labs/contracts/blob/main/contracts/L1/L1StandardBridge.sol#L119C20-L119C20).
ETH deposits can alternatively be triggered by sending ETH directly to the `L1StandardBridge`.
Once your deposit is detected and finalized, your account will be funded with the corresponding amount of ETH on L2.

## Withdrawals

### Withdrawing ERC20s

ERC20 withdrawals can be triggered via the `withdraw` or `withdrawTo` functions on the [`L2StandardBridge`](https://github.com/morphism-labs/contracts/blob/main/contracts/L2/L2StandardBridge.sol#L121).

<!--
If you'd like to see this contracts in action, you should check out the [L1 ⇔ L2 deposit-and-withdraw example](https://github.com/ethereum-optimism/optimism-tutorial/tree/main/cross-dom-bridge-erc20).
-->
### Withdrawing ETH

Unlike on L1, we do not have a separate function on L2 for withdrawing ETH.
Instead, you can use the `withdraw` or `withdrawTo` functions on the [`L2StandardBridge`](https://github.com/morphism-labs/contracts/blob/main/contracts/L2/L2StandardBridge.sol#L121) and use the address `0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000` as the L2 token address.


<!--
## Adding an ERC20 token to the Standard Bridge

::: tip
To add your token to the standard bridge, see the guide [Adding an ERC20 token to the Standard Bridge](https://github.com/ethereum-optimism/optimism-tutorial/tree/main/standard-bridge-standard-token).
:::


## The Superchain token list

The Standard bridge allows a one-to-many mapping between L1 and L2 tokens, meaning that there can be many Morphism implementations of an L1 token.

However there is always a one-to-one mapping between L1 and L2 tokens in the [Superchain token list](https://github.com/ethereum-optimism/ethereum-optimism.github.io/blob/master/optimism.tokenlist.json).
The Superchain token list is used as the source of truth for the [Morphism bridge UI](https://app.optimism.io/bridge/deposit) which is the main portal for moving assets between Layer 1 and Layer 2.

If you want to have your token added to the Superchain token list, you must make a pull request against the [Superchain token list repository](https://github.com/ethereum-optimism/ethereum-optimism.github.io#adding-a-token-to-the-list).
You'll need the addresses for both the L1 and L2 tokens, as well as a logo for the token.
If you're looking for an example to follow, take a look at [this simple pull request that adds a token to the token list](https://github.com/ethereum-optimism/ethereum-optimism.github.io/pull/319/files).

-->


## Send messages between Morphism and Ethereum

Apps on Morphism can be made to interact with apps on Ethereum via a process called "bridging".
In a nutshell, **contracts on Morphism can trigger contract functions on Ethereum, and vice versa**.
With just a little bit of elbow grease, you too can create contracts that bridge the gap between Layer 1 and Layer 2!

<!--
::: tip 
[See here for a step by step tutorial](https://github.com/ethereum-optimism/optimism-tutorial/tree/main/cross-dom-comm)
:::
-->

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

<!-- 

### Communication speed

Unlike calls between contracts on the same blockchain, calls between Ethereum and Morphism are *not* instantaneous.
The exact speed of a cross-chain transaction depends on the direction in which the transaction is sent.

#### For Ethereum (L1) to Morphism (L2) transactions

Transactions sent from L1 to L2 take approximately a minute to get from Ethereum to Morphism.

This is because L2 nodes wait for five block confirmations on Ethereum before executing an L1 to L2 transaction, to reduce the chance of a chain reorg.

#### For Morphism (L2) to Ethereum (L1) transactions

L2 to L1 transactions have to wait two periods:

1. The time until the state root is written to L1.
   You can estimate this time by looking at how often transactions happen to the State Commitment Chain (on both [mainnet](https://etherscan.io/address/0xBe5dAb4A2e9cd0F27300dB4aB94BeE3A233AEB19) and [goerli](https://goerli.etherscan.io/address/0xE6Dfba0953616Bacab0c9A8ecb3a9BBa77FC15c0)).

   It is necessary to provide a Merkle proof of the message on L1 after the state root is written.
   The fault challenge period starts *after* that proof transaction becomes part of the L1 chain.

1. The [fault challenge period](#understanding-the-challenge-period), which is a few seconds on goerli and seven days on mainnet.
   This waiting period is a core part of the security mechanism designed to keep funds on Optimism secure and cannot be circumvented.
   After this waiting period, any user can "finalize" the transaction by triggering a second transaction on Ethereum that sends the message to the target L1 contract.



### Accessing `msg.sender`

Contracts frequently make use of `msg.sender` to make decisions based on the calling account.

For example, many contracts will use the [Ownable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol) pattern to selectively restrict access to certain functions.

Because messages are essentially shuttled between L1 and L2 by the messenger contracts, **the `msg.sender` you'll see when receiving one of these messages will be the messenger contract** corresponding to the layer you're on.

In order to get around this, we added a `xDomainMessageSender` function to each messenger:

```solidity
function xDomainMessageSender() public returns (address);
```

If your contract has been called by one of the messenger contracts, you can use this function to see who's *actually* sending this message.
Here's how you might implement an `onlyOwner` modifier on L2:

```solidity
modifier onlyOwner() {
    require(
        msg.sender == address(ovmL2CrossDomainMessenger)
        && ovmL2CrossDomainMessenger.xDomainMessageSender() == owner
    );
    _;
}
```

-->

### Fees for sending data between L1 and L2

### For L1 ⇒ L2 transactions

The majority of the cost of an L1 to L2 transaction comes from sending a transaction on Ethereum.

You send a transaction to the [`L1CrossDomainMessenger`](https://github.com/morphism-labs/contracts/blob/main/contracts/L1/L1CrossDomainMessenger.sol)
contract, which then sends a call to the [`CanonicalTransactionChain`](https://github.com/morphism-labs/contracts/tree/main/contracts/L1).
This cost is ultimately determined by gas prices on Ethereum when you're sending the cross-chain transaction.

An L1 to L2 message is expected to trigger contract execution on L2, and that contract execution costs gas.

<!--
The first 1.92 million gas on L2 is free.
The vast majority of L1 to L2 calls spend less than the 1.92 million, so nothing further is required.

If you think that your call might spend more than that on L2, you can specify a higher gas limit.
However, to prevent denial of service attacks, we have to impose a cost on gas limits higher than 1.92 million.
This cost is one unit of L1 gas for every 32 units of L2 gas requested beyond the free amount.

For example, if you specify a 2.0 million gas limit in the call to `L1CrossDomainMessenger`, it will be processed this way:

| Amount | Action  |
| ------ | ------- |
| free gas: 1.92 million   | Nothing, this gas is provided on L2 for free |
| excess gas required: 80,000 | 2,500 gas is spent on the L1 portion of the gas fee and in return 80,000 extra gas is provided to the L2 transaction. This is inline with the 1:32 ratio of gas. |

This gas burn happens on L1 when the L1 contract calls `L1CrossDomainMessenger`.
This is before the message has been sent to the L2, and as such there is no way to know how much L2 gas will actually be used.
Therefore, the amount burned is based *only* on the gas limit specified in the L1 call.

For example, if the call above with a gas limit of two million only takes ten thousand gas on L2, the 2,500 gas on L1 is still burned.
There is no refund.

The parameters in the explanation above were 1.92 million and 32 at the time of writing, but they may change in the future.
To see the present values, [go to Etherscan](https://etherscan.io/address/0x5E4e65926BA27467555EB562121fac00D24E9dD2#readContract) and expand `enqueueL2GasPrepaid` for the free L2 gas amount and `l2GasDiscountDivisor` for the exchange rate at which L1 gas is burned for additional L2 gas.
-->

### Fees for L2 ⇒ L1 transactions

Each message from L2 to L1 requires three transactions:

1. An L2 transaction that *initiates* the transaction, which is priced the same as any other transaction made on Morphism.

2. An L1 transaction that *proves* the transaction.
   This transaction can only be submitted after the state root is submitted to L1.
   This transaction is expensive because it includes verifying a [Merkle trie](https://eth.wiki/fundamentals/patricia-tree) inclusion proof.

3. An L1 transaction that *finalizes* the transaction. 
   This transaction can only be submitted after the transaction challenge period has passed. 

The total cost of an L2 to L1 transaction is therefore the combined cost of the L2 initialization transaction and the two L1 transactions.

The L1 proof and finalization transactions are typically significantly more expensive than the L2 initialization transaction.

### Understanding the challenge period

One of the most important things to understand about L1 ⇔ L2 interaction is that **messages sent from Layer 2 to Layer 1 cannot be relayed for the challenge period**.

This means that any messages you send from Layer 2 will only be received on Layer 1 after this period has elapsed.

:::tip

Read about Morphism's unique challenge design based on [Responsive validity proof](../../how-morphism-works/responsive-validity-proof/1-overview.md)

:::

We call this period of time the "challenge period" because it is the time during which a transaction can be challenged.

Unlike the basic Optismtic Rollup which you when you find out that some incorrect transactions or state are submitted to Layer 1 (such as a fake withdraw transction which want to withdraw your ETH to hacker's address) you need to spend a long time and energy to interact with sequencer to prove it is wrong.

Morphism's responsive validity proof makes sequencer to prove they are right by submitting zk validity proof.

And this require a cetain period for you or any other chanllenge to find out the problem and start a challenge/

Anyway, the point here is that **you don't want to be making decisions about Layer 2 transaction results from inside a smart contract on Layer 1 until this challenge period has elapsed**.

Otherwise you might be making decisions based on an invalid transaction result.

As a result, L2 ⇒ L1 messages sent using the standard messenger contracts cannot be relayed until they've waited out the full challenge period.

<!--
::: tip On the length of the challenge period
The challenge period on Morphism testnet is currently for test purposes.
:::
-->