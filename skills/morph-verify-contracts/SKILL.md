---
name: morph-verify-contracts
description: "Verify smart contracts on the Morph block explorer (Blockscout) using Hardhat, Foundry, or the explorer UI. Use when the user wants to verify a deployed contract on Morph Mainnet (chainId 2818) or Hoodi Testnet (chainId 2910), set up etherscan/blockscout config in hardhat.config.js, run forge verify-contract, or manually verify via Solidity/Vyper methods on explorer.morph.network."
last_verified: 2026-05-14
verified_against:
  - docs/build-on-morph/build-on-morph/5-verify-your-smart-contracts.md
  - docs/build-on-morph/code-examples/1-deploy-contract-on-morph.md
  - src/components/config.js
---

# Verify Smart Contracts on Morph (Execution Playbook)

## Authoritative Documentation (single source of truth)

`docs/build-on-morph/build-on-morph/5-verify-your-smart-contracts.md`

Site route id: `build-on-morph/build-on-morph/verify-your-smart-contracts`

Block explorers:
- Mainnet: `https://explorer.morph.network`
- Hoodi Testnet: `https://explorer-hoodi.morph.network`

## Network Parameters

| Network | Chain ID | Explorer API URL |
|---------|----------|-----------------|
| Morph Mainnet | 2818 | `https://explorer-api.morph.network/api?` |
| Hoodi Testnet | 2910 | `https://explorer-api-hoodi.morph.network` |

## Execution Steps

### Verify with Hardhat

1. Add to `hardhat.config.js`:
   ```js
   etherscan: {
     apiKey: { morph: 'anything' },
     customChains: [{
       network: 'morph',
       chainId: 2818,
       urls: {
         apiURL: 'https://explorer-api.morph.network/api?',
         browserURL: 'https://explorer.morph.network/',
       },
     }],
   }
   ```
2. Run: `npx hardhat verify --network morph <ContractAddress> [constructor args]`

### Verify with Foundry

```bash
forge verify-contract <YourContractAddress> <ContractName> \
  --chain 2818 \
  --verifier-url https://explorer-api.morph.network/api? \
  --verifier blockscout --watch
```

Adjust `--chain` to `2910` for Hoodi Testnet.

### Verify via Explorer UI

Navigate to `https://explorer.morph.network` → contract page → "Verify & Publish". Choose one of 6 methods:

| Method | When to use |
|--------|-------------|
| Solidity (Flattened Source) | Single file; flatten with `forge flatten` first |
| Solidity (Standard JSON Input) | From solc or Remix compiler |
| Solidity (Multi-part files) | Multiple files with adjusted import paths |
| Vyper (Contracts) | Vyper single contract |
| Vyper (Standard JSON Input) | Vyper JSON flow |
| Vyper (Multi-part files) | Multiple Vyper files |

For all methods: **Compiler version and Optimization settings must exactly match deployment**.

## Key Pitfalls

- The `apiKey` value for Morph can be any non-empty string (`'anything'` is valid); Blockscout does not enforce it.
- Flattened Solidity: imported files must be inlined; use `forge flatten --output Flat.sol ./contracts/X.sol`.
- Multi-part files: adjust import paths to same-level references; submit all dependency files together.

## Self-Check

- [ ] Chain ID matches the target network (2818 mainnet / 2910 Hoodi).
- [ ] Compiler version and optimization settings match what was used at deployment.
- [ ] Hardhat config uses `customChains` with the correct `apiURL` and `browserURL`.
- [ ] Foundry command uses `--verifier blockscout` (not etherscan).
- [ ] Flattened source or multi-part imports adjusted before submission.
