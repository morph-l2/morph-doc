---
title: AltFeeTx Technical Specification
lang: en-US
---

## Abstract

**AltFeeTx (Alternative Fee Transaction)** introduces native multi-token gas payments on the Morph blockchain.

This specification defines the motivation, structure, signing procedure, and architecture supporting the new transaction type that enables users to pay gas fees using ERC-20 tokens (e.g., USDT or USDC) instead of ETH.

AltFeeTx is designed for seamless integration with existing Ethereum-compatible tools, maintaining protocol-level efficiency and security while reducing transaction friction for users.

## Motivation

### Limitations of Existing Standards

Traditional transactions still require the native token (ETH) as the gas fee, preventing users who only hold ERC-20 tokens (USDC, USDT, etc.) from sending transactions. On L2 networks, this becomes more inconvenient since acquiring gas often requires bridging from L1 or getting transfers from another account, resulting in added cost and delay.

At the same time, Morph previously implemented EIP-7702 to enable flexible gas payment mechanisms via Paymasters.

However, Paymaster-based models introduce several challenges:

- Extra contract calls (signature verification, token charging, forwarding logic).
- Increased gas costs and reduced throughput.
- Dependence on external bundlers for transaction sponsorship.

These factors limit scalability and add friction to the transaction flow.

To address these limitations, we introduce a new transaction type AltFeeTx (0x7F):

```
rlp([chainID, nonce, gasTipCap, gasFeeCap, gas, to, value, data, accessList, feeTokenID, feeLimit, v, r, s])
```

AltFeeTx allows users to pay gas directly with registered ERC-20 tokens, following the EIP-1559 mechanism while adding FeeTokenID and FeeLimit to specify the chosen fee token and the maximum amount they are willing to pay. This removes dependency on native tokens, reduces overhead from Paymaster flows, and provides a smoother experience across the network.

## Why AltFeeTx

- **Pay gas using tokens you already hold:** Users can pay gas with tokens like USDT or USDC. No need to keep ETH.
- **No paymasters or bundlers needed:** AltFeeTx removes extra layers like paymasters or bundlers, cutting down steps and complexity.
- **Lower gas costs & faster processing:** Fewer contract calls mean cheaper and faster transactions.
- **Accurate, real-time fee calculation:** Converts token prices to ETH-equivalent values onchain, ensuring fair gas pricing.
- **Simple and lightweight:** Everything is handled directly by the protocol, not by external contracts.
- **Better UX for users and developers:** Users get refunds in the same token, and developers avoid complex setups.

## Transaction Type Definition

**Transaction Type:** AltFeeTxType = 0x7F

**Transaction Structure:**

```
type AltFeeTx struct {
    ChainID    *big.Int        // Chain ID for replay protection
    Nonce      uint64          // Sender's nonce
    GasTipCap  *big.Int        // Max priority fee per gas (in ETH units)
    GasFeeCap  *big.Int        // Max fee per gas (in ETH units)
    Gas        uint64          // Gas limit
    To         *common.Address // Recipient (nil for contract creation)
    Value      *big.Int        // ETH value to transfer
    Data       []byte          // Transaction data
    AccessList AccessList      // EIP-2930 access list


    // AltFeeTx-specific fields
    FeeTokenID uint16          // ERC20 token ID for fee payment (0 = ETH)
    FeeLimit   *big.Int        // Maximum fee in token units (optional)


    // Signature values
    V *big.Int
    R *big.Int
    S *big.Int
}
```

**AltFeeTx Fields**

| Field       | Type           | Description                                             |
|-------------|----------------|---------------------------------------------------------|
| nonce       | uint64         | Sender’s sequential counter, preventing replay attacks. |
| to          | common.Address | Recipient address (nil for contract creation).          |
| value       | big.Int        | Amount of ETH to transfer.                              |
| data        | []byte         | Transaction calldata for contract execution.           |
| AccessList  | AccessList     | EIP-2930 access list of addresses and storage slots.   |
| gas         | uint64         | Maximum gas units that can be consumed.                |
| gasTipCap   | big.Int        | Max priority fee per gas (ETH units).                  |
| gasFeeCap   | big.Int        | Max fee per gas unit (ETH units).                      |
| chainID     | big.Int        | Specifies the network and prevents replay attacks.     |
| V, R, S     | big.Int        | Signature values from the sender’s EOA or smart account. |


**New Field Definitions**

- FeeTokenID identifies which ERC-20 token will be used to pay the transaction fee. 
- FeeLimit (optional) defines the maximum amount of the selected token that the sender authorizes for gas payment. If the user doesn't define a FeeLimit, the chain will collect the fees based on the user balance as limit.

## Fee Calculation
This calculation follows the standard EIP-1559 fee model for determining the base ETH cost of an L2 transaction, including L2 fee and L1 data fee. Once the total fee is computed in ETH, it is converted into the selected ERC-20 token. The conversion uses a ceiling operation to ensure the converted token amount is sufficient to meet the full ETH fee.

**ETH Fee Calculation (EIP-1559 model)**
```
effectiveGasPrice = min(GasTipCap, GasFeeCap - baseFee) + baseFee
l2Fee = Gas * effectiveGasPrice
l1DataFee = calculateL1DataFee(data)
totalFeeETH = l2Fee + l1DataFee
```

**ERC20 Fee Conversion**

Convert ETH fee to ERC20 tokens:
```
tokenAmount = ⌈(ethAmount × tokenScale) / tokenRate⌉
```

Where:
- tokenRate: token price quoted in ETH (e.g., USDT price in ETH)
- tokenScale: scaling factor to handle decimals
- ⌈ ⌉: ceiling function (rounding up to prevent precision loss)

## Rate Storage

The Token Rate parameter is synchronized to the system contract by trusted Oracle services in a timely manner. Its calculation method is:
```
tokenRate = tokenScale * (tokenPrice / ethPrice) × 10^(ethDecimals - tokenDecimals)
```

This formula calculates a scaled token-to-ETH rate for fee conversion, adjusting for differences in token and ETH decimals. The trusted backend service ensures the system contract has up-to-date rates for accurate ERC-20 gas payments.

## Gas Refund

After a transaction executes, any unused gas is returned to the sender. The refund is calculated and converted to the corresponding amount of the selected token, ensuring users only pay for the gas actually consumed.

```
remaining = remainingGas * effectiveGasPrice
remainingToken = ⌈(remaining × tokenScale) / tokenRate⌉
```

**Example**
- Price: 1 ETH = 4000 USDC
- ETH decimals: 18
- USDC decimals: 6
- tokenScale = 1

```
tokenRate = 1*(1/4000)*1e12 = 250000000

If ethAmount = 0.00000001 ETH (10 gwei):

tokenAmount = (1e10 * 1) / 250000000 = 40 (USDC smallest units)
```

## Token Registration

The Token Registry stores all necessary information about ERC-20 tokens eligible for gas payments, including their contract address, decimal precision, and conversion scale. It also tracks whether a token is active and, when possible, the storage slot for direct balance updates, enabling efficient and accurate fee handling.

**Token Registry Contract**

Stores token information and pricing parameters.
Pre-deployed address: 0x5300000000000000000000000000000000000021

**TokenInfo Structure**

```
struct TokenInfo {
    address tokenAddress;   // ERC20 token contract address
    bytes32 balanceSlot;    // Storage slot for balances
    bool isActive;          // Whether token is enabled for fee payment
    uint8 decimals;         // Token decimals
    uint256 scale;          // Conversion scale factor
}
```

Explanation:
- tokenAddress: ERC20 token contract address
- balanceSlot: slot for balances mapping (stored as slot+1 to avoid slot collision)
- isActive: whether the token is enabled
- decimals: used for fee calculations
- scale: scaling factor to handle decimal alignment

**Token Activation**

For non-upgradeable tokens or tokens whose storage layout is predictable, the balance slot generally does not change. Therefore, balanceSlot can be configured to allow direct balance updates.

For tokens whose balance slot may change or cannot be known in advance, set balanceSlot = bytes32(0).

To be eligible for fee payment:

- tokenID != 0
- isActive == true
- tokenAddress != address(0)
- tokenRate > 0
- tokenScale > 0

**Supported Token List**

The Token Registry contract provides:

- getSupportedTokenList() -> ((uint16, address))  
    Returns supported token IDs and corresponding token addresses.
- getSupportedIDList() -> (uint16[])  
    Returns the list of supported token IDs.

## Hybrid Transfer Logic
AltFeeTx includes a Hybrid Transfer Logic mechanism that dynamically selects the most efficient method for token balance updates. This enables correct and consistent gas usage, avoids EVM call overhead, and improves overall execution efficiency.

AltFeeTx chooses between direct slot update or EVM call depending on whether balanceSlot is set.

### 1. Direct Slot Update

**Condition:** balanceSlot != bytes32(0)
Directly updates ERC20 balance storage slot.

**Advantages:**

- More efficient (no EVM call)
- Deterministic gas cost
- No need to execute ERC-20 code

**Process:**

```
senderSlot = keccak256(abi.encode(senderAddress, balanceSlot))
recipientSlot = keccak256(abi.encode(recipientAddress, balanceSlot))

senderBalance = stateDB.GetState(tokenAddress, senderSlot)
require(senderBalance >= amount)

stateDB.SetState(tokenAddress, senderSlot, senderBalance - amount)
stateDB.SetState(tokenAddress, recipientSlot, recipientBalance + amount)
```

### 2. EVM Call Transfer
EVM Call handles token transfers for ERC-20s, ensuring compatibility with all tokens and checking balances before and after the transfer.

**Condition:** balanceSlot == bytes32(0)

**Advantages:**
- Compatible with all ERC-20 tokens
- Supports custom token logic
- Emits transfer events
  
**Process:**
```
// Get balance before transfer
balanceBefore = IERC20(token).balanceOf(sender)
require(balanceBefore >= amount)

// Execute transfer
bool success = IERC20(token).transfer(recipient, amount)
if success.exist(){
    require(success)
}

// Verify balance after transfer
balanceAfter = IERC20(token).balanceOf(sender)
require(balanceAfter == balanceBefore - amount)
```

**Return Value Rules:**
- Empty return: accepted (old ERC-20)
- 32-byte return: last byte must be 1
- Any other format: reject

##RLP Encoding
RLP Encoding serializes the transaction into a space-efficient and standardized format

**Transaction Encoding**
```
rlp([chainID, nonce, gasTipCap, gasFeeCap, gas, to, value, data,
     accessList, feeTokenID, feeLimit, v, r, s])
```

**Transaction Signature Hash**
```
sigHash = keccak256(0x7F || rlp([
    chainID,
    nonce,
    gasTipCap,
    gasFeeCap,
    gas,
    to,
    value,
    data,
    accessList,
    feeTokenID,
    feeLimit
]))
```

## Blocksec Audit report
We commissioned Blocksec to conduct a full security audit of Morph’s EmeraId implementation, initiated on November 24, 2025. The audit assessed the upgrade’s robustness and adherence to security best practices and was executed according to an agreed scope and testing plan tailored for this implementation.

Blocksec performed a comprehensive assessment using a white-box–led methodology designed to closely simulate real-world attack conditions. The evaluation combined black box testing, grey box testing, and white box testing techniques. The audit also incorporated analysis informed by known blockchain security vulnerabilities, alongside exploratory testing for previously unknown or emerging attack vectors.

The full audit findings and methodology are available in the official Blocksec report:
[Access the Blocksec EmeraId Audit Report](https://github.com/morph-l2/audits/blob/main/blocksec/blocksec_morph_emerald_upgrade_v1.0-signed.pdf)

