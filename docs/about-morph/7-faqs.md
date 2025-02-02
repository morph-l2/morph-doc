---
title: FAQs
lang: en-US
keywords: [morph,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!
---

## What Kind of Rollup is Morph?

Morph uses a hybrid rollup model called "Optimistic zkEVM & RVP". This combines the strengths of both zkRollups and Optimistic Rollups, optimizing for efficiency, cost, and speed. This unique approach places Morph at the cutting edge of rollup technology.

## What Sets Morph Apart from Other Rollups?

Morph stands out with its innovative features:


**State Verification**: The Optimistic zkEVM & RVP method enhances efficiency by combining zkRollups and Optimistic Rollups.

**Efficiency and Cost Reduction**: Morph ensures fast transaction execution and cost-effectiveness while maintaining decentralization.

**Decentralized Sequencer Network**: This pioneering network setup addresses security concerns and ensures robustness at a Layer 1 level.

**Modular Architecture**: Morph’s adaptable and composable architecture fosters a flexible and interactive ecosystem.

## As a Solidity Developer, Will I Notice Differences Deploying on Morph Compared to Ethereum?

Deploying on Morph is very similar to deploying on Ethereum, thanks to its EVM compatibility. Ethereum applications can be migrated to Morph with minimal adjustments. For more detailed guidance, check out the [Development Guides](../build-on-morph/build-on-morph/2-development-setup.md) section.

## The L2 gas price is too high to execute transactions or deploy contracts, what should i do?

The L2 Gas Price you obtained from external resources (eg. RPC) is typically derived from the average or median of confirmed transactions over a certain period. This figure reflects the recommended settings to ensure your transaction gets confirmed, rather than representing the most cost-effective value.

In some cases, certain users may intentionally raise the priority fee (hence the total gas fee) to earn more campaign points, resulting in abnormally high Gas Prices. We recommend that you can reduce your transaction costs by manually setting the L2 Gas Price.

Currently, Morph's L2 Base Fee is **0.001 gwei**, and as long as the number of transactions per block does not reach the limit, you only need to pay the Base Fee to ensure your transaction confirmation, without needing to pay an excess Priority Fee.

Here is a transaction example that only pays the L2 Base Fee and got confirmed:

https://explorer.morphl2.io/tx/0x5968aa54ca3072f56ee3d26602f4e8104d1239a7b1cef6847e0306f81881bf50
