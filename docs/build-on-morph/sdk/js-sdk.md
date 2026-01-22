---
title: Morph SDK
lang: en-US
description: Official JavaScript/TypeScript SDK for interacting with the Morph Network.
---

# Morph SDK Documentation

> Official JavaScript/TypeScript SDK for interacting with the Morph Network

## Table of Contents

- [Introduction](#introduction)
- [Wallet Compatibility](#wallet-compatibility)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [@morph-network/viem](#morph-networkviem)
  - [@morph-network/ethers](#morph-networkethers)
  - [@morph-network/ethers5](#morph-networkethers5)
  - [@morph-network/chain](#morph-networkchain)

---

## Introduction

Morph SDK is an official JavaScript/TypeScript development toolkit for interacting with the Morph Network. The core feature of this SDK is support for **Alt Fee Transaction** — a Morph-specific transaction type that allows users to pay gas fees using ERC-20 tokens.

### Why Choose Morph SDK?

Compared to using native JS libraries (such as Viem or Ethers) directly, Morph SDK provides the following key advantages:

| Feature | Using Native Libraries | Using Morph SDK |
|---------|----------------------|-----------------|
| **Alt Fee Transaction Support** | ❌ Requires manual implementation of complex serialization/deserialization logic | ✅ Works out of the box, just add `feeTokenID` and `feeLimit` |
| **Transaction Type 0x7f** | ❌ Not supported, requires forking or patching native libraries | ✅ Fully supported, seamless integration |
| **Morph Network Configuration** | ❌ Requires manual configuration of chainId, RPC, etc. | ✅ Pre-configured Mainnet and Testnet settings |
| **Token Registry Interaction** | ❌ Requires manual ABI management | ✅ Exports ABI and contract addresses |
| **Type Safety** | ⚠️ No Morph-specific types | ✅ Complete TypeScript type definitions |
| **Backward Compatibility** | — | ✅ Standard transactions work as usual, no modifications needed |

### SDK Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Your Application                     │
└─────────────────────────────────────────────────────────┘
                           │
     ┌─────────────────────┼─────────────────────┐
     │                     │                     │
     ▼                     ▼                     ▼
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│ @morph-     │     │ @morph-     │     │ @morph-      │
│ network/    │     │ network/    │     │ network/     │
│ viem        │     │ ethers      │     │ ethers5      │
└─────────────┘     └─────────────┘     └──────────────┘
     │                     │                     │
     └─────────────────────┼─────────────────────┘
                           │
                           ▼
                 ┌─────────────────┐
                 │ @morph-network/ │
                 │ chain           │
                 └─────────────────┘
                           │
     ┌─────────────────────┴─────────────────────┐
     ▼                                           ▼
┌─────────────┐                          ┌─────────────┐
│ Morph       │                          │ Morph       │
│ Mainnet     │                          │ Hoodi       │
│ (2818)      │                          │ Testnet     │
│             │                          │ (2910)      │
└─────────────┘                          └─────────────┘
```

### Alt Fee Transaction Overview

Alt Fee Transaction (type `0x7f`) is a Morph Network-specific transaction type that allows users to pay gas fees using registered ERC-20 tokens (such as USDT, USDC) instead of traditional ETH.

**Core Fields:**
- `feeTokenID`: The token's ID in the Token Registry
- `feeLimit`: The maximum amount of tokens the user is willing to pay

---

## Wallet Compatibility

> ⚠️ **Important**: Alt Fee Transaction functionality requires wallet support. Currently, only **Bitget Wallet** fully supports this feature.

### Supported Wallets

| Wallet | Alt Fee Support | Notes |
|--------|-----------------|-------|
| **Bitget Wallet** | ✅ Fully Supported | Recommended |
| MetaMask | ❌ Not Supported | Standard transactions work, Alt Fee unavailable |
| Other Wallets | ❌ Not Supported | Standard transactions work, Alt Fee unavailable |

### Detecting Wallet Capabilities

Before using the Alt Fee feature, it is **strongly recommended** to detect whether the current wallet supports this functionality:

```typescript
import { detectMorphCapabilities } from "@morph-network/chain";

async function checkWalletSupport() {
  const capabilities = await detectMorphCapabilities();

  if (capabilities.features.altFee.isSupported) {
    console.log("Current wallet supports Alt Fee Transaction!");

    // Get list of supported token IDs
    const mainnetTokens = capabilities.features.altFee.supportedFeeTokenIDsByNetwork["mainnet"];
    const testnetTokens = capabilities.features.altFee.supportedFeeTokenIDsByNetwork["hoodi-testnet"];

    console.log("Mainnet supported tokens:", mainnetTokens);
    console.log("Testnet supported tokens:", testnetTokens);
  } else {
    console.log("Current wallet does not support Alt Fee Transaction");
    console.log("Please use Bitget Wallet or fall back to standard ETH payment");
  }
}
```

### Graceful Degradation Strategy

It is recommended to implement graceful degradation in your DApp, automatically falling back to standard transactions when the wallet doesn't support Alt Fee:

```typescript
import { detectMorphCapabilities } from "@morph-network/chain";

async function sendTransactionWithFallback(tx, feeTokenID, feeLimit) {
  const capabilities = await detectMorphCapabilities();

  if (capabilities.features.altFee.isSupported) {
    // Use Alt Fee Transaction
    return await signer.sendTransaction({
      ...tx,
      feeTokenID,
      feeLimit,
    });
  } else {
    // Fall back to standard transaction (pay with ETH)
    console.warn("Wallet does not support Alt Fee, will use ETH for gas");
    return await signer.sendTransaction(tx);
  }
}
```

---

## Installation

### Prerequisites

- Node.js >= 18
- pnpm / npm / yarn

### Choose the Right Package

Choose the corresponding adapter package based on the Ethereum library you use:

| If you use... | Install Package |
|---------------|-----------------|
| [Viem](https://viem.sh) | `@morph-network/viem` |
| [Ethers v6](https://docs.ethers.org/v6/) | `@morph-network/ethers` |
| [Ethers v5](https://docs.ethers.org/v5/) | `@morph-network/ethers5` |

### Using pnpm (Recommended)

```bash
# Viem adapter
pnpm add viem @morph-network/viem

# Ethers v6 adapter
pnpm add ethers @morph-network/ethers

# Ethers v5 adapter  
pnpm add ethers@^5.8.0 @morph-network/ethers5
```

### Using npm

```bash
# Viem adapter
npm install viem @morph-network/viem

# Ethers v6 adapter
npm install ethers @morph-network/ethers

# Ethers v5 adapter
npm install ethers@^5.8.0 @morph-network/ethers5
```

### Using yarn

```bash
# Viem adapter
yarn add viem @morph-network/viem

# Ethers v6 adapter
yarn add ethers @morph-network/ethers

# Ethers v5 adapter
yarn add ethers@^5.8.0 @morph-network/ethers5
```

---

## Quick Start

> Transaction parameters in the following examples should be obtained dynamically based on actual business requirements, not hardcoded.

### Core Concepts

Before getting started, understand the core parameters of Alt Fee Transaction:

| Parameter | Type | Description | How to Obtain |
|-----------|------|-------------|---------------|
| `feeTokenID` | `number` | Token's ID in the Token Registry | From `getSupportedTokenList()` |
| `feeLimit` | `bigint` | Maximum token amount to pay | Calculate using `calculateFeeLimit()` |
| `gas` / `gasLimit` | `bigint` | Gas limit | Using `estimateGas()` |
| `maxFeePerGas` | `bigint` | Maximum gas price | From `provider.getFeeData()` |
| `maxPriorityFeePerGas` | `bigint` | Maximum priority fee | From `provider.getFeeData()` |

### feeLimit Calculation Formula

`feeLimit` is the maximum amount of tokens the user is willing to pay. The formula is:

```
feeLimit >= (maxFeePerGas × gasLimit + L1DataFee) × tokenScale / feeRate
```

Where:
- `maxFeePerGas`: Maximum gas price (from RPC)
- `gasLimit`: Gas limit (from `estimateGas`)
- `L1DataFee`: L1 data fee (from receipt or estimated)
- `tokenScale`: Token precision coefficient (from `getTokenInfo`)
- `feeRate`: Token price ratio (from `priceRatio`)

```typescript
/**
 * Calculate theoretical minimum feeLimit
 */
function calculateFeeLimit(
  maxFeePerGas: bigint,
  gasLimit: bigint,
  l1DataFee: bigint,
  tokenScale: bigint,
  feeRate: bigint
): bigint {
  const l2Fee = maxFeePerGas * gasLimit;
  const totalFee = l2Fee + l1DataFee;
  // Round up
  return (totalFee * tokenScale + feeRate - 1n) / feeRate;
}
```

### Viem Quick Start

```typescript
import { createWalletClient, custom } from "viem";
import {
  morphHoodiTestnet,
  detectMorphCapabilities,
  TOKEN_REGISTRY_PROXY_ADDRESS,
  tokenRegistryAbi,
} from "@morph-network/viem";
import { readContract } from "viem/actions";

// 1. Detect if wallet supports Alt Fee
const capabilities = await detectMorphCapabilities();
if (!capabilities.features.altFee.isSupported) {
  console.warn("Current wallet does not support Alt Fee, please use Bitget Wallet");
}

// 2. Create Wallet Client (connect wallet)
const client = createWalletClient({
  chain: morphHoodiTestnet,
  transport: custom(window.ethereum),
});

// 3. Get account
const [account] = await client.requestAddresses();

// 4. Get supported token list and select a token
const tokens = await readContract(client, {
  address: TOKEN_REGISTRY_PROXY_ADDRESS,
  abi: tokenRegistryAbi,
  functionName: "getSupportedTokenList",
});
const selectedToken = tokens[0]; // Select the token to use
const feeTokenID = selectedToken.tokenID;

// 5. Get token info for feeLimit calculation
const [tokenInfo] = await readContract(client, {
  address: TOKEN_REGISTRY_PROXY_ADDRESS,
  abi: tokenRegistryAbi,
  functionName: "getTokenInfo",
  args: [feeTokenID],
});
const tokenScale = tokenInfo.scale;
const feeRate = await readContract(client, {
  address: TOKEN_REGISTRY_PROXY_ADDRESS,
  abi: tokenRegistryAbi,
  functionName: "priceRatio",
  args: [feeTokenID],
});

// 6. Get gas parameters
const gasPrice = await client.request({ method: "eth_gasPrice" });
const maxFeePerGas = BigInt(gasPrice);
const maxPriorityFeePerGas = maxFeePerGas / 2n;
const gasLimit = 21000n; // Simple transfer, use estimateGas for complex transactions

// 7. Calculate feeLimit (simplified, without L1 Data Fee)
const estimatedEthCost = maxFeePerGas * gasLimit;
const feeLimit = (estimatedEthCost * tokenScale) / feeRate;

// 8. Send Alt Fee Transaction
const hash = await client.sendTransaction({
  account,
  chain: morphHoodiTestnet,
  to: recipientAddress,
  value: 0n,
  gas: gasLimit,
  maxFeePerGas,
  maxPriorityFeePerGas,
  feeTokenID,
  feeLimit,
});

console.log("Transaction hash:", hash);
```

### Ethers v6 Quick Start

```typescript
import { BrowserProvider, Contract } from "ethers";
import {
  MorphSigner,
  MORPH_HOODI_TESTNET,
  detectMorphCapabilities,
  TOKEN_REGISTRY_PROXY_ADDRESS,
  tokenRegistryAbi,
} from "@morph-network/ethers";

// 1. Detect wallet support
const capabilities = await detectMorphCapabilities();
if (!capabilities.features.altFee.isSupported) {
  console.warn("Current wallet does not support Alt Fee, please use Bitget Wallet");
}

// 2. Create Provider and Signer
const provider = new BrowserProvider(window.ethereum);
const browserSigner = await provider.getSigner();
const signer = MorphSigner.from(browserSigner);

// 3. Get supported tokens and select one
const registry = new Contract(TOKEN_REGISTRY_PROXY_ADDRESS, tokenRegistryAbi, provider);
const tokens = await registry.getSupportedTokenList();
const feeTokenID = tokens[0].tokenID; // Select first token

// 4. Get token info
const [tokenInfo] = await registry.getTokenInfo(feeTokenID);
const tokenScale = tokenInfo.scale;
const feeRate = await registry.priceRatio(feeTokenID);

// 5. Get gas parameters
const feeData = await provider.getFeeData();
const maxFeePerGas = feeData.maxFeePerGas!;
const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas!;

// 6. Estimate gas (need to set a large feeLimit first)
const tempFeeLimit = 10n ** BigInt(tokenInfo.decimals); // 1 token as temporary value
const gasLimit = await signer.estimateGas({
  to: recipientAddress,
  value: 0n,
  chainId: MORPH_HOODI_TESTNET.chainId,
  feeTokenID,
  feeLimit: tempFeeLimit,
});

// 7. Calculate actual feeLimit
const estimatedEthCost = maxFeePerGas * gasLimit;
const feeLimit = (estimatedEthCost * tokenScale) / feeRate;

// 8. Send transaction
const tx = await signer.sendTransaction({
  to: recipientAddress,
  value: 0n,
  chainId: MORPH_HOODI_TESTNET.chainId,
  gasLimit,
  maxFeePerGas,
  maxPriorityFeePerGas,
  feeTokenID,
  feeLimit,
});

console.log("Transaction hash:", tx.hash);
```

### Ethers v5 Quick Start

```typescript
import { providers, Contract, BigNumber } from "ethers";
import {
  MorphSigner,
  MORPH_HOODI_TESTNET,
  detectMorphCapabilities,
  TOKEN_REGISTRY_PROXY_ADDRESS,
  tokenRegistryAbi,
} from "@morph-network/ethers5";

// 1. Detect wallet support
const capabilities = await detectMorphCapabilities();
if (!capabilities.features.altFee.isSupported) {
  console.warn("Current wallet does not support Alt Fee, please use Bitget Wallet");
}

// 2. Create Provider and Signer
const provider = new providers.Web3Provider(window.ethereum);
const web3Signer = provider.getSigner();
const signer = MorphSigner.from(web3Signer);

// 3. Get token info (same logic as v6)
const registry = new Contract(TOKEN_REGISTRY_PROXY_ADDRESS, tokenRegistryAbi, provider);
const tokens = await registry.getSupportedTokenList();
const feeTokenID = tokens[0].tokenID;

const [tokenInfo] = await registry.getTokenInfo(feeTokenID);
const tokenScale = tokenInfo.scale; // BigNumber
const feeRate = await registry.priceRatio(feeTokenID); // BigNumber

// 4. Get gas parameters
const feeData = await provider.getFeeData();
const maxFeePerGas = feeData.maxFeePerGas!;
const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas!;
const gasLimit = BigNumber.from(21000); // Simple transfer

// 5. Calculate feeLimit
const estimatedEthCost = maxFeePerGas.mul(gasLimit);
const feeLimit = estimatedEthCost.mul(tokenScale).div(feeRate);

// 6. Send transaction
const tx = await signer.sendTransaction({
  to: recipientAddress,
  chainId: MORPH_HOODI_TESTNET.chainId,
  gasLimit,
  maxFeePerGas,
  maxPriorityFeePerGas,
  feeTokenID,
  feeLimit,
});

console.log("Transaction hash:", tx.hash);
```

### Using JsonRpcProvider (Server-side/Script Scenarios)

If not using a browser wallet, you can sign directly with a private key:

```typescript
import { JsonRpcProvider, Wallet, Contract } from "ethers";
import {
  MorphSigner,
  MORPH_HOODI_TESTNET,
  TOKEN_REGISTRY_PROXY_ADDRESS,
  tokenRegistryAbi,
} from "@morph-network/ethers";

// 1. Create Provider and Wallet
const provider = new JsonRpcProvider(MORPH_HOODI_TESTNET.rpcUrl);
const wallet = new Wallet(process.env.PRIVATE_KEY!, provider);
const signer = MorphSigner.from(wallet);

// 2. Get token info
const registry = new Contract(TOKEN_REGISTRY_PROXY_ADDRESS, tokenRegistryAbi, provider);
const tokens = await registry.getSupportedTokenList();
const feeTokenID = tokens[0].tokenID;

const [tokenInfo] = await registry.getTokenInfo(feeTokenID);
const tokenScale = tokenInfo.scale;
const feeRate = await registry.priceRatio(feeTokenID);

// 3. Get gas parameters
const feeData = await provider.getFeeData();
const maxFeePerGas = feeData.maxFeePerGas!;
const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas!;

// 4. Estimate gas
const tempFeeLimit = 10n ** BigInt(tokenInfo.decimals);
const gasLimit = await signer.estimateGas({
  to: wallet.address,
  value: 0n,
  chainId: MORPH_HOODI_TESTNET.chainId,
  feeTokenID,
  feeLimit: tempFeeLimit,
});

// 5. Calculate feeLimit
const estimatedEthCost = maxFeePerGas * gasLimit;
const feeLimit = (estimatedEthCost * tokenScale) / feeRate;

// 6. Send transaction
const tx = await signer.sendTransaction({
  to: wallet.address,
  value: 0n,
  chainId: MORPH_HOODI_TESTNET.chainId,
  gasLimit,
  maxFeePerGas,
  maxPriorityFeePerGas,
  feeTokenID,
  feeLimit,
});

console.log("Transaction hash:", tx.hash);
```

---

## API Reference

### @morph-network/viem

Viem adapter package, providing seamless integration of Morph features with Viem.

#### Chain Definitions

##### `morphMainnet`

Morph Mainnet chain definition, can be used directly with Viem's `createPublicClient` and `createWalletClient`.

```typescript
import { morphMainnet } from "@morph-network/viem";

// Properties
morphMainnet.id           // 2818
morphMainnet.name         // "Morph Mainnet"
morphMainnet.nativeCurrency // { name: "Ethereum", symbol: "ETH", decimals: 18 }
morphMainnet.rpcUrls.default.http // ["https://rpc.morph.network"]
```

##### `morphHoodiTestnet`

Morph Hoodi Testnet chain definition.

```typescript
import { morphHoodiTestnet } from "@morph-network/viem";

// Properties
morphHoodiTestnet.id           // 2910
morphHoodiTestnet.name         // "Morph Hoodi Testnet"
morphHoodiTestnet.rpcUrls.default.http // ["https://rpc-hoodi.morphl2.io"]
```

---

#### Serialization Functions

##### `serializeTransaction(tx, signature?)`

Serialize a transaction, supports both standard EIP-1559 transactions and Alt Fee transactions.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tx` | `AltFeeTransaction` | Transaction object |
| `signature` | `Signature` (optional) | Signature object |

**Returns:** `Hex` - Serialized transaction hex string

##### `serializeAltFeeTransaction(tx, signature?)`

Specifically serialize Alt Fee transactions (type 0x7f).

---

#### Parsing Functions

##### `parseTransaction(serializedTx)`

Parse a serialized transaction, automatically identifies standard transactions and Alt Fee transactions.

```typescript
import { parseTransaction } from "@morph-network/viem";

const tx = parseTransaction(serializedTx);
console.log(tx.type);        // "altFee"
console.log(tx.feeTokenID);  // Token ID
console.log(tx.feeLimit);    // feeLimit value
```

##### `parseAltFeeTransaction(serializedTx)`

Specifically parse Alt Fee transactions.

---

#### Address Recovery

##### `recoverAddress(parameters)`

Recover signer address from a serialized transaction, supports Alt Fee transactions.

```typescript
import { recoverAddress } from "@morph-network/viem";

const from = await recoverAddress({ serializedTransaction });
console.log("Signer address:", from);
```

---

### @morph-network/ethers

Ethers v6 adapter package.

#### MorphSigner

Class for wrapping Ethers Signer to support Alt Fee Transactions.

##### `MorphSigner.from(signer)`

Static factory method that wraps an Ethers Signer to support Alt Fee.

```typescript
import { BrowserProvider } from "ethers";
import { MorphSigner } from "@morph-network/ethers";

const provider = new BrowserProvider(window.ethereum);
const browserSigner = await provider.getSigner();
const signer = MorphSigner.from(browserSigner);
```

##### `signer.signTransaction(tx)`

Sign a transaction, supports both standard and Alt Fee transactions.

**TransactionRequest Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `to` | `string` | No | Recipient address (empty for contract deployment) |
| `value` | `bigint` | No | Transfer amount |
| `data` | `string` | No | Call data |
| `chainId` | `number` | Yes | Chain ID |
| `gasLimit` | `bigint` | Yes | Gas limit (from `estimateGas`) |
| `maxFeePerGas` | `bigint` | Yes | Maximum gas fee (from `getFeeData`) |
| `maxPriorityFeePerGas` | `bigint` | Yes | Maximum priority fee (from `getFeeData`) |
| `nonce` | `number` | No | Transaction nonce |
| `feeTokenID` | `number` | No* | Token ID (required for Alt Fee, from Token Registry) |
| `feeLimit` | `bigint` | No* | Token fee limit (required for Alt Fee, needs calculation) |

##### `signer.sendTransaction(tx)`

Send a trans