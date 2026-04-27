---
name: morph-js-sdk
description: "Morph JavaScript/TypeScript SDK: Alt Fee (tx type 0x7f), @morph-network/viem, @morph-network/ethers, @morph-network/ethers5, @morph-network/chain presets, Token Registry, feeTokenID/feeLimit, RPC and chainId. Use when the user builds or debugs Morph dApps in JS/TS, picks Viem vs Ethers, configures wallets/clients, sends gas in ERC-20, queries supported fee tokens, integrates npm packages, or asks about Morph-specific transaction fields, adapters, or network IDs (e.g. 2818, 2910). SKILL.md includes abbreviated Viem/Ethers snippets; full API tables and extended examples are in morph-doc js-sdk.mdx."
last_verified: 2026-04-27
verified_against:
  - docs/build-on-morph/sdk/js-sdk.mdx
  - examples/viem-alt-fee/
---

# Morph JS/TS SDK (Execution Playbook)

## Source of Truth

Read the in-repo doc before writing code or drawing conclusions:

- File: `docs/build-on-morph/sdk/js-sdk.mdx`
- Site route id: `build-on-morph/sdk/js-sdk`
- Standalone Node example: `examples/viem-alt-fee/` (aligned with Quick Start values)

The doc covers installation matrix, Quick Start, per-package API Reference, chain and Token Registry descriptions. This skill does not duplicate the long tables and signatures; open the corresponding section of the above file when details are needed.

## Minimal Example (consistent with `js-sdk.mdx` Quick Start; use doc values as canonical)

The skeletons below cover the most common paths; `feeTokenID` / `feeLimit`, gas, and chain object names follow the doc and current package exports.

### Viem (`@morph-network/viem`)

```typescript
import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { morphHoodiTestnet } from "@morph-network/viem";

const account = privateKeyToAccount("<YOUR_PRIVATE_KEY>");
const publicClient = createPublicClient({ chain: morphHoodiTestnet, transport: http() });
const walletClient = createWalletClient({ account, chain: morphHoodiTestnet, transport: http() });

const hash = await walletClient.sendTransaction({
  account,
  to: "0x...",
  value: parseEther("0.001"),
  nonce: await publicClient.getTransactionCount({ address: account.address }),
  gas: 100000n,
  maxFeePerGas: 15000000n,
  maxPriorityFeePerGas: 14000000n,
  feeTokenID: 4,
  feeLimit: 252637086960555000n,
});
```

### Ethers v6 (`@morph-network/ethers`)

```typescript
import { BrowserProvider, parseEther } from "ethers";
import { MorphSigner, MORPH_HOODI_TESTNET } from "@morph-network/ethers";

const provider = new BrowserProvider(window.ethereum);
const signer = MorphSigner.from(await provider.getSigner());

await signer.sendTransaction({
  to: "0x...",
  value: parseEther("0.001"),
  chainId: MORPH_HOODI_TESTNET.chainId,
  gasLimit: 100000n,
  maxFeePerGas: 15000000n,
  maxPriorityFeePerGas: 14000000n,
  feeTokenID: 4,
  feeLimit: 252637086960555000n,
});
```

## Execution Steps

1. **Choose stack**: Select the adapter package based on the user's underlying library — Viem → `@morph-network/viem`; Ethers v6 → `@morph-network/ethers`; Ethers v5 → `@morph-network/ethers5`. Use `@morph-network/chain` (or the viem chain export aligned with the doc) for chain definitions.
2. **Distinguish Alt Fee from regular transactions**: Alt Fee is Morph's proprietary type `0x7f` and requires a valid `feeTokenID` (token gas); `feeLimit` is optional (protocol can fall back to balance as cap — see `js-sdk.mdx` and `10-altfeetx.md`); do not guess Morph field semantics from pure EIP-1559 experience or skip Registry-related steps.
3. **Chain and network**: Mainnet / Hoodi chainId, RPC names follow the doc and current package exports (commonly seen in doc: Mainnet `2818`, Hoodi testnet `2910`); if the user's version is outdated, prompt them to align with the package versions listed in the doc rather than hardcoding old constants.
4. **Site Demo**: The React Demo referenced in `js-sdk.mdx` only runs inside the Docusaurus site; when helping users in IDE, use the static code blocks from the doc — do not assume `@site/...` components can be imported.
5. **Do not fabricate exports**: Function names, types, and re-exported chain objects follow the doc and installed package `d.ts`; when uncertain, ask the user to paste their `package.json` version or copy the API table from the doc themselves.

## Self-Check

- Is the answer backed by `js-sdk.mdx`?
- Do the Alt Fee fields cover both Registry / limit semantics (as described in the doc)?
- Is the difference in syntax explained for the user's chosen adapter (viem / ethers / ethers5)?
