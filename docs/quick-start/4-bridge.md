---
title: Bridge
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost-efficient, and high-performing optimistic zk-rollup solution. Try it now!
---

## Deposit from Ethereum to Morph Mainnet


Please refer to the [Morph Season 2 - Bridge Guide.](https://morph.ghost.io/how-to-bridge-eth-to-morph-official-bridge/)

# Deposit from Ethereum Hoodi to Morph Testnet

## Instructions:

1. Go to the Morph Hoodi Bridge: https://bridge-hoodi.morphl2.io
2. Open MetaMask and switch to the **Hoodi** network.
3. In the Morph Bridge app, click **Connect Wallet**, select MetaMask, and approve the connection.
4. Ensure **Hoodi** is selected under “From” and **Morph L2** under “To”. If not, click the ↓ button to switch them.
5. Select the token you want to transfer.
6. Click **Send** to start the deposit.

:::tip
If this is your first time transferring an ERC20 token, you need to approve the Hoodi Bridge contract to access your ERC20 token.
:::

7. A confirmation window will appear. Click **Deposit**.
8. In MetaMask, click **Confirm**. Once the transaction finalizes, the token will be deducted from your Hoodi wallet.
9. To check the status, click the **Transactions** button in the bridge app.



## How long does it take for a token to arrive to Morph Testnet ?

A deposit from Hoodi to Morph Testnet typically takes **8–14 minutes** (time for the block to become Safe on Hoodi) before appearing in your Morph wallet.  


To check progress:  
1. Click your wallet address in the top-right corner of the Bridge app.
2. Select **Transactions**. A panel will show your recent transactions.

**Note:**

For deposits (L1 → L2), once your transaction is confirmed as Safe on Hoodi (8–14 minutes), you will see a **Success** status. Funds are then relayed to L2.  

3. Click the most recent Hoodi transaction hash.

4. You will be taken to the Transaction Details page in the Explorer. Confirm your transaction status on Hoodi.

5. Once the status shows **Success** on L2, return to the Bridge app to view the L2 transaction hash and confirm your funds are in your Morph wallet.



# Withdraw from Morph Testnet to Hoodi

## Steps:

1. Connect your wallet to the Bridge app and select MetaMask. Approve the connection if prompted.
2. Select **Withdraw**, choose the asset and amount, then click Send ETH to Hoodi.
3. Click **Initiate Withdrawal** and wait a few minutes for confirmation.
4. Switch your wallet network to Hoodi and prove the withdrawal.

## Batch Submission: Wait for the batch submission to complete.

## Verification Challenge Period:

- The challenge period lasts **7 days** from when the withdrawal is proven on Hoodi.
- To check the status, click your address in the top-right corner, then select **Transactions → Withdrawals**.
- You can also click **View Account** from the notice banner.

## Explorer Check:

- Search the transaction hash in Morph Explorer.
- Click **L1 State Root Submission Tx** to see when it was written to Hoodi.

## Claim the Withdrawal:

1. After the challenge period ends, the status will change to Claim.
2. Click **Claim Withdrawal**.
3. Confirm the transaction in your wallet.
4. Wait for the withdrawal to complete.




