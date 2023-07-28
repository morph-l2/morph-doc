---
title: Bridge
lang: en-US
---

## Deposit from Sepolia to Morphism Testnet

### Instructions

1. Switch to the Sepolia network in your wallet. Click Connect wallet, select MetaMask, and approve the connection in the wallet itself if asked.
   
2. Make sure that Sepolia is listed at the top and Morphism Testnet is at the bottom. If not, click the "↓" button to switch their positions. 

3. Select the token that you want to transfer. If this is your first time transferring an ERC20 token, you need to approve the Sepolia Bridge contract to access your ERC20 token. 
4. Click the Send button to initiate the deposit. A window will pop up asking for confirmation of the transfer transaction.
   
5. Once the transfer transaction is sent and confirmed, the token will be deducted from your Sepolia wallet address.
   
### When will the token arrive at Morphism Testnet  ?

The token transfer from Sepolia to Morphism Testnet may take 8 to 14 minutes (awaiting block to become Safe on Sepolia) before it appears in your Morphism wallet. To check the progress of deposit transactions, follow these steps:

1. Click your wallet address at the top-right corner of the Bridge web app.
   

The pop-up panel will display your recent transactions in the Bridge app. (see the image below).
For deposit transactions (L1 -> L2), once your transaction is confirmed as Safe on Sepolia (8 to 14 minutes), you will see the success status. Your funds will then be relayed to L2.

2. Click on the most recent transaction’s Sepolia transaction hash:
   


It will open the Transaction Details page in the exploer. You can see this transaction is confirmed on Sepolia.



3. Go back to the Bridge app. Once your transaction status shows success on L2, you may see the funds in your Morphism L2 wallet and a transaction hash:
   




## Withdraw from Morphism Testnet to Sepolia

To withdraw funds from Morphism Testnet, follow these steps:
1. Initiate the withdrawal on Morphism Testnet.
2. Wait for the withdrawals root to be published on L1 (Sepolia). This usually takes a few minutes, but it may take longer during outages.
3. Prove the withdrawal.
4. Wait for the verification challenge period, which lasts for seven days from the time the withdrawal is proven on L1 (Sepolia).
5. Finally, claim your withdrawal.
   
### Initiate the withdrawal
1. Click "Connect Wallet" and select MetaMask. If prompted, approve the connection in your wallet.
2. Select Withdraw.
3. Choose the asset and amount you wish to withdraw.
4. Click Withdraw. 
5. Click the checkboxes and accept the withdrawal: 
6. Approve the withdrawal again in your wallet.
   
### Waiting for the verification challenge period
Click your address in the top right corner. Click "Transactions" and then "Withdrawals". This will display a list of your recent withdrawals and their status.

You can search for the transaction hash on Morphism Explorer. Click the L1 State Root Submission Tx to see when the transaction was written to L1 （Sepolia）.


### Claim the withdrawal
1. Once the challenge period is over, the status will change to Claim.
2. Click Claim.
3. Confirm the withdrawal in the wallet.
4. Wait until the withdrawal completes.