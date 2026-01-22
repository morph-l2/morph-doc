---
title: Morph SDK
lang: en-US
description: Official JavaScript/TypeScript SDK for interacting with the Morph Network.
---

# Morph SDK Documentation

> Official JavaScript/TypeScript SDK for interacting with the Morph Network.

## Table of Contents

* [Introduction](https://www.google.com/search?q=%23introduction)
* [Wallet Compatibility](https://www.google.com/search?q=%23wallet-compatibility)
* [Installation](https://www.google.com/search?q=%23installation)
* [Quick Start](https://www.google.com/search?q=%23quick-start)
* [API Reference](https://www.google.com/search?q=%23api-reference)
* [@morph-network/viem](https://www.google.com/search?q=%23morph-networkviem)
* [@morph-network/ethers](https://www.google.com/search?q=%23morph-networkethers)
* [@morph-network/ethers5](https://www.google.com/search?q=%23morph-networkethers5)
* [@morph-network/chain](https://www.google.com/search?q=%23morph-networkchain)



---

## Introduction

The **Morph SDK** is a suite of official JavaScript/TypeScript developer tools designed to interact with the Morph Network. Its primary feature is support for **Alt Fee Transactions**—a unique Morph transaction type that allows users to pay gas fees using ERC-20 tokens (such as USDT or USDC) instead of ETH.


### Why choose the Morph SDK?

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

### Alt Fee Transaction basics

Alt Fee Transaction (type `0x7f`) lets users pay gas with registered ERC-20 tokens (e.g., USDT/USDC) instead of ETH.

## Wallet Compatibility

> ⚠️ **Important**: Alt Fee Transactions require wallet-side support. Currently, **Bitget Wallet** provides full support for this feature.

### Detection and Fallback

It is highly recommended to detect wallet capabilities before attempting an Alt Fee transaction to ensure a smooth user experience:

```typescript
import { detectMorphCapabilities } from "@morph-network/chain";

async function checkWalletSupport() {
  const capabilities = await detectMorphCapabilities();
  
  if (capabilities.features.altFee.isSupported) {
    console.log("Wallet supports Alt Fee Transactions!");
    // Access supported token IDs for the current network
    const mainnetTokens = capabilities.features.altFee.supportedFeeTokenIDsByNetwork["mainnet"];
  } else {
    console.log("Wallet does not support Alt Fee. Falling back to ETH.");
  }
}

```

---

## Installation

Install the package that corresponds to the Ethereum library you are using:

| Library | Package |
| --- | --- |
| [Viem](https://viem.sh) | `@morph-network/viem` |
| [Ethers v6](https://docs.ethers.org/v6/) | `@morph-network/ethers` |
| [Ethers v5](https://docs.ethers.org/v5/) | `@morph-network/ethers5` |

### Using pnpm (Recommended)

```bash
# For Viem users
pnpm add @morph-network/viem viem

# For Ethers v6 users
pnpm add @morph-network/ethers ethers

```

---

## Quick Start

### Core Concepts: The feeLimit Formula

The `feeLimit` represents the maximum token amount you are willing to pay for the transaction. It is calculated based on the gas price and the token's exchange rate:

* **tokenScale**: Precision coefficient (obtained from `getTokenInfo`).
* **feeRate**: Token price ratio (obtained from `priceRatio`).

### Viem Example

```typescript
import { createWalletClient, custom } from "viem";
import { morphHoodiTestnet } from "@morph-network/viem";

const client = createWalletClient({
  chain: morphHoodiTestnet,
  transport: custom(window.ethereum),
});

const [account] = await client.requestAddresses();

// Send Alt Fee Transaction (Type 0x7f)
const hash = await client.sendTransaction({
  account,
  to: '0x...',
  value: 0n,
  feeTokenID: 1,      // ID from Token Registry
  feeLimit: 1000000n, // Calculated max token fee
});

```

### Ethers v6 Example

```typescript
import { BrowserProvider } from "ethers";
import { MorphSigner, MORPH_HOODI_TESTNET } from "@morph-network/ethers";

const provider = new BrowserProvider(window.ethereum);
const baseSigner = await provider.getSigner();
const signer = MorphSigner.from(baseSigner);

const tx = await signer.sendTransaction({
  to: '0x...',
  chainId: MORPH_HOODI_TESTNET.chainId,
  feeTokenID: 1,
  feeLimit: 1000000n,
});

```

---

## API Reference

### @morph-network/viem

* **morphMainnet** / **morphHoodiTestnet**: Chain definitions for Viem.
* **serializeTransaction**: Serializes both EIP-1559 and Alt Fee transactions.
* **parseTransaction**: Decodes serialized hex strings into transaction objects.

### @morph-network/ethers

* **MorphSigner**: A wrapper class for Ethers signers.
* **MorphSigner.from(signer)**: Wraps a standard signer to enable Morph features.
* **estimateGas(tx)**: Supports gas estimation for Alt Fee types.
* **sendTransaction(tx)**: Dispatches Alt Fee transactions to the network.



### @morph-network/chain

* **Constants**:
* **TOKEN_REGISTRY_PROXY_ADDRESS**: `0x5300000000000000000000000000000000000021`
* **ALT_FEE_TX_TYPE**: `0x7f`


* **tokenRegistryAbi**: ABI for interacting with the fee token registry.
* **detectMorphCapabilities()**: Asynchronous check for wallet feature support.

---

## Error Handling

| Error Message | Cause | Solution |
| --- | --- | --- |
| `feeLimit too low` | feeLimit < required fee | Re-calculate with a 10-20% safety margin. |
| `insufficient fee token balance` | Not enough ERC-20 tokens | Ensure the address holds enough of the specific token. |
| `Invalid Transaction Type` | Wallet doesn't support 0x7f | Use `detectMorphCapabilities` to verify support before sending. |

---

## Support & Links

* **Mainnet Explorer**: [explorer.morph.network](https://explorer.morph.network)
* **Testnet Explorer**: [explorer-hoodi.morph.network](https://explorer-hoodi.morph.network)
* **Official Website**: [morph.network](https://morph.network)

---