---
name: morph-bridge
description: "Bridge ETH and ERC-20 tokens between Ethereum (L1) and Morph (L2): deposit via L1GatewayRouter, withdraw via L2 Gateway with finalization proof, and add custom tokens to the canonical bridge. Use when the user needs to bridge assets programmatically, finalize an L2→L1 withdrawal using proveAndRelayMessage, query L2 token addresses with getL2ERC20Address, or list their token on the Morph Bridge frontend."
last_verified: 2026-05-09
verified_against:
  - docs/build-on-morph/build-on-morph/3-bridge-between-morph-and-ethereum.md
---

# Morph Bridge (Execution Playbook)

## Authoritative Documentation (single source of truth)

`docs/build-on-morph/build-on-morph/3-bridge-between-morph-and-ethereum.md`

Site route id: `build-on-morph/build-on-morph/bridge-between-morph-and-ethereum`

Background concept: `docs/how-morph-works/general-protocol-design/2-communicate-between-morph-and-ethereum.md`

SDK helper: `docs/build-on-morph/sdk/globals.md`

## Execution Steps

### Deposit (L1 → L2)

1. Locate `L1GatewayRouter` address via `morph-contracts` skill (Mainnet chainId 2818 / Hoodi 2910).
2. Call `depositETH(uint256 amount, uint256 gasLimit)` (payable — ETH sent covers L2 fee; `0.00001 ETH` is typically enough) to deposit ETH.
3. For ERC-20: call `depositERC20(address token, uint256 amount, uint256 gasLimit)` — the router auto-selects `L1StandardERC20Gateway` or a custom gateway. Do **not** pre-select the gateway.
4. To get the L2 token address for an L1 token: call `getL2ERC20Address(address l1Token)` on `L1GatewayRouter`.
5. Wait for the Sequencer to pick up the L1 message and execute it on L2 (no extra user action needed).

### Withdraw (L2 → L1)

1. On L2, call `withdrawETH` or `withdrawERC20` on the L2 Gateway (payable — ETH covers L1 fee; `0.005 ETH` suggested). Assets are **burned** on Morph immediately; there is no recovery if the L1 tx reverts.
2. Wait for the batch containing the withdrawal to pass the challenge period and be finalized (`withdrawalRoots[batchDataStore[_batchIndex].withdrawalRoot] == true` in the `Rollup` contract).
3. Fetch proof data from the backend API: `GET /getProof?nonce=<withdraw.index>`. Response fields: `index`, `leaf`, `proof`, `root`.
4. Call `L1CrossDomainMessenger.proveAndRelayMessage(from, to, value, nonce, message, withdrawalProof[32], withdrawalRoot)`.
   - `from / to / value / nonce / message` — from the L2 `SentMessage` event.
   - `withdrawalProof / withdrawalRoot` — from the proof API response.

### Add a custom token

- **Quick (dev/test):** Use the bridge frontend at `https://bridge-hoodi.morph.network` → token selector → enter L1 contract → confirm L2 address.
- **Token list PR:** Raise a PR to `https://github.com/morph-l2/morph-list`. Include both L1 and L2 addresses. L2 address is obtained via the frontend flow above. See example PR in the doc.

## Key Pitfalls

- Withdrawal ETH is burned on L2 immediately — **irreversible** if L1 tx reverts.
- ERC-20 tokens have different addresses on L2; always use `getL2ERC20Address` to resolve.
- Do not send insufficient ETH for fees: deposit under-fee → tx not sent (excess refunded); withdrawal under-fee → same.

## Related Skills

- `morph-contracts` — L1GatewayRouter, L2 Gateway, L1CrossDomainMessenger addresses
- `morph-js-sdk` — SDK wrapper for bridge interactions

## Self-Check

- [ ] Deposit function is on `L1GatewayRouter` (L1 side), not on the specific gateway.
- [ ] Withdrawal finalization requires `proveAndRelayMessage` with Merkle proof from `/getProof` API.
- [ ] L2 token address resolved via `getL2ERC20Address`, not assumed equal to L1 address.
- [ ] ETH payable amounts quoted from doc (`0.00001` deposit / `0.005` withdrawal) — do not invent.
- [ ] Custom token listing requires both L1 + L2 addresses in the morph-list PR.
