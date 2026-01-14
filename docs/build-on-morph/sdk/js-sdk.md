---
title: Morph Client SDK Documentation
lang: en-US
description: Official JavaScript/TypeScript SDK for interacting with the Morph Network.
---

# Morph Client SDK Documentation

> Official JavaScript/TypeScript SDK for interacting with the Morph Network

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [@morph-network/viem](#morph-networkviem)
  - [@morph-network/ethers](#morph-networkethers)
  - [@morph-network/ethers5](#morph-networkethers5)
  - [@morph-network/chain](#morph-networkchain)

---

## Introduction

Morph Client SDK is the official JavaScript/TypeScript toolkit for interacting with the Morph Network. Its core capability is support for **Alt Fee Transactions**—a Morph-specific transaction type that lets users pay gas with ERC-20 tokens instead of ETH.

### Why choose the Morph Client SDK?

Compared with using base libraries (Viem/Ethers) directly, the SDK offers:

| Feature | Base libs only | Morph SDK |
|---------|---------------|-----------|
| **Alt Fee Transaction support** | ❌ Manual serialize/deserialize needed | ✅ Built-in, just add `feeTokenID` + `feeLimit` |
| **Tx type 0x7f** | ❌ Unsupported without forking/patching | ✅ Fully supported |
| **Morph chain config** | ❌ Manual chainId/RPC setup | ✅ Mainnet & Testnet presets |
| **Token Registry access** | ❌ Manage ABI yourself | ✅ ABI + addresses exported |
| **Type safety** | ⚠️ No Morph-specific types | ✅ Full TypeScript typings |
| **Backward compatibility** | — | ✅ Normal txs keep working |

### SDK architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Your Application                      │
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

### Alt Fee Transaction basics

Alt Fee Transaction (type `0x7f`) lets users pay gas with registered ERC-20 tokens (e.g., USDT/USDC) instead of ETH.

**Key fields:**
- `feeTokenID`: Token ID in the Token Registry
- `feeLimit`: Max token amount the user is willing to pay

---

## Installation

### Prerequisites

- Node.js >= 18
- pnpm / npm / yarn

### Pick the adapter for your stack

| If you use... | Package |
|-------------|--------|
| [Viem](https://viem.sh) | `@morph-network/viem` |
| [Ethers v6](https://docs.ethers.org/v6/) | `@morph-network/ethers` |
| [Ethers v5](https://docs.ethers.org/v5/) | `@morph-network/ethers5` |

### With pnpm (recommended)

```bash
# Viem adapter
pnpm add viem @morph-network/viem

# Ethers v6 adapter
pnpm add ethers @morph-network/ethers

# Ethers v5 adapter  
pnpm add ethers@^5.8.0 @morph-network/ethers5
```

### With npm

```bash
# Viem adapter
npm install viem @morph-network/viem

# Ethers v6 adapter
npm install ethers @morph-network/ethers

# Ethers v5 adapter
npm install ethers@^5.8.0 @morph-network/ethers5
```

### With yarn

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

### Viem quick start

Send an Alt Fee Transaction with the Viem adapter:

```typescript
import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { morphHoodiTestnet } from "@morph-network/viem";

// 1. Create account
const account = privateKeyToAccount("0x...");

// 2. Public Client (read)
const publicClient = createPublicClient({
  chain: morphHoodiTestnet,
  transport: http(),
});

// 3. Wallet Client (sign + send)
const walletClient = createWalletClient({
  account,
  chain: morphHoodiTestnet,
  transport: http(),
});

// 4. Send Alt Fee Transaction
async function sendAltFeeTransaction() {
  const nonce = await publicClient.getTransactionCount({
    address: account.address,
  });

  const hash = await walletClient.sendTransaction({
    account,
    to: "0x...",
    value: parseEther("0.01"),
    nonce,
    gas: 100000n,
    maxFeePerGas: 15000000n,
    maxPriorityFeePerGas: 14000000n,
    // Alt Fee fields
    feeTokenID: 6,                          // Token Registry ID
    feeLimit: 252637086960555000n,          // Max token payment
  });

  console.log("Transaction hash:", hash);
}

sendAltFeeTransaction();
```

### Ethers v6 quick start

Send an Alt Fee Transaction with the Ethers v6 adapter:

```typescript
import { BrowserProvider, parseEther } from "ethers";
import { MorphSigner, MORPH_HOODI_TESTNET } from "@morph-network/ethers";

async function main() {
  // 1. Provider (e.g., MetaMask)
  const provider = new BrowserProvider(window.ethereum);

  // 2. Wrap signer
  const browserSigner = await provider.getSigner();
  const signer = MorphSigner.from(browserSigner);

  // 3. Send Alt Fee Transaction
  const tx = await signer.sendTransaction({
    to: "0x...",
    value: parseEther("0.01"),
    chainId: MORPH_HOODI_TESTNET.chainId,
    gasLimit: 100000n,
    maxFeePerGas: 15000000n,
    maxPriorityFeePerGas: 14000000n,
    // Alt Fee fields
    feeTokenID: 6,
    feeLimit: 252637086960555000n,
  });

  console.log("Transaction response:", tx);
}
```

### Ethers v5 quick start

```typescript
import { ethers, providers } from "ethers";
import { MorphSigner, MORPH_HOODI_TESTNET } from "@morph-network/ethers5";

async function main() {
  // 1. Provider
  const provider = new providers.Web3Provider(window.ethereum);

  // 2. Wrap signer
  const web3Signer = provider.getSigner();
  const signer = MorphSigner.from(web3Signer);

  // 3. Send Alt Fee Transaction
  const tx = await signer.sendTransaction({
    to: "0x...",
    value: ethers.utils.parseEther("0.01"),
    chainId: MORPH_HOODI_TESTNET.chainId,
    gasLimit: ethers.BigNumber.from(100000),
    maxFeePerGas: ethers.BigNumber.from(15000000),
    maxPriorityFeePerGas: ethers.BigNumber.from(14000000),
    // Alt Fee fields
    feeTokenID: 6,
    feeLimit: ethers.BigNumber.from("252637086960555000"),
  });

  console.log("Transaction response:", tx);
}
```

### Query supported tokens

```typescript
import { createPublicClient, http } from "viem";
import { readContract } from "viem/actions";
import {
  morphHoodiTestnet,
  TOKEN_REGISTRY_PROXY_ADDRESS,
  tokenRegistryAbi,
} from "@morph-network/viem";

const publicClient = createPublicClient({
  chain: morphHoodiTestnet,
  transport: http(),
});

// Get supported tokens
async function getSupportedTokens() {
  const tokens = await readContract(publicClient, {
    address: TOKEN_REGISTRY_PROXY_ADDRESS,
    abi: tokenRegistryAbi,
    functionName: "getSupportedTokenList",
  });

  console.log("Supported tokens:", tokens);
  // => [{ tokenID: 6, tokenAddress: "0x..." }, ...]
}

// Get specific token info
async function getTokenInfo(tokenId: number) {
  const info = await readContract(publicClient, {
    address: TOKEN_REGISTRY_PROXY_ADDRESS,
    abi: tokenRegistryAbi,
    functionName: "getTokenInfo",
    args: [tokenId],
  });

  console.log("Token info:", info);
}
```

---

## API Reference

### @morph-network/viem

Viem adapter with Morph-specific features.

#### Chain definitions

##### `morphMainnet`

Mainnet chain object, usable directly in `createPublicClient` / `createWalletClient`.

```typescript
import { morphMainnet } from "@morph-network/viem";

// Properties
morphMainnet.id           // 2818
morphMainnet.name         // "Morph Mainnet"
morphMainnet.nativeCurrency // { name: "Ethereum", symbol: "ETH", decimals: 18 }
morphMainnet.rpcUrls.default.http // ["https://rpc.morph.network"]
```

**Usage:**

```typescript
import { createPublicClient, http } from "viem";
import { morphMainnet } from "@morph-network/viem";

const client = createPublicClient({
  chain: morphMainnet,
  transport: http(),
});
```

##### `morphHoodiTestnet`

Hoodi Testnet chain object.

```typescript
import { morphHoodiTestnet } from "@morph-network/viem";

// Properties
morphHoodiTestnet.id           // 2910
morphHoodiTestnet.name         // "Morph Hoodi Testnet"
morphHoodiTestnet.nativeCurrency // { name: "Ethereum", symbol: "ETH", decimals: 18 }
morphHoodiTestnet.rpcUrls.default.http // ["https://rpc-hoodi.morphl2.io"]
```

**Usage:**

```typescript
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { morphHoodiTestnet } from "@morph-network/viem";

const client = createWalletClient({
  account: privateKeyToAccount("0x..."),
  chain: morphHoodiTestnet,
  transport: http(),
});
```

---

#### Serialization helpers

##### `serializeTransaction(tx, signature?)`

Serialize EIP-1559 or Alt Fee transactions.

**Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `tx` | `AltFeeTransaction` | Transaction object |
| `signature` | `Signature` (optional) | Signature |

**Returns:** `Hex` - Serialized transaction hex

**Example:**

```typescript
import { serializeTransaction } from "@morph-network/viem";

const serialized = serializeTransaction({
  chainId: 2910,
  to: "0x...",
  value: 1000000000000000n,
  gas: 100000n,
  maxFeePerGas: 15000000n,
  maxPriorityFeePerGas: 14000000n,
  nonce: 0,
  feeTokenID: 6,
  feeLimit: 252637086960555000n,
});

console.log(serialized); // "0x7f..."
```

##### `serializeAltFeeTransaction(tx, signature?)`

Serialize Alt Fee transactions (type 0x7f).

**Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `tx` | `AltFeeTransaction` | Alt Fee transaction |
| `signature` | `Signature` (optional) | Signature |

**Returns:** `AltFeeTransactionSerialized`

**Example:**

```typescript
import { serializeAltFeeTransaction } from "@morph-network/viem";

const serialized = serializeAltFeeTransaction({
  chainId: 2910,
  to: "0x92be4a7c135314932b481c4c5a9e391644b91fe5",
  value: 10000000000000000n,
  gas: 1000000n,
  maxFeePerGas: 15316544n,
  maxPriorityFeePerGas: 14116544n,
  nonce: 5,
  feeTokenID: 6,
  feeLimit: 252637086960555000n,
  accessList: [],
});

// With signature
const signedSerialized = serializeAltFeeTransaction(tx, {
  r: "0x...",
  s: "0x...",
  v: 27n,
  yParity: 0,
});
```

---

#### Parsing helpers

##### `parseTransaction(serializedTx)`

Parse a serialized transaction and auto-detect Alt Fee vs standard.

**Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `serializedTx` | `Hex` | Serialized transaction hex |

**Returns:** Parsed transaction object

**Example:**

```typescript
import { parseTransaction } from "@morph-network/viem";

const tx = parseTransaction("0x7f...");

console.log(tx);
// {
//   type: "altFee",
//   chainId: 2910,
//   to: "0x...",
//   value: 10000000000000000n,
//   feeTokenID: 6,
//   feeLimit: 252637086960555000n,
//   ...
// }
```

##### `parseAltFeeTransaction(serializedTx)`

Parse Alt Fee transactions.

**Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `serializedTx` | `Hex` | Serialized Alt Fee transaction |

**Returns:** `AltFeeTransactionSerializable`

**Example:**

```typescript
import { parseAltFeeTransaction } from "@morph-network/viem";

const tx = parseAltFeeTransaction("0x7f...");

console.log(tx.feeTokenID);  // 6
console.log(tx.feeLimit);    // 252637086960555000n
console.log(tx.type);        // "altFee"
```

---

#### Address recovery

##### `recoverAddress(parameters)`

Recover the signer address from a serialized transaction (Alt Fee supported).

**Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `parameters.serializedTransaction` | `Hex` | Serialized transaction |
| `parameters.signature` | `Signature` (optional) | Signature (if not embedded) |

**Returns:** `Promise<Address>`

**Example:**

```typescript
import { recoverAddress, parseTransaction } from "@morph-network/viem";

const serializedTransaction = "0x7f..."; // Signed transaction

// Recover signer
const from = await recoverAddress({ serializedTransaction });
console.log("Signer address:", from);

// Verify flow
const parsedTx = parseTransaction(serializedTransaction);
const recoveredFrom = await recoverAddress({ serializedTransaction });

console.log("Parsed tx:", parsedTx);
console.log("Recovered from:", recoveredFrom);
```

---

#### Utility

##### `numeric(value)`

Convert between number, bigint, and hex.

**Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `value` | `number \| bigint \| Hex` | Input value |

**Return helpers:**

| Method | Returns | Description |
|--------|---------|-------------|
| `.bigint()` | `bigint` | To bigint |
| `.number()` | `number` | To number |
| `.hex()` | `Hex` | RLP-minified hex |
| `.uint(size)` | `Hex` | Fixed-width uint |
| `.uint16()` | `Hex` | uint16 |
| `.uint64()` | `Hex` | uint64 |

**Example:**

```typescript
import { numeric } from "@morph-network/viem";

// Convert types
numeric(0).hex();       // "0x"
numeric(1).hex();       // "0x1"
numeric(255).hex();     // "0xff"
numeric(256n).hex();    // "0x100"
numeric("0x10").hex();  // "0x10"

// Other conversions
numeric("0xff").number();  // 255
numeric(100).bigint();     // 100n
numeric(1000).uint16();    // "0x03e8"

// In a transaction
const tx = {
  feeTokenID: numeric(6).hex(),
  feeLimit: numeric(252637086960555000n).hex(),
};
```

---

#### Types

##### `AltFeeTransaction`

Alt Fee transaction type.

```typescript
import type { AltFeeTransaction } from "@morph-network/viem";

const tx: AltFeeTransaction = {
  chainId: 2910,
  to: "0x...",
  value: 1000000000000000n,
  gas: 100000n,
  maxFeePerGas: 15000000n,
  maxPriorityFeePerGas: 14000000n,
  nonce: 0,
  data: "0x",
  accessList: [],
  // Alt Fee fields
  feeTokenID: 6,
  feeLimit: 252637086960555000n,
};
```

##### `AltFeeTransactionRequest`

Alt Fee transaction request type for `signTransaction` / `sendTransaction`.

```typescript
import type { AltFeeTransactionRequest } from "@morph-network/viem";
```

##### `NumericLike`

```typescript
import type { NumericLike } from "@morph-network/viem";

// All valid NumericLike
const a: NumericLike = 6;
const b: NumericLike = 6n;
const c: NumericLike = "0x06";
```

---

### @morph-network/ethers

Ethers v6 adapter.

#### MorphSigner

Wraps an Ethers Signer to support Alt Fee Transactions.

##### `MorphSigner.from(signer)`

Factory to wrap an Ethers Signer with Morph Alt Fee support.

**Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `signer` | `Signer` | Ethers Signer instance |

**Returns:** `T & MorphSigner` - Wrapped signer with Morph features

**Example:**

```typescript
import { BrowserProvider } from "ethers";
import { MorphSigner } from "@morph-network/ethers";

const provider = new BrowserProvider(window.ethereum);
const browserSigner = await provider.getSigner();

// Wrap
const signer = MorphSigner.from(browserSigner);

// Alt Fee tx supported now
await signer.sendTransaction({
  to: "0x...",
  value: parseEther("0.01"),
  feeTokenID: 6,
  feeLimit: 252637086960555000n,
});
```

##### `signer.signTransaction(tx)`

Sign standard or Alt Fee transactions.

**Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `tx` | `TransactionRequest` | Request object |

**Returns:** `Promise<string>` - Signed tx hex

**TransactionRequest fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `to` | `string` | Yes | Recipient |
| `value` | `bigint` | No | Amount |
| `data` | `string` | No | Call data |
| `chainId` | `number` | Yes | Chain ID |
| `gasLimit` | `bigint` | Yes | Gas limit |
| `maxFeePerGas` | `bigint` | Yes | Max fee |
| `maxPriorityFeePerGas` | `bigint` | Yes | Max priority fee |
| `nonce` | `number` | No | Tx nonce |
| `feeTokenID` | `number` | No* | Token ID (required for Alt Fee) |
| `feeLimit` | `bigint` | No* | Token fee cap (required for Alt Fee) |

**Example:**

```typescript
const signedTx = await signer.signTransaction({
  to: "0x78fE92CBB534C4d35A8cB0F3F2C58a5AA7DF2DA6",
  chainId: 2910,
  value: parseEther("0.001"),
  gasLimit: 1000000n,
  maxFeePerGas: 15316544n,
  maxPriorityFeePerGas: 14116544n,
  feeTokenID: 2,
  feeLimit: 252637086960555000n,
});

console.log("Signed transaction:", signedTx);
```

##### `signer.sendTransaction(tx)`

Send standard or Alt Fee transactions.

**Parameters:** Same as `signTransaction`

**Returns:** `Promise<TransactionResponse>` - Tx response

**Example:**

```typescript
const txResponse = await signer.sendTransaction({
  to: "0x78fE92CBB534C4d35A8cB0F3F2C58a5AA7DF2DA6",
  chainId: 2910,
  value: parseEther("0.001"),
  gasLimit: 1000000n,
  maxFeePerGas: 15316544n,
  maxPriorityFeePerGas: 14116544n,
  feeTokenID: 3,
  feeLimit: 252637086960555000n,
});

console.log("Transaction hash:", txResponse.hash);

// Wait for confirmation
const receipt = await txResponse.wait();
console.log("Confirmed in block:", receipt.blockNumber);
```

##### `signer.estimateGas(tx)`

Estimate gas, including Alt Fee support.

**Parameters:** Same as `signTransaction`

**Returns:** `Promise<bigint>` - Gas estimate

**Example:**

```typescript
const gasEstimate = await signer.estimateGas({
  to: "0x78fE92CBB534C4d35A8cB0F3F2C58a5AA7DF2DA6",
  chainId: 2910,
  value: parseEther("0.001"),
  gasLimit: 1000000n,
  maxFeePerGas: 15316544n,
  maxPriorityFeePerGas: 14116544n,
  feeTokenID: 3,
  feeLimit: 252637086960555000n,
});

console.log("Estimated gas:", gasEstimate.toString());
```

##### `signer.populateTransaction(tx)`

Populate missing fields (nonce/gasLimit/etc.).

**Parameters:** Same as `signTransaction`

**Returns:** `Promise<TransactionRequest>` - Populated request

**Example:**

```typescript
const populatedTx = await signer.populateTransaction({
  to: "0x78fE92CBB534C4d35A8cB0F3F2C58a5AA7DF2DA6",
  value: parseEther("0.001"),
  feeTokenID: 3,
});

console.log("Populated tx:", populatedTx);
// Contains auto-filled nonce, gasLimit, chainId, etc.
```

---

### @morph-network/ethers5

Ethers v5 adapter with the same API shape as `@morph-network/ethers`.

#### MorphSigner (Ethers v5)

```typescript
import { providers } from "ethers";
import { MorphSigner } from "@morph-network/ethers5";

const provider = new providers.Web3Provider(window.ethereum);
const web3Signer = provider.getSigner();

// Wrap
const signer = MorphSigner.from(web3Signer);
```

```typescript
import { ethers } from "ethers";

const signedTx = await signer.signTransaction({
  to: "0x...",
  chainId: 2910,
  value: ethers.utils.parseEther("0.001"),
  gasLimit: ethers.BigNumber.from(1000000),
  maxFeePerGas: ethers.BigNumber.from(15316544),
  maxPriorityFeePerGas: ethers.BigNumber.from(14116544),
  feeTokenID: 2,
  feeLimit: ethers.BigNumber.from("252637086960555000"),
});
```

```typescript
const txResponse = await signer.sendTransaction({
  to: "0x...",
  chainId: 2910,
  value: ethers.utils.parseEther("0.001"),
  gasLimit: ethers.BigNumber.from(1000000),
  maxFeePerGas: ethers.BigNumber.from(15316544),
  maxPriorityFeePerGas: ethers.BigNumber.from(14116544),
  feeTokenID: 3,
});
```

```typescript
const gasEstimate = await signer.estimateGas({
  to: "0x...",
  chainId: 2910,
  value: ethers.utils.parseEther("0.001"),
  feeTokenID: 3,
  feeLimit: ethers.BigNumber.from("252637086960555000"),
});

console.log("Estimated gas:", gasEstimate.toString());
```

---

### @morph-network/chain

Chain definitions as a standalone package, so you can reuse Morph networks across libraries.

**Example:**

```typescript
import { morphMainnet, morphHoodiTestnet } from "@morph-network/chain";

console.log(morphMainnet.id); // 2818
console.log(morphHoodiTestnet.rpcUrls.default.http[0]); // https://rpc-hoodi.morphl2.io
```
