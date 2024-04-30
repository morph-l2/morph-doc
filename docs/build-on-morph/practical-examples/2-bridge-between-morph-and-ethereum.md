---
title: Bridge between Morph and Ethereum
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimstic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimstic zk-rollup solution. Try it now!
---

## Bridge an ERC20 through custom gateway


## Step 1: Launch a token on Sepolia

First, we need a token to bridge. There is no need for a particular ERC20 implementation in order for a token to be compatible with L2. If you already have a token, feel free to skip this step. If you want to deploy a new token, use the following contract of a simple ERC20 token that mints 1 million tokens to the deployer when launched.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract L1Token is ERC20 {
  constructor() ERC20("My Token L1", "MTL1") {
    _mint(msg.sender, 1_000_000 ether);
  }
}
```

## Step 2: Launch the counterpart token on Morph Sepolia testnet

Next, you'll launch a counterpart to this token on Morph, which will represent the original token on Sepolia. This token can implement custom logic to match that of the L1 token or even add additional features beyond those of the L1 token.

For this to work:

- The token must implement the `IMorphStandardERC20` interface in order to be compatible with the bridge.
- The contract should provide the gateway address and the counterpart token addresses (the L1 token we just launched) under the `gateway()` and `counterpart()` functions. It should also allow the L2 gateway to call the token `mint()` and `burn()` functions, which are called when a token is deposited and withdrawn.

The following is a complete example of a token compatible with the bridge. To the constructor, you will pass the official Morph Custom Gateway address (`0x058dec71E53079F9ED053F3a0bBca877F6f3eAcf`) and the address of the token launched on Sepolia.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@Morph-tech/contracts@0.1.0/libraries/token/IMorphERC20Extension.sol";

contract L2Token is ERC20, IMorphERC20Extension {
  // We store the gateway and the L1 token address to provide the gateway() and counterpart() functions which are needed from the Morph Standard ERC20 interface
  address _gateway;
  address _counterpart;

  // In the constructor we pass as parameter the Custom L2 Gateway and the L1 token address as parameters
  constructor(address gateway_, address counterpart_) ERC20("My Token L2", "MTL2") {
    _gateway = gateway_;
    _counterpart = counterpart_;
  }

  function gateway() public view returns (address) {
    return _gateway;
  }

  function counterpart() external view returns (address) {
    return _counterpart;
  }

  // We allow minting only to the Gateway so it can mint new tokens when bridged from L1
  function transferAndCall(address receiver, uint256 amount, bytes calldata data) external returns (bool success) {
    transfer(receiver, amount);
    data;
    return true;
  }

  // We allow minting only to the Gateway so it can mint new tokens when bridged from L1
  function mint(address _to, uint256 _amount) external onlyGateway {
    _mint(_to, _amount);
  }

  // Similarly to minting, the Gateway is able to burn tokens when bridged from L2 to L1
  function burn(address _from, uint256 _amount) external onlyGateway {
    _burn(_from, _amount);
  }

  modifier onlyGateway() {
    require(gateway() == _msgSender(), "Ownable: caller is not the gateway");
    _;
  }
}
```

## Step 3: Add the token to the Morph Bridge

You need to contact the Morph team to add the token to `L2CustomERC20Gateway` contract in Morph and `L1CustomERC20Gateway` contract in L1. In addition, follow the instructions on the [token lists](https://github.com/Morph-tech/token-list) repository to add your token to the Morph official bridge frontend.

## Step 4: Deposit tokens

Once your token has been approved by the Morph team, you should be able to deposit tokens from L1. To do so, you must first approve the `L1CustomGateway` contract address on Sepolia (`0x31C994F2017E71b82fd4D8118F140c81215bbb37`). Then, deposit tokens by calling the `depositERC20` function from the `L1CustomGateway` contract. This can be done using [our bridge UI](https://Morph.io/bridge), [Etherscan Sepolia](https://sepolia.etherscan.io/address/0x31C994F2017E71b82fd4D8118F140c81215bbb37#writeProxyContract), or a smart contract.

## Step 5: Withdraw tokens

You will follow similar steps to send tokens back from L2 to L1. First, approve the `L2CustomGateway` address (`0x058dec71E53079F9ED053F3a0bBca877F6f3eAcf`) and then withdraw the tokens calling the `withdrawERC20` from the `L2CustomGateway` contract.


## Send messages between Morph and Ethereum

## Deploying the Contracts

### Target Smart Contract

Let’s start by deploying the target smart contract. We will use the Greeter contract for this
example, but you can use any other contract. Deploy it to either Sepolia or Morph. On Morph, L1
and L2 use the same API, so it’s up to you.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// This Greeter contract will be interacted with through the MorphMessenger across the bridge
contract Greeter {
  string public greeting = "Hello World!";

  // This function will be called by executeFunctionCrosschain on the Operator Smart Contract
  function setGreeting(string memory greeting_) public {
    greeting = greeting_;
  }
}
```

We will now execute `setGreeting` in a cross-chain way.

### Operator Smart Contract

Switch to the other chain and deploy the `GreeterOperator`. So, if you deployed the `Greeter` contract on L1, deploy the `GreeterOperator` on L2 or vice versa.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// The Morph Messenger interface is the same on both L1 and L2, it allows sending cross-chain transactions
// Let's import it directly from the Morph Contracts library
import "@Morph-tech/contracts@0.1.0/libraries/IMorphMessenger.sol";

// The GreeterOperator is capable of executing the Greeter function through the bridge
contract GreeterOperator {
  // This function will execute setGreeting on the Greeter contract
  function executeFunctionCrosschain(
    address MorphMessengerAddress,
    address targetAddress,
    uint256 value,
    string memory greeting,
    uint32 gasLimit
  ) public payable {
    IMorphMessenger MorphMessenger = IMorphMessenger(MorphMessengerAddress);
    // sendMessage is able to execute any function by encoding the abi using the encodeWithSignature function
    MorphMessenger.sendMessage{ value: msg.value }(
      targetAddress,
      value,
      abi.encodeWithSignature("setGreeting(string)", greeting),
      gasLimit,
      msg.sender
    );
  }
}
```

## Calling a Cross-chain Function

We pass the message by executing `executeFunctionCrosschain` and passing the following parameters:

- `MorphMessengerAddress`: This will depend on where you deployed the `GreeterOperator` contract.
  - If you deployed it on Sepolia use `0x50c7d3e7f7c656493D1D76aaa1a836CedfCBB16A`. If you deployed on Morph Sepolia use `0xBa50f5340FB9F3Bd074bD638c9BE13eCB36E603d`.
- `targetAddress`: The address of the `Greeter` contract on the opposite chain.
- `value`: In this case, it is `0` because the `setGreeting`is not payable.
- `greeting`: This is the parameter that will be sent through the message. Try passing `“This message was cross-chain!”`
- `gasLimit`:
  - If you are sending the message from L1 to L2, around `1000000` gas limit should be more than enough. That said, if you set this too high, and `msg.value` doesn't cover `gasLimit` * `baseFee`, the transaction will revert. If `msg.value` is greater than the gas fee, the unused portion will be refunded.
  - If you are sending the message from L2 to L1, pass `0`, as the transaction will be completed by executing an additional transaction on L1.

### Relay the Message when sending from L2 to L1

When a transaction is passed from L2 to L1, an additional "execute withdrawal transaction" must be sent on L1. To do this, you must call `relayMessageWithProof` on the L1 Morph Messenger
contract from an EOA wallet.

You can do this directly on [Etherscan Sepolia](https://sepolia.etherscan.io/address/0x50c7d3e7f7c656493d1d76aaa1a836cedfcbb16a#writeProxyContract#F3).
To do so, you will need to pass a Merkle inclusion proof for the bridged transaction and other parameters. You'll query these using the Morph Bridge API.

{/* TODO: finish looking into API issues */}

We're finalizing the API specifics, but for now, fetch or curl the following endpoint:

```bash
curl "https://sepolia-api-bridge.Morph.io/api/claimable?page_size=10&page=1&address=GREETER_OPERATOR_ADDRESS_ON_L2"
```

<!--
Replace `GREETER_OPERATOR_ADDRESS_ON_L2` with your GreeterOperator contract address as launched on L2. Read more about Execute Withdraw transactions
in the [Morph Messenger](/developers/l1-and-l2-bridging/the-Morph-messenger) article.
-->

:::tip
  This API was made for our Bridge UI. It is not yet finalized and may change in the future. We will update this guide
  when the API is finalized.
:::

:::tip Anyone can execute your message
  `relayMessageWithProof` is fully permissionless, so anyone can call it on your behalf if they're willing to pay the L1
  gas fees. This feature allows for additional support infrastructure, including tooling to automate this process for
  applications and users.
:::

After executing and confirming the transaction on both L1 and L2, the new state of `greeting` on the `Greeter` contract should be `“This message was cross-chain!”`. Sending a message from one chain to the other should take around 20 minutes after the transactions are confirmed on the origin chain.

Congratulations, you now executed a transaction from one chain to the other using our native bridge!