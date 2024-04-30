---
title: Verify Your Smart Contracts
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimstic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimstic zk-rollup solution. Try it now!
---

After deploying your smart contracts, it's important to verify your code on our [block explorer](https://explorer-testnet.morphl2.io). This can be done in an automated way using your develop framework such as hardhat.



## Verify with develop framework

Most smart contract tooling has plugins for verifying your contracts easily on Etherscan. Blockscout supports Etherscan's contract verification APIs, and it's straight forward to use these tools with the Morph Testnet.

We provided a comprehensive example of how to depoly contracts on Morph using hardhat & foundry which includes the verification process.

You can check [here](../practical-examples/1-deploy-contract-on-morph.md)

## Vefiry with Morph explorer

- Visit：[Morph block explorer](https://explorer-testnet.morphl2.io)

We currently support 6 different ways to verify your contracts on our block explorer

There are 2 general parameters:

- Compiler: Has to be consistent with what you select when deployment
- Optimization: Can be ignored if no contract optimizatin, if has, has to be consistent with deployment

### Method: Solidity (Flattened Source Code)

#### Frontend:

![fscs](../../../assets/docs/dev/contract-verify/flatsourcesol.png)

#### Flatten

Flatten through [forge command](https://book.getfoundry.sh/reference/forge/forge-flatten?highlight=flatten#forge-flatten), for example:

~~~
forge flatten --output FlattenedL2StandardBridge.sol ./contracts/L2/L2StandardBridge.sol
~~~

### Method: Solidity (Standard JSON Input)
![sjis1](../../../assets/docs/dev/contract-verify/sjisol1.png)



#### Obtain JSON File

- Can be obtained through solc
- Can be obatined through remix compiler

![sjis2](../../../assets/docs/dev/contract-verify/sjisol3.png)

![sjis3](../../../assets/docs/dev/contract-verify/sjisol3.png)
### Method: Solidity (Multi-part files)

#### Frontend:

- You can submit multiple contract file by your own needs
![mpfs1](../../../assets/docs/dev/contract-verify/mpfsol.png)

#### SOL File Process
- If there is any imported file, it needs to be modified to be referenced by the same level path, and these files must be submitted together. 
![mpfs2](../../../assets/docs/dev/contract-verify/mpfsol2.png)
### Method: Vyper (Contracts)

#### Frontend:
![cv](../../../assets/docs/dev/contract-verify/cv.png)
### Method: Vyper (Standard Json Input)

#### Frontend:
![sjiv](../../../assets/docs/dev/contract-verify/sjiv.png)
### Method: Vyper (Multi-part files)

#### Frontend:
![mpfv](../../../assets/docs/dev/contract-verify/mpfv.png)

### After Verification

![avp](../../../assets/docs/dev/contract-verify/avp.png)
