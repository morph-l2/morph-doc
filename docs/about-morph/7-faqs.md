---
title: FAQs
lang: en-US
keywords: [morph,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!
---

## What Kind of Rollup is Morph?

Morph uses a hybrid rollup architecture called Optimistic zkEVM with **Responsive Validity Proof (RVP)**. This combines the scalability of optimistic rollups with the security and fast finality of zero-knowledge proofs. Transactions are processed optimistically for speed and cost efficiency, and when challenged, the sequencer produces a zk proof to validate the transaction. This approach shortens withdrawal times and reduces costs while maintaining strong security.

## What Sets Morph Apart from Others?

Morph is purpose-built as a dedicated payment ecosystem and serves both everyday users and developers.

- **Morph Rails** – A permissionless, composable infrastructure layer for developers and merchants to build payments, FX, payroll, compliance, and rewards directly into their applications


- **Decentralized Sequencer Network** – Improves fairness, uptime, and security by removing single points of failure and preventing MEV monopolization


- **Hybrid zkEVM with RVP** – Reduces withdrawal delays to as little as 1–3 days and lowers operational costs without sacrificing trustlessness


- **Modular Architecture** – Separates execution, consensus, and data availability for greater flexibility, scalability, and composability


## I’m a Solidity developer. Will I notice differences deploying on Morph compared to Ethereum?

Morph is fully EVM-compatible, so deploying is almost identical to deploying on Ethereum. Most applications can be migrated with minimal changes. Developers also have access to Morph’s SDK for advanced features like gasless transactions, recurring billing, and compliance integrations.  
See the [Development Guides](../build-on-morph/build-on-morph/2-development-setup.md) for more details.

## How does Morph handle gas fees?

Morph’s L2 Base Fee is currently 0.001 gwei. You only need to pay the base fee to have your transaction confirmed, as long as block capacity is not full. Priority fees are optional unless you need faster confirmation during high activity periods. Some users may raise the priority fee for campaign participation or competitive bidding, which can cause temporary spikes in the reported “average” gas price. In these cases, manually setting the gas price close to the base fee can help reduce costs.  

[View an example transaction paying only the L2 Base Fee](https://explorer.morph.network/tx/0x5968aa54ca3072f56ee3d26602f4e8104d1239a7b1cef6847e0306f81881bf50)

## How can I speed up a transaction on Morph?

Morph follows the same rules as Ethereum mainnet and other EIP-1559 networks. If your transaction is pending, you can resend it with the same nonce and a higher gas price to replace the original. Many wallets have built-in “Speed Up” or “Accelerate” features to make this easy.

## My transaction is still pending. What should I do?

On testnet, transactions with a priority fee below 0.01 gwei will not be processed to prevent spam. Resubmit with a higher priority fee.  
 On mainnet, pending transactions are usually due to full blocks. Increase your priority fee to improve confirmation chances. Also ensure that any earlier transaction with the same account is confirmed, as new transactions will queue behind it.  

## How long does it take to withdraw funds from Morph?

Morph’s canonical bridge currently has a 48-hour challenge window on mainnet. This is part of the security model for optimistic rollups. For faster withdrawals, you can use supported third-party bridges that use liquidity pools to provide near-instant exits.

## What is Morph Rails?

Morph Rails is the programmable infrastructure layer that powers the next generation of onchain financial applications. Developers and merchants can use it to:  
- Process payments and payouts
- Handle onchain FX and payroll
- Integrate compliance and identity verification
- Enable token-gated services and rewards
- Build composable financial products without custodial risk

## Is Morph audited?

Yes. Morph’s codebase is open source and has undergone audits from multiple top-tier firms including **Sherlock** and **Trail of Bits**. Audit reports are public, and all identified issues have been addressed. Additional audits are conducted for major product updates.
