---
title: Bridge
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!
---

# Deposit from Holesky to Morph Testnet

## Instructions:

:::tip Use the bridge here

 https://bridge-holesky.morphl2.io
 
:::

1. Open your MetaMask wallet and switch to the **Holesky** network. 

![image1](../../assets/docs/quick-start/bridge/01.png)
![image1](../../assets/docs/quick-start/bridge/02.png)

2. Within Morph’s Bridge app (https://bridge-testnet.morphl2.io/), click **Connect wallet**, select MetaMask, and approve the connection if prompted.

![image2](../../assets/docs/quick-start/bridge/03.png)

3. Make sure that **Holesky** is selected under ‘From’ and Morph L2 under ‘To’. If not, click the "↓" button to switch their positions.

4. Select the token that you want to transfer. 

5. Click the Send button to initiate the deposit.

:::tip
If this is your first time transferring an ERC20 token, you need to approve the **Holesky** Bridge contract to access your ERC20 token.
:::

6. A window will pop up asking for confirmation of the transfer transaction, click **Deposit**.

![image3](../../assets/docs/quick-start/bridge/04.png)

7. Click the Confirm button in MetaMask. Once the transfer transaction is finalized, the token will be deducted from your **Holesky** wallet address.

![image5](../../assets/docs/quick-start/bridge/05.png)

8. While you wait, you can check status of your transactions by clicking on the transactions button. 

![image6](../../assets/docs/quick-start/bridge/06.png)


## How long does it take for a token to arrive to Morph Testnet ?

A token transfer from **Holesky** to Morph Testnet may take 8 to 14 minutes (time for block to become Safe on **Holesky**) before it appears in your Morph wallet. To check the progress of your deposit transactions, follow these steps:

1. Click your wallet address at the top-right corner of the Bridge web app.

![image6](../../assets/docs/quick-start/bridge/07.png)

2. Click on Transactions. A pop-up panel will display your recent transactions.

:::tip
Note: For deposit transactions (L1 -> L2), once your transaction is confirmed as Safe on **Holesky** (8 to 14 minutes), you will see a **Success** status. Your funds will then be relayed to L2.
:::

![image8](../../assets/docs/quick-start/bridge/08.png)

3. Click on the most recent **Holesky** transaction hash.

![image9](../../assets/docs/quick-start/bridge/09.png)

4. You will be taken to a Transaction Details page in the Explorer. Verify your transaction status (this transaction is confirmed on **Holesky**). 

![image10](../../assets/docs/quick-start/bridge/10.png)

5. Once your transaction status shows *success* on L2, return to the Bridge app to see a transaction hash and funds in your Morph L2 wallet.

![image11](../../assets/docs/quick-start/bridge/11.png)

![image12](../../assets/docs/quick-start/bridge/12.png)


# Withdraw from Morph Testnet to Holesky

To withdraw funds from Morph Testnet, follow these steps:
1. Initiate the withdrawal on Morph Testnet.
2. Wait for the withdrawal root to be published on L1 (**Holesky**). This usually takes a few minutes, but it may take longer during outages.
3. Prove withdrawal.
4. Wait for the verification challenge period, which lasts seven days from the time the withdrawal is proven on L1 (**Holesky**).
5. Claim your withdrawal.

## Initiate withdrawal

1. Click Connect Wallet and select MetaMask. If prompted, approve the connection in your wallet.

2. Select Withdraw. Choose the asset and amount you wish to withdraw.

![image13](../../assets/docs/quick-start/bridge/13.png)

3. Click Send ETH to **Holesky**.

![image14](../../assets/docs/quick-start/bridge/14.png)

4. Click Initiate withdrawal, wait for a few minutes to confirm. After it is finished, you need to switch the network in your wallet and then prove the withdrawal on **Holesky**.

![image15](../../assets/docs/quick-start/bridge/15.png)

![image16](../../assets/docs/quick-start/bridge/16.png)

5. Waiting for the batch submission to be completed.

![image17](../../assets/docs/quick-start/bridge/17.png)

![image18](../../assets/docs/quick-start/bridge/18.png)

## Waiting for the verification challenge period

1. Click your address in the top right corner. 

2. Click Transactions and then Withdrawals. This will display a list of your recent withdrawals and their status. Or you can find a notice in the top area, by clicking the button View Account (see the pic below).

![image19](../../assets/docs/quick-start/bridge/19.png)

![image20](../../assets/docs/quick-start/bridge/20.png)

![image21](../../assets/docs/quick-start/bridge/21.png)



3. You can search for the transaction hash on Morph Explorer.

![image22](../../assets/docs/quick-start/bridge/22.png)

![image23](../../assets/docs/quick-start/bridge/23.png)

4. Click the L1 State Root Submission Tx to see when the transaction was written to L1 (**Holesky**).

![image24](../../assets/docs/quick-start/bridge/24.png)

![image25](../../assets/docs/quick-start/bridge/25.png)




## Claim the Withdrawal

1. Once the challenge period is over, the status will change to Claim.

2. Click Claim withdrawal.

![image26](../../assets/docs/quick-start/bridge/26.png)

3. Confirm the withdrawal in the wallet.

![image27](../../assets/docs/quick-start/bridge/27.png)

4. Wait until the withdrawal is completed.

![image28](../../assets/docs/quick-start/bridge/28.png)

