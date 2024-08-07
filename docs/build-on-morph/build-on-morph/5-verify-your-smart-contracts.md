---
title: Verify Your Smart Contracts
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!
---

After deploying your smart contracts, it's crucial to verify your code on our [block explorer](https://explorer-holesky.morphl2.io). This can be automated using your development framework, such as Hardhat.




## Verify with develop framework

Most smart contract tools have plugins for verifying contracts on Etherscan. Blockscout supports Etherscan's contract verification APIs, making it straightforward to use these tools with the Morph Testnet.

We provide a comprehensive example of deploying contracts on Morph using Hardhat and Foundry, which includes the verification process.


Check [Deploy Contracts on Morph](../code-examples/1-deploy-contract-on-morph.md) for examples.

## Vefiry with Morph explorer

- Visit：[Morph block explorer](https://explorer-holesky.morphl2.io)

We currently support 6 different ways to verify your contracts on our block explorer.

There are 2 general parameters:

- Compiler: Has to be consistent with what you select when deployment.
- Optimization: Can be ignored if you don't have contract optimization. If you do, it has to be consistent with deployment.

### Method: Solidity (Flattened Sources Code)

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
