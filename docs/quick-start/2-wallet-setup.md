---
title: Wallet Setup
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!
---

## Wallet

To interact with dApps on Morph, you need a compatible wallet. Below are some example wallets and configuration tips.

<!--
### Bitget Wallet

TBD
-->

### MetaMask


- Installation: MetaMask can be installed from their [official website](https://metamask.io/download/).
- Importing Configurations: To set up MetaMask for Morph Testnet, click the "add to wallet" buttons on the Morph Testnet homepage. This will automatically import the chain ID and RPC URLs for the Morph Testnet.
- Using Ethereum Holesky Testnet: Morph Testnet utilizes the Ethereum Holesky testnet as its underlying L1, which is already configured in MetaMask by default. To access it, enable "Show/hide test networks" in the MetaMask network selection dropdown.



### Manual network configuration

Currently, the Add to wallet links may not be compatible with all wallets yet. If you are having issues using them, you may need to manually add the Holesky Testnet and Morph by inserting the configuration details from the table below:


#### Network Configuration

:::tip Morph Sepolia Sunset

Morph Sepolia testnet is going to be sunset soon. We strongly suggest that you migrate to Morph Holesky testnet

:::


| Name                      | RPC Url(s)                            | Chain ID | Block explorer             | Symbol |
| -------- | -------------------------- | ------------- | ---------- | ------------------------------------ |
| Morph Holesky Testnet             | https://rpc-quicknode-holesky.morphl2.io       | 2810    | https://explorer-holesky.morphl2.io      | ETH      |
| Ethereum Holesky            | https://ethereum-holesky-rpc.publicnode.com/       | 17000    | https://holesky.etherscan.io      | ETH      |
| Morph Sepolia Testnet             | https://rpc-testnet.morphl2.io        | 2710    | https://explorer-testnet.morphl2.io      | ETH      |
| Ethereum Sepolia            | https://eth-sepolia-public.unifra.io       | 11155111    | https://sepolia.etherscan.io      | ETH      |



You can also visit [chainlist](https://chainlist.org/?chain=11155111&search=morph&testnets=true) to add Morph testnet and Ethereum testnet