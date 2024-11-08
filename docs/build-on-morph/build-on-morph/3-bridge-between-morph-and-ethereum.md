---
title: Bridge between Morph and Ethereum
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!
---

Please first review our documentation on [Communication Between Morph and Ethereum](../../how-morph-works/general-protocol-design/2-communicate-between-morph-and-ethereum.md) for some required fundamental knowledge. 


## Deposit ETH and ERC20 Tokens from L1​

The Gateway Router allows ETH and ERC20 token bridging from L1 to L2 using the depositETH and depositERC20 functions respectively. It is a permissionless bridge deployed on L1. Notice that ERC20 tokens will have a different address on L2, you can use the getL2ERC20Address function to query the new address.

:::tip
  **`depositETH`** and **`depositERC20`** are payable functions, the amount of ETH sent to these functions will be used
  to pay for L2 fees. If the amount is not enough, the transaction will not be sent. All excess ETH will be sent back to
  the sender. `0.00001 ETH` should be more than enough to process a token deposit.
:::

When bridging ERC20 tokens, you don’t have to worry about selecting the right Gateway. This is because the `L1GatewayRouter` will choose the correct underlying entry point to send the message:

- **`L1StandardERC20Gateway`:** This Gateway permits any ERC20 deposit and will be selected as the default by the L1GatewayRouter for an ERC20 token that doesn’t need custom logic on L2. On the very first token bridging, a new token will be created on L2 that implements the MorphStandardERC20. To bridge a token, call the `depositERC20` function on the `L1GatewayRouter`.


All Gateway contracts will form the message and send it to the `L1CrossDomainMessenger` which can send arbitrary messages to L2. The `L1CrossDomainMessenger` passes the message to the `L1MessageQueueWithGasPriceOracle`. Any user can send messages directly to the Messenger to execute arbitrary data on L2. 

This means they can execute any function on L2 from a transaction made on L1 via the bridge. Although an application could directly pass messages to existing token contracts, the Gateway abstracts the specifics and simplifies making transfers and calls.

When a new block gets created on L1, the Sequencer will detect the message on the `L1MessageQueue`, and submit the transaction to the L2 via the L2 node. Finally, the L2 node will pass the transaction to the `L2CrossDomainMessenger` contract for execution on L2.

## Withdraw ETH and ERC20 tokens from L2

The L2 Gateway is very similar to the L1 Gateway. We can withdraw ETH and ERC20 tokens back to L1 using the `withdrawETH` and `withdrawERC20` functions. The contract address is deployed on L2. We use the `getL1ERC20Address` to retrieve the token address on L1.

:::tip
  **`withdrawETH`** and **`withdrawERC20`** are payable functions, and the amount of ETH sent to these functions will be used to pay for L1 fees. If the amount is not enough, the transaction will not be sent. All excess ETH will be sent back to the sender. Fees will depend on L1 activity but `0.005 ETH` should be enough to process a token withdrawal.
:::

:::tip
  **Ensure transactions won’t revert on L1 while sending from L2**  There is no way to recover bridged ETH, tokens, or NFTs if your transaction reverts on L1. All assets are burned on Morph when the transaction is sent, and it's impossible to mint them again.
:::

### Finalize your Withdrawal

Besides starting a withdrawal request on Morph, there is one additional step to do. You need to finalize your withdrawal on Ethereum.

This is because of Morph's optimistic zkEVM design, you can read the details [here](../../how-morph-works/general-protocol-design/2-communicate-between-morph-and-ethereum.md): 



To do this, first you need to make sure:

- The batch containing the withdraw transactions has passed the challenge period and is marked as finalized (meaning in the `Rollup`contract, **withdrawalRoots[batchDataStore[_batchIndex].withdrawalRoot] = true**).

Once confirmed, you can call our backend services interface:

`/getProof?nonce=withdraw.index`

to obtain all the information you need to finalize your withdraw, which include:

- Index: The position of the withdrawal transaction in the withdraw tree, or rank of your transaction among all the L2->L1 transactions.
- Leaf: The hash value of your withdraw transaction that stored in the tree.
- Proof: The merkel proof of your withdraw transaction.
- Root: The withdraw tree root.


you need to use the `proveAndRelayMessage` function of the `L1CrossDomainMessenger` contract.

After obtaining the above information, the finalization of the withdraw operation can be carried out by calling `L1CrossDomainMessenger.proveAndRelayMessage()`.

The required parameters are 

```solidity
  address _from, 
  address _to, 
  uint256 _value, 
  uint256 _nonce, 
  bytes memory _message, 
  bytes32[32] calldata _withdrawalProof, 
  bytes32 _withdrawalRoot
```

`_from`, `_to`, `_value`, `_nonce`, and `_message` are the original content of the withdraw transaction, which can be obtained from the Event `SentMessage` included in the transaction initiated by the L2 layer withdraw. 

`_withdrawalProof` and `_withdrawalRoot` can be obtained from the aforementioned backend API interface.


:::tip Use the SDK

You can also try our SDK to interact with the bridge system by referring to our [SDK Doc](../sdk/globals.md).

:::
## Add your Token to the Official Bridge

Currently, our official bridge only supports certain pre-defined tokens to be bridged. If you want to bridge your own tokens, you need to manually add the token, and here is how to do it.

### Add Tokens to the gateway through Morph Bridge Frontend

The easiest way to support your token is to manually add it on our [official bridge frontend](https://bridge-holesky.morphl2.io/), you can simply do it with the following steps:

1. Click the token selection button on Morph Holesky Bridge

![tokenlist1](../../../assets/docs/protocol/general/bridge/tokenlist/tokenlist1.png)


2. Input & Confirm your desire Ethereum token contract address under the custom token section

![tokenlist2](../../../assets/docs/protocol/general/bridge/tokenlist/tokenlist2.png)

3. Get the Layer 2 token contract address and confirm it.

![tokenlist3](../../../assets/docs/protocol/general/bridge/tokenlist/tokenlist3.png)

4. Now it is supported and you and other users can start to bridge it! 

![tokenlist4](../../../assets/docs/protocol/general/bridge/tokenlist/tokenlist4.png)

### Add token support to the bridge frontend

By adding your token to the gateway, you and other users can bridge the token by inputting the token address.You need to raise a PR to our bridge repo if you want your token shown on the bridge frontend token list.

You can find how to do it in the [morph list repo](https://github.com/morph-l2/morph-list).


Keep in mind that:
- You need to add both your L1 & L2 token to the list.
- The L2 token contract address is obtained by adding your tokens through Morph bridge frontend.

Here is an [example PR commit](https://github.com/morph-l2/morph-list/pull/27/commits/228481db6b8d69b8f40e7369dae62722aa570eb7
) for your reference.




