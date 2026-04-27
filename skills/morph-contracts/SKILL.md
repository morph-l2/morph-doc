---
name: morph-contracts
description: "Morph network info and contract addresses for Mainnet (chainId 2818) and Hoodi Testnet (chainId 2910): RPC URLs, block explorers, L1/L2 bridge contracts, gateway routers, token addresses, predeploys, and the Morph Bridge mainnet token list (ERC-20 + gateways). Use when the user needs RPC endpoints, chain IDs, contract addresses, token addresses for Morph Mainnet or Hoodi Testnet, or bridge-listed token pairs between Ethereum and Morph."
last_verified: 2026-04-20
verified_against:
  - docs/build-on-morph/developer-resources/1-contracts.md
  - ../morph-bridge/public/morph-list/src/mainnet/tokenList.json
---

# Morph Contract Addresses Reference (Execution Playbook)

## Single Source of Truth

- **General contracts (rollup, messengers, predeploys):** `docs/build-on-morph/developer-resources/1-contracts.md`
- **Bridge-listed tokens + per-token gateway addresses (Mainnet):** canonical JSON is maintained in the Morph Bridge app — see [Bridge token list (Mainnet)](#bridge-token-list-mainnet) below. The tables in this Skill mirror that file; if they disagree, **trust the JSON** in the repo path given there.

## Network Info

| Network | RPC URL | Chain ID | Explorer |
|---------|---------|----------|----------|
| Morph Mainnet | `https://rpc-quicknode.morph.network` | **2818** | `https://explorer.morph.network` |
| Morph Hoodi Testnet | `https://rpc-hoodi.morph.network` | **2910** | `https://explorer-hoodi.morph.network` |
| Ethereum Mainnet | `https://ethereum-rpc.publicnode.com` | 1 | `https://etherscan.io` |
| Ethereum Hoodi Testnet | `https://ethereum-hoodi-rpc.publicnode.com` | 560048 | `https://hoodi.etherscan.io` |

## Mainnet Common Contracts

### L2 Predeploys (Morph Mainnet)

| Contract | Address |
|----------|---------|
| L2GatewayRouter | `0x5300000000000000000000000000000000000002` |
| L2CrossDomainMessenger | `0x5300000000000000000000000000000000000007` |
| L2ETHGateway | `0x5300000000000000000000000000000000000006` |
| L2ToL1MessagePasser | `0x5300000000000000000000000000000000000001` |
| GasPriceOracle | `0x530000000000000000000000000000000000000f` |
| L2WETH | `0x5300000000000000000000000000000000000011` |
| TokenRegistry (AltFee) | `0x5300000000000000000000000000000000000021` |
| EIP-8004 IdentityRegistry | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` |
| EIP-8004 ReputationRegistry | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` |

### L1 Contracts (Ethereum Mainnet)

| Contract | Address |
|----------|---------|
| L1GatewayRouter | `0x7497756ada7e656ae9f00781af49fc0fd08f8a8a` |
| L1CrossDomainMessenger | `0xdc71366effa760804dcfc3edf87fa2a6f1623304` |
| Rollup | `0x759894ced0e6af42c26668076ffa84d02e3cef60` |

## Bridge token list (Mainnet)

**Canonical file (same content the bridge UI uses):** `morph-bridge/public/morph-list/src/mainnet/tokenList.json` — from **morph-doc** at repo root use `../morph-bridge/public/morph-list/src/mainnet/tokenList.json` (sibling app in the monorepo).

- **List metadata:** `timestamp` in JSON (e.g. `2025-07-31T16:00:00Z`); treat the JSON as the live list if this Skill’s tables drift.

### Ethereum Mainnet (`chainId` 1) — bridge entries

| Symbol | Display / note | Address | Decimals | `gatewayName` | `gatewayAddress` |
|--------|----------------|---------|----------|---------------|------------------|
| ETH | — | `0x0000000000000000000000000000000000000000` | 18 | L1ETHGateway | `0x1c1ffb5828c3a48b54e8910f1c75256a498ade68` |
| USDT | USDT(USDT0) | `0xdAC17F958D2ee523a2206206994597C13D831ec7` | 6 | L1StandardERC20Gateway | `0x44c28f61a5c2dd24fc71d7df8e85e18af4ab2bd8` |
| WBTC | — | `0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599` | 8 | L1StandardERC20Gateway | `0x44c28f61a5c2dd24fc71d7df8e85e18af4ab2bd8` |
| WETH | — | `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` | 18 | L1WETHGateway | `0x788890ba6f105cca373c4ff01055cd34de01877f` |
| LegacyUSDC | — | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` | 6 | L1USDCGateway | `0x2C8314f5AADa5D7a9D32eeFebFc43aCCAbe1b289` |
| USDC | LayerZero path on L2 | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` | 6 | L1USDCGateway | `0x2C8314f5AADa5D7a9D32eeFebFc43aCCAbe1b289` |
| DAI | — | `0x6B175474E89094C44Da98b954EedeAC495271d0F` | 18 | L1CustomERC20Gateway | `0xa534badd09b4c62b7b1c32c41df310aa17b52ef1` |
| BGB | `protocol`: ccip | `0x54D2252757e1672EEaD234D27B1270728fF90581` | 18 | L1StandardERC20Gateway | `0x44c28f61a5c2dd24fc71d7df8e85e18af4ab2bd8` |
| MX | — | `0x11eeF04c884E24d9B7B4760e7476D06ddF797f36` | 18 | L1StandardERC20Gateway | `0x44c28f61a5c2dd24fc71d7df8e85e18af4ab2bd8` |
| GT | — | `0xE66747a101bFF2dBA3697199DCcE5b743b454759` | 18 | L1StandardERC20Gateway | `0x44c28f61a5c2dd24fc71d7df8e85e18af4ab2bd8` |
| HTX | — | `0x61ec85ab89377db65762e234c946b5c25a56e99e` | 18 | L1StandardERC20Gateway | `0x44c28f61a5c2dd24fc71d7df8e85e18af4ab2bd8` |
| HT | — | `0x6f259637dcd74c767781e37bc6133cd6a68aa161` | 18 | L1StandardERC20Gateway | `0x44c28f61a5c2dd24fc71d7df8e85e18af4ab2bd8` |
| BGBTC | — | `0x0520930f21b14cafac7a27b102487bee7138a017` | 8 | L1StandardERC20Gateway | `0x44c28f61a5c2dd24fc71d7df8e85e18af4ab2bd8` |
| OMZ | — | `0xd7D9BaBf56A66dAFF2aC5dc96F7e886c05124676` | 18 | L1StandardERC20Gateway | `0x44c28f61a5c2dd24fc71d7df8e85e18af4ab2bd8` |

### Morph Mainnet (`chainId` 2818) — bridge entries

| Symbol | `displaySymbol` / note | Name | Address | Decimals | `protocol` | `gatewayName` | `gatewayAddress` |
|--------|-------------------------|------|---------|----------|--------------|---------------|------------------|
| ETH | — | Ethereum Token | `0x0000000000000000000000000000000000000000` | 18 | — | L2ETHGateway | `0x5300000000000000000000000000000000000006` |
| USDT | USDT.e | Tether Morph Bridged | `0xc7D67A9cBB121b3b0b9c053DD9f469523243379A` | 6 | native | L2StandardERC20Gateway | `0x5300000000000000000000000000000000000008` |
| USDT | USDT (USDT0) | Tether USD | `0xe7cd86e13AC4309349F30B3435a9d337750fC82D` | 6 | layerzero | *(empty in JSON)* | *(empty in JSON)* |
| WBTC | — | Wrapped Bitcoin | `0x803DcE4D3f4Ae2e17AF6C51343040dEe320C149D` | 8 | — | L2StandardERC20Gateway | `0x5300000000000000000000000000000000000008` |
| WETH | — | WETH | `0x5300000000000000000000000000000000000011` | 18 | — | L2WETHGateway | `0x5300000000000000000000000000000000000010` |
| LegacyUSDC | — | LegacyUSDC | `0x1199E23C0baE9710cCd9F645FA57794e5D469D06` | 6 | — | L2USDCGateway | `0x5300000000000000000000000000000000000020` |
| USDC | USDC.e | USDC Morph Bridged | `0xe34c91815d7fc18A9e2148bcD4241d0a5848b693` | 6 | native | L2USDCGateway | `0xc5e44E2fFe9523809146eD17D62bb382ECCf426B` |
| USDC | USDC | USDC | `0xCfb1186F4e93D60E60a8bDd997427D1F33bc372B` | 6 | layerzero | *(empty in JSON)* | *(empty in JSON)* |
| DAI | — | Dai | `0xef8A24599229D002B28bA2F5C0eBdD3c0EFFbed4` | 18 | — | L2CustomERC20Gateway | `0x5300000000000000000000000000000000000016` |
| BGB | BGB(old) | BitgetToken | `0x55d1f1879969bdbB9960d269974564C58DBc3238` | 18 | native | L2StandardERC20Gateway | `0x5300000000000000000000000000000000000008` |
| BGB | — | BitgetToken | `0x389C08Bc23A7317000a1FD76c7c5B0cb0b4640b5` | 18 | ccip | *(empty in JSON)* | *(empty in JSON)* |
| MX | — | MX Token | `0x0BEeF4B01281D85492713a015d51fEc5b6D14687` | 18 | — | L2StandardERC20Gateway | `0x5300000000000000000000000000000000000008` |
| GT | — | GateChainToken | `0x37d9A4d0b8B920CB2502dE3cA11c2227F4ADAcE9` | 18 | — | L2StandardERC20Gateway | `0x5300000000000000000000000000000000000008` |
| HTX | — | HTX | `0xD4eA4A71815D6999D1e28658f6E2d514BB356fA1` | 18 | — | L2StandardERC20Gateway | `0x5300000000000000000000000000000000000008` |
| HT | — | HuobiToken | `0x18e6C1Fdf768B25778eAA4Bf4f4c66c27c5128f6` | 18 | — | L2StandardERC20Gateway | `0x5300000000000000000000000000000000000008` |
| BGBTC | — | Bitget Wrapped BTC | `0x34951712c39d6284eC1afF60798C2E01E7cfB8eF` | 8 | — | L2StandardERC20Gateway | `0x5300000000000000000000000000000000000008` |
| OMZ | — | Open Meta City | `0xAA4353dA53DE0202119b5315109130D8E4aCDe17` | 18 | — | L2StandardERC20Gateway | `0x5300000000000000000000000000000000000008` |

> **Dual USDT / USDC / BGB variants:** the list above matches `tokenList.json`. **USDT** has bridged **USDT.e**, native **USDT0-style** USDT, and L1 USDT for deposits. **USDC** has **LegacyUSDC**, bridged **USDC.e**, and LayerZero **USDC** on L2. **BGB** has an older bridged **BGB(old)** and the current **ccip** BGB — confirm with the user which symbol/version they need.

## AltFee Token ID Mapping

| ID | Token |
|----|-------|
| 1 | USDT.e |
| 2 | USDC.e |
| 3 | BGB (old) |
| 4 | BGB |
| 5 | USDT |
| 6 | USDC |

## Hoodi Testnet Contracts

Hoodi contract addresses are in the Hoodi section of `1-contracts.md`. Common test token: L2USDC = `0x1178341838B764dCfFA5BCEAb1d41443Fd71a227`

## Python CLI Runtime Overrides

```bash
export MORPH_RPC_URL="https://rpc-hoodi.morph.network"
export MORPH_CHAIN_ID=2910
export MORPH_IDENTITY_REGISTRY="0x8004A818BFB912233c491871b3d84c89A494BD9e"
export MORPH_REPUTATION_REGISTRY="0x8004B663056A597Dffe9eCcC1965A193B7388713"
```

## Self-Check

- [ ] Are general contract addresses deferred to `1-contracts.md` as the authoritative source?
- [ ] For bridge tokens and gateways, is **`tokenList.json`** named as the canonical list if tables might be incomplete?
- [ ] Is the user prompted to confirm which USDT / USDC / BGB version they need?
- [ ] Are Hoodi and Mainnet addresses clearly distinguished?
