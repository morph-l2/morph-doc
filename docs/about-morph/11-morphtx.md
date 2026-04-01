---
title: MorphTx Technical Specification
lang: en-US
---

## Abstract

Morph is designed as a **payment settlement layer** — a high-performance L2 blockchain purpose-built for real-world payment and commerce use cases. To bridge the gap between on-chain transactions and off-chain payment systems, Morph introduces **MorphTx** (`0x7F`), a custom [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718) typed transaction that extends the standard EIP-1559 DynamicFeeTx with two key capabilities. MorphTx consolidates and extends the AltFeeTx transaction type introduced in the Emerald upgrade, evolving it into a unified transaction primitive with broader functionality:

[**Alternative Fee Transaction**](./10-altfeetx.md) enables users to pay gas fees using on-chain registered ERC-20 tokens (e.g., USDT, USDC) instead of ETH. This removes a critical barrier for payment adoption — merchants and end users no longer need to hold native ETH to interact with the chain. Fee conversion happens at the protocol level using an on-chain oracle, eliminating any dependency on Paymaster contracts or external bundlers.

**Reference Key** introduces a 32-byte merchant-controlled index field embedded natively in the transaction structure. This field is designed to meet three requirements for production payment integration:

1. **Indexed query support** — a dedicated on-chain index keyed by Reference allows off-chain systems to efficiently retrieve all transactions associated with a given order, batch, or session, without full chain scanning.
2. **Zero performance impact** — the index is maintained asynchronously during block insertion and uses a prefix-ordered key layout, adding negligible overhead to the critical execution path.
3. **Merchant-friendly generation** — a Reference can be any deterministic 32-byte value: a keccak256 hash of an order ID, a UUID, or a composite business key. No smart contract interaction is required to register or use a Reference.

Together, these features make MorphTx the foundational transaction primitive for payment settlement on Morph: token-denominated fees reduce friction for merchants and users, while Reference-based indexing provides the traceability and reconciliation primitives that payment systems require.

---

## 1. Introduction

### 1.1 Background

Standard Ethereum transactions were designed for general-purpose computation. They require ETH for gas and offer no native mechanism for linking on-chain activity to off-chain business context. For payment use cases — where merchants accept stablecoins, reconcile orders, and integrate with existing financial systems — this creates two fundamental gaps:

- **Gas friction**: End users and merchants must acquire and manage ETH solely to pay transaction fees, even when the actual transfer is denominated in USDT or USDC.
- **Traceability gap**: There is no protocol-level way to tag a transaction with a business identifier (e.g., an order ID) and later query all transactions sharing that identifier. Applications resort to event logs, off-chain indexers, or custom smart contracts — all of which add complexity, latency, and cost.

### 1.2 From AltFeeTx to MorphTx

The [Emerald upgrade](./10-altfeetx.md) introduced **AltFeeTx** (type `0x7F`) — Morph's first custom transaction type, enabling gas payment with ERC-20 tokens at the protocol level. This solved the gas friction problem, but the transaction structure had no room for business-context fields.

The [Jade upgrade](https://blog.morph.network/jade-upgrade/) evolves AltFeeTx into **MorphTx** — a unified, versioned transaction type that retains full Alt Fee support and adds two new capabilities:

| What's New in Jade | Description |
|---|---|
| **Reference Key** | A 32-byte field for tagging transactions with merchant-defined identifiers, with built-in on-chain indexing |
| **Memo** | An optional up to 64-byte note attached to the transaction |
| **Versioned format** | V0 (Emerald-era Alt Fee) and V1 (Jade-era full feature set) coexist with backward-compatible encoding |
| **ETH-only MorphTx** | V1 allows `FeeTokenID = 0`, so you can use Reference/Memo without Alt Fee |

The type byte remains `0x7F` — existing AltFeeTx transactions are valid V0 MorphTx with no migration required.

### 1.3 When to Use MorphTx

| Scenario | Use MorphTx? | Version | Notes |
|----------|:---:|:---:|---|
| Pay gas with USDT/USDC | Yes | V0 or V1 | Set `feeTokenID` to the registered token ID |
| Tag a payment with an order ID | Yes | V1 | Set `reference` to `keccak256(orderId)` |
| Both: stablecoin gas + order tracking | Yes | V1 | Set `feeTokenID` + `reference` |
| Attach a human-readable memo | Yes | V1 | Set `memo` (up to 64 bytes) |
| Standard ETH transfer, no extras | No | — | Use a regular EIP-1559 transaction |

---

## 2. MorphTx Fields

MorphTx includes all standard EIP-1559 fields plus the following Morph-specific extensions:

### 2.1 Extension Fields

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `version` | `uint8` | Yes | `0` for V0, `1` for V1. Determines which fields are available |
| `feeTokenID` | `uint16` | V0: Yes (>0) / V1: Optional | On-chain registered ERC-20 token ID. `0` = pay with ETH |
| `feeLimit` | `big.Int` | When `feeTokenID > 0` | Maximum token amount authorized for gas payment |
| `reference` | `[32]byte` | V1 only, optional | 32-byte index key for transaction tagging and querying |
| `memo` | `[]byte` | V1 only, optional | Free-form note, max 64 bytes |

### 2.2 Version Rules at a Glance

| | V0 (Emerald) | V1 (Jade) |
|---|---|---|
| **Alt Fee** | Required (`feeTokenID` must be > 0) | Optional (`feeTokenID` can be 0) |
| **Reference** | Not available | Optional |
| **Memo** | Not available | Optional (≤ 64 bytes) |
| **FeeLimit when feeTokenID = 0** | N/A (feeTokenID must be > 0) | Must be nil or 0 |

### 2.3 Gas Pricing

MorphTx uses the same EIP-1559 fee model as standard Ethereum transactions:

- `maxFeePerGas` — maximum total fee per gas unit
- `maxPriorityFeePerGas` — tip to the sequencer

:::warning
Do **not** set `gasPrice` on a MorphTx. If `gasPrice` is present, the RPC layer will silently downgrade the transaction to a legacy type, discarding all Morph fields.
:::

---

## 3. Alt Fee: Pay Gas with ERC-20 Tokens

### 3.1 How It Works

1. You set `feeTokenID` to the on-chain registered ID of a supported token (e.g., USDT).
2. You set `feeLimit` to the maximum token amount you authorize for gas payment.
3. The protocol calculates the gas cost in ETH (standard EIP-1559), then converts it to the token using an on-chain oracle rate:

```
tokenAmount = ⌈(ethAmount × tokenScale) / tokenRate⌉
```

4. The token amount is deducted from your balance. Unused gas is refunded in the same token.

Token rates are stored in the **Token Registry** system contract at `0x5300000000000000000000000000000000000021`.

### 3.2 Constraints

- The token must be registered and in **active** state on-chain
- `feeLimit` acts as a safety cap — the transaction reverts if the actual cost exceeds it
- In V0, `feeTokenID` must be > 0 (Alt Fee is mandatory)
- In V1, `feeTokenID` can be 0 (ETH), but then `feeLimit` must be nil or 0

### 3.3 Receipt Fee Fields

After execution, the receipt includes:

| Field | Description |
|-------|-------------|
| `feeRate` | ETH/token exchange rate used at execution time |
| `tokenScale` | Exchange rate precision scale |
| `l1Fee` | L1 data fee (also converted if using Alt Fee) |

---

## 4. Reference Key: Transaction Tagging & Querying

### 4.1 What Is a Reference?

A Reference is a **32-byte value** you embed in a V1 MorphTx to tag it with a business identifier. Multiple transactions can share the same Reference, and you can query all of them via a dedicated RPC method.

### 4.2 Generating a Reference

A Reference can be any 32-byte value. Common patterns:

```
// Hash an order ID
reference = keccak256("order-2026-03-30-00142")

// Use a UUID (zero-padded to 32 bytes)
reference = bytes32(uuid)

// Composite key
reference = keccak256(abi.encodePacked(merchantId, sessionId))
```

No on-chain registration is needed — just pick a deterministic scheme and start using it.

### 4.3 Querying by Reference

Use the `morph_getTransactionHashesByReference` RPC to retrieve all transactions tagged with a given Reference:

**Request:**
```json
{
    "jsonrpc": "2.0",
    "method": "morph_getTransactionHashesByReference",
    "params": [{
        "reference": "0x1234...cdef",
        "offset": "0x0",
        "limit": "0x64"
    }],
    "id": 1
}
```

**Response** (sorted by block timestamp + tx index, ascending):
```json
{
    "result": [
        {
            "transactionHash": "0xabc...",
            "blockNumber": "0x123",
            "blockTimestamp": "0x66012345",
            "transactionIndex": "0x0"
        },
        {
            "transactionHash": "0xdef...",
            "blockNumber": "0x125",
            "blockTimestamp": "0x66012400",
            "transactionIndex": "0x2"
        }
    ]
}
```

**Pagination constraints:**
- `limit`: max 100 per request
- `offset`: max 10000

### 4.4 Use Cases

| Scenario | Reference Value | How It Helps |
|----------|----------------|--------------|
| **Payment reconciliation** | `keccak256(orderId)` | Query all txs for a given order — payments, refunds, adjustments |
| **Batch settlement** | `keccak256(batchId)` | Track all transactions in a settlement batch |
| **Session tracking** | `keccak256(sessionId)` | Link multiple on-chain actions within a user session |
| **Cross-system audit** | `keccak256(externalSystemId)` | Bridge on-chain and off-chain records by a shared key |

---

## 5. SDK Development Guide (Go)

### 5.1 Sending a V1 MorphTx with Alt Fee + Reference

```go
import (
    "math/big"
    "github.com/morphismorg/morph-go-ethereum/common"
    "github.com/morphismorg/morph-go-ethereum/core/types"
    "github.com/morphismorg/morph-go-ethereum/crypto"
)

// Construct unsigned transaction
ref := common.HexToReference("0xabcdef...")
memo := []byte("payment for order #123")

tx := types.NewTx(&types.MorphTx{
    ChainID:    big.NewInt(2818),
    Nonce:      1,
    GasTipCap:  big.NewInt(1e9),
    GasFeeCap:  big.NewInt(2e9),
    Gas:        21000,
    To:         &toAddr,
    Value:      big.NewInt(1e18),
    FeeTokenID: 1,                      // USDT token ID
    FeeLimit:   big.NewInt(5e17),        // max 0.5 USDT
    Version:    types.MorphTxVersion1,
    Reference:  &ref,
    Memo:       &memo,
})

// Sign and send
signer := types.NewEmeraldSigner(big.NewInt(2818))
signedTx, _ := types.SignTx(tx, signer, privateKey)
err := client.SendTransaction(ctx, signedTx)
```

### 5.2 Sending a V1 MorphTx with ETH Gas + Reference Only

```go
// No Alt Fee — just Reference and Memo
ref := common.HexToReference("0x1234...")
tx := types.NewTx(&types.MorphTx{
    ChainID:    big.NewInt(2818),
    Nonce:      1,
    GasTipCap:  big.NewInt(1e9),
    GasFeeCap:  big.NewInt(2e9),
    Gas:        21000,
    To:         &toAddr,
    Value:      big.NewInt(1e18),
    FeeTokenID: 0,                      // ETH
    Version:    types.MorphTxVersion1,
    Reference:  &ref,
})

signer := types.NewEmeraldSigner(big.NewInt(2818))
signedTx, _ := types.SignTx(tx, signer, privateKey)
```

### 5.3 Querying Transactions by Reference

```go
client, _ := ethclient.Dial("http://localhost:8545")

results, err := client.GetTransactionHashesByReference(ctx,
    common.HexToReference("0x1234..."),
    nil, // offset (default 0)
    nil, // limit (default 100)
)

for _, r := range results {
    fmt.Printf("tx: %s  block: %d\n", r.TransactionHash.Hex(), r.BlockNumber)
}
```

### 5.4 Using Contract Bindings (`accounts/abi/bind`)

```go
auth, _ := bind.NewKeyedTransactorWithChainID(key, chainID)
auth.FeeTokenID = 1
auth.FeeLimit = big.NewInt(1000000)

// V1 with Reference
v1 := types.MorphTxVersion1
auth.Version = &v1
ref := common.HexToReference("0x1234...")
auth.Reference = &ref
memo := []byte("payment for order #123")
auth.Memo = &memo

// Any contract call will now use MorphTx V1
tx, err := contract.Transfer(auth, recipient, amount)
```

When `FeeTokenID != 0`, `Version != nil`, or `Reference`/`Memo` is set, the binding layer automatically constructs a MorphTx instead of a standard DynamicFeeTx.

### 5.5 Using `CallMsg` for Estimation

```go
msg := ethereum.CallMsg{
    From:       fromAddr,
    To:         &toAddr,
    Gas:        0,
    GasFeeCap:  big.NewInt(2e9),
    GasTipCap:  big.NewInt(1e9),
    Value:      big.NewInt(0),
    Data:       calldata,
    FeeTokenID: 1,
    FeeLimit:   big.NewInt(5e17),
    Version:    types.MorphTxVersion1,
}

gasEstimate, err := client.EstimateGas(ctx, msg)
```

When `FeeTokenID` is set, `eth_estimateGas` checks the user's **token balance** (not ETH) and converts the L1 Data Fee to token units.

---

## 6. Other Language SDK Guide

### 6.1 Transaction Type

- EIP-2718 type byte: **`0x7F`** (127)

### 6.2 JSON-RPC Field Mapping

| Go Field | JSON Field | Type | Notes |
|----------|-----------|------|-------|
| `GasTipCap` | `maxPriorityFeePerGas` | hex big int | |
| `GasFeeCap` | `maxFeePerGas` | hex big int | |
| `FeeTokenID` | `feeTokenID` | hex uint16 | |
| `FeeLimit` | `feeLimit` | hex big int | |
| `Version` | `version` | hex uint | V1+ only (`omitempty`) |
| `Reference` | `reference` | hex bytes32 | V1+ only (`omitempty`) |
| `Memo` | `memo` | hex bytes | V1+ only (`omitempty`) |

### 6.3 Sending via `eth_sendTransaction`

```json
{
    "from": "0x...",
    "to": "0x...",
    "maxFeePerGas": "0x...",
    "maxPriorityFeePerGas": "0x...",
    "gas": "0x...",
    "value": "0x...",
    "data": "0x...",
    "feeTokenID": "0x1",
    "feeLimit": "0x...",
    "version": "0x1",
    "reference": "0x1234...cdef",
    "memo": "0x68656c6c6f"
}
```

**Auto-detection**: Setting any of `feeTokenID > 0`, `version`, non-zero `reference`, or non-empty `memo` triggers MorphTx construction.

**Version inference**: If `version` is not set, the node infers V1 when `reference` or `memo` is present, V0 otherwise.

### 6.4 Reading MorphTx Fields from Responses

`eth_getTransactionByHash` returns:

```json
{
    "type": "0x7f",
    "chainId": "0xb02",
    "feeTokenID": "0x1",
    "feeLimit": "0x...",
    "version": "0x1",
    "reference": "0x1234...cdef",
    "memo": "0x68656c6c6f",
    ...
}
```

> V0 transactions omit `version`, `reference`, and `memo`. If `version` is absent, assume V0.

---

## 7. RPC Reference

### 7.1 Standard `eth` Namespace

| Method | MorphTx Behavior |
|--------|-----------------|
| `eth_sendTransaction` | Accepts Morph fields; auto-detects type and version |
| `eth_sendRawTransaction` | Accepts RLP-encoded `0x7F \|\| payload`; auto-decodes V0/V1 |
| `eth_getTransactionByHash` | Returns Morph extension fields in response |
| `eth_getTransactionReceipt` | Includes `feeTokenID`, `feeRate`, `tokenScale`, `l1Fee`, etc. |
| `eth_estimateGas` | Considers Alt Fee token balance and L1 fee conversion |
| `eth_call` | Supports Morph fields in `CallMsg` |

### 7.2 `morph` Namespace

| Method | Description |
|--------|-------------|
| `morph_getTransactionHashesByReference` | Query transactions by Reference key (paginated) |
| `morph_estimateL1DataFee` | Estimate L1 data fee (Morph fields affect serialized size) |

### 7.3 Receipt Extension Fields

| Field | Type | Condition | Description |
|-------|------|-----------|-------------|
| `feeTokenID` | `uint16` | All MorphTx | Token ID used |
| `feeLimit` | `big.Int` | All MorphTx | Token fee cap |
| `feeRate` | `big.Int` | All MorphTx | ETH/token rate at execution |
| `tokenScale` | `big.Int` | All MorphTx | Rate precision scale |
| `l1Fee` | `big.Int` | All MorphTx | L1 data fee |
| `version` | `uint8` | V1+ only | Transaction version |
| `reference` | `bytes32` | V1+ only | Reference key |
| `memo` | `bytes` | V1+ only | Memo |

---

## 8. Common Pitfalls

### 8.1 `gasPrice` Silently Overrides MorphTx

If you set both `gasPrice` AND MorphTx fields (e.g., `feeTokenID`), the RPC layer treats the transaction as a `LegacyTx` and discards all Morph fields **without error**.

**Fix**: Always use `maxFeePerGas` / `maxPriorityFeePerGas`.

### 8.2 V0 vs V1 `FeeTokenID` Semantics

| | V0 | V1 |
|---|---|---|
| `FeeTokenID == 0` | Invalid | Valid (use ETH) |
| Purpose | Alt Fee only | General-purpose |

If migrating from V0 to V1, `FeeTokenID` is no longer required.

### 8.3 Missing `version` in V0 Responses

V0 transactions omit `version`, `reference`, and `memo` from RPC responses (`omitempty`). Your SDK must handle missing fields:
- `version` absent → V0
- `reference` absent → nil
- `memo` absent → nil

### 8.4 V1 Transactions Before Jade Fork

V1 transactions are rejected everywhere before Jade fork activation — `eth_sendTransaction`, `eth_sendRawTransaction`, tx pool, and block validation will all refuse them.

### 8.5 V1 Signing Hash Includes Nil Fields

In the V1 signing hash, `reference` and `memo` participate in RLP encoding **even when nil** (nil encodes as `0x80`). Other language SDKs must handle this correctly — omitting nil fields from the signing hash will produce an invalid signature.

---

## 9. Fork Timeline & Compatibility

MorphTx requires two network forks to fully enable:

```
Timeline ──────────────────────────────────────────────────────────►

    │               │                │
    │   Emerald     │    Jade        │
    │   Fork        │    Fork        │
    ▼               ▼                │
────┼───────────────┼────────────────┼──
    │               │                │
    │  MorphTxType  │  MorphTx V1    │
    │  signer       │  enabled       │
    │  enabled      │  (V0 + V1)     │
    │  (V0 only)    │                │
    │               │                │
```

### 9.1 Emerald Fork

- `MorphTxType` (`0x7F`) registered in the signer
- Only V0 available (V1 rejected by tx pool and block validator)
- EIP-1559 must already be active

### 9.2 Jade Fork

- V1 transactions accepted by tx pool and block validation
- Reference index system activated
- On reorg past Jade boundary, tx pool removes all V1 transactions

### 9.3 Fork Configuration (Mainnet)

```json
{
    "emeraldTime": 1766988000,
    "jadeForkTime": 1774418400
}
```

---

## 10. Internal: Data Structures

### 10.1 Core Struct

**Source**: `core/types/morph_tx.go`

```go
type MorphTx struct {
    // ===== Same base fields as DynamicFeeTx =====
    ChainID    *big.Int
    Nonce      uint64
    GasTipCap  *big.Int          // maxPriorityFeePerGas
    GasFeeCap  *big.Int          // maxFeePerGas
    Gas        uint64
    To         *common.Address   // nil = contract creation
    Value      *big.Int
    Data       []byte
    AccessList AccessList

    // ===== Morph extension fields =====
    Version    uint8              // 0=V0, 1=V1
    FeeTokenID uint16             // ERC-20 token ID (0=ETH)
    FeeLimit   *big.Int           // Token fee cap
    Reference  *common.Reference  // 32-byte reference key (V1 only)
    Memo       *[]byte            // Note (V1 only, ≤ 64 bytes)

    // ===== Signature values =====
    V *big.Int
    R *big.Int
    S *big.Int
}
```

### 10.2 Dependent Types

| Type | Defined in | Description |
|------|-----------|-------------|
| `common.Reference` | `common/types.go` | `[32]byte`, supports Hex/JSON/GraphQL serialization |
| `common.ReferenceLength` | `common/types.go` | Constant `32` |
| `common.MaxMemoLength` | `common/types.go` | Constant `64` |

### 10.3 Version Validation

**Source**: `core/types/transaction.go` → `ValidateMorphTxVersion()`

| Version | FeeTokenID | FeeLimit | Reference | Memo | Valid? |
|---------|-----------|----------|-----------|------|--------|
| V0 | Must be > 0 | Optional | Must be nil | Must be nil | ✅ |
| V0 | = 0 | - | - | - | ❌ `ErrMorphTxV0IllegalExtraParams` |
| V0 | > 0 | - | Non-empty | - | ❌ `ErrMorphTxV0IllegalExtraParams` |
| V1 | Any | Any | Any | ≤ 64B | ✅ |
| V1 | = 0 | > 0 | - | - | ❌ `ErrMorphTxV1IllegalExtraParams` |
| V1 | - | - | - | > 64B | ❌ `ErrMemoTooLong` |

### 10.4 Error Types

| Error | Meaning |
|-------|---------|
| `ErrMorphTxV0IllegalExtraParams` | V0: FeeTokenID=0 or Reference/Memo set |
| `ErrMorphTxV1IllegalExtraParams` | V1: FeeTokenID=0 but FeeLimit>0 |
| `ErrMorphTxUnsupportedVersion` | Unsupported version number |
| `ErrMorphTxV1NotYetActive` | V1 submitted before Jade fork |
| `ErrMemoTooLong` | Memo exceeds 64 bytes |

---

## 11. Internal: Encoding/Decoding (Wire Format)

### 11.1 Wire Format Overview

MorphTx follows the EIP-2718 envelope: `type byte + inner payload`

```
┌─────────────────────────────────────────────────────────┐
│  Full wire format (MarshalBinary output)                │
├──────┬──────────────────────────────────────────────────┤
│ 0x7F │ inner payload (generated by encode())            │
│txType│                                                  │
├──────┴──────────────────────────────────────────────────┤
│                                                         │
│  V0 inner payload:                                      │
│  ┌─────────────────────────────────────────────┐        │
│  │ RLP([chainID, nonce, gasTipCap, gasFeeCap,  │        │
│  │      gas, to, value, data, accessList,      │        │
│  │      feeTokenID, feeLimit, v, r, s])        │        │
│  │  First byte >= 0xC0 (RLP list prefix)       │        │
│  │  14 fields total                            │        │
│  └─────────────────────────────────────────────┘        │
│                                                         │
│  V1 inner payload:                                      │
│  ┌────┬────────────────────────────────────────┐        │
│  │0x01│ RLP([chainID, nonce, gasTipCap,        │        │
│  │ver │      gasFeeCap, gas, to, value, data,  │        │
│  │    │      accessList, feeTokenID, feeLimit, │        │
│  │    │      reference, memo, v, r, s])        │        │
│  │    │  16 fields total                       │        │
│  └────┴────────────────────────────────────────┘        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 11.2 V0 Encoding

```
Format: 0x7F || RLP([14 fields])

Field order:
 0. chainID      1. nonce        2. gasTipCap    3. gasFeeCap
 4. gas          5. to           6. value        7. data
 8. accessList   9. feeTokenID  10. feeLimit    11. v
12. r           13. s
```

Constraint: `feeTokenID` must be non-zero.

### 11.3 V1 Encoding

```
Format: 0x7F || 0x01 || RLP([16 fields])

Field order:
 0. chainID      1. nonce        2. gasTipCap    3. gasFeeCap
 4. gas          5. to           6. value        7. data
 8. accessList   9. feeTokenID  10. feeLimit    11. reference
12. memo        13. v           14. r           15. s
```

Key details:
- The version byte (`0x01`) is a prefix, NOT inside the RLP list
- `reference` and `memo` use `[]byte` in RLP; empty = `0x80`

### 11.4 Version Detection

```
firstByte = inner_payload[0]

if firstByte >= 0xC0 or firstByte == 0x00:
    → V0 (first byte is RLP list prefix)

elif firstByte == 0x01:
    → V1 (first byte is version)

else:
    → Unsupported version
```

V0's RLP list prefix (>= `0xC0`) and V1's version byte (`0x01`) naturally don't overlap — no extra metadata needed.

### 11.5 Encoding & Decoding Paths

```
Encoding:
  Transaction.MarshalBinary() → encodeTyped(buf)
    ├→ buf.WriteByte(0x7F)
    └→ MorphTx.encode(buf)

  rlp.Encode(w, morphTx) → MorphTx.EncodeRLP(w)
    └→ MorphTx.encode(buf)          // same function, identical output

Decoding:
  Transaction.UnmarshalBinary(bytes) → decodeTyped(bytes)
    ├→ bytes[0] == 0x7F
    └→ MorphTx.decode(bytes[1:])     // version detection + decode

  rlp.Decode(r, &morphTx) → MorphTx.DecodeRLP(stream)
    ├→ stream.Kind() == List → V0
    └→ stream.Uint8() + stream.Raw() → V1
```

### 11.6 Transaction Hash

```
V0: keccak256(0x7F || RLP([14 fields including V,R,S]))
V1: keccak256(0x7F || 0x01 || RLP([16 fields including V,R,S]))
```

---

## 12. Internal: Signing Mechanism

### 12.1 Signer Requirements

```go
// Recommended
signer := types.NewEmeraldSigner(chainID)

// Auto-selected (Emerald must be active)
signer := types.MakeSigner(config, blockNumber, blockTime)

// Latest signer for chain
signer := types.LatestSignerForChainID(chainID)
```

### 12.2 Signing Hash

The signing hash excludes V/R/S signature values.

**V0 (11 fields):**
```
sigHash = keccak256(0x7F || rlp([
    chainID, nonce, gasTipCap, gasFeeCap, gas, to, value, data,
    accessList, feeTokenID, feeLimit
]))
```

**V1 (14 fields):**
```
sigHash = keccak256(0x7F || rlp([
    chainID, nonce, gasTipCap, gasFeeCap, gas, to, value, data,
    accessList, feeTokenID, feeLimit, version, reference, memo
]))
```

V1 adds `version`, `reference`, and `memo`. Nil pointers encode as RLP empty string (`0x80`).

### 12.3 Signing Flow

```
types.SignTx(tx, signer, privateKey)
  ├→ h = signer.Hash(tx)
  │    └→ MorphTx.sigHash(chainID)
  │         └→ v0SigHash or v1SigHash
  ├→ sig = crypto.Sign(h[:], privateKey)     // 65 bytes
  └→ tx.WithSignature(signer, sig)
       ├→ R = sig[0:32]
       ├→ S = sig[32:64]
       └→ V = sig[64] (0 or 1)
```

### 12.4 V/R/S Specification

- **V**: 0 or 1 (recovery identifier; add 27 for `ecrecover`)
- **Encoding**: `R (32B) || S (32B) || V (1B)` — standard 65 bytes

### 12.5 Other Language Signing

```python
# V0 signing hash
sig_hash = keccak256(
    [0x7F] + rlp_encode([
        chain_id, nonce, max_priority_fee, max_fee, gas_limit,
        to, value, data, access_list, fee_token_id, fee_limit
    ])
)

# V1 signing hash
sig_hash = keccak256(
    [0x7F] + rlp_encode([
        chain_id, nonce, max_priority_fee, max_fee, gas_limit,
        to, value, data, access_list, fee_token_id, fee_limit,
        version, reference, memo
    ])
)
```

- V value: 0 or 1 (NOT 27/28)
- Nil `reference`/`memo` must encode as `0x80` in the signing hash

---

## 13. Internal: Reference Index Storage

### 13.1 Storage Mechanism

**Source**: `core/rawdb/accessors_reference_index.go`

| Property | Value |
|----------|-------|
| Write timing | Block insertion (`core/blockchain.go` → `maintainReferenceIndex`) |
| Index key | `prefix + reference(32B) + blockTimestamp(8B) + txIndex(8B) + txHash(32B)` |
| Value | Empty (leverages key ordering for range queries) |
| Sort order | Ascending by `blockTimestamp` + `txIndex` |
| Reorg handling | Written on insertion, deleted on rollback |

### 13.2 Design Rationale

- **Prefix-ordered keys** enable efficient range scans without secondary indexes
- **Empty values** minimize storage overhead — only the key matters
- **Asynchronous maintenance** during block insertion avoids adding latency to the execution path

---

## Appendix: Source File Index

| File | Responsibility |
|------|---------------|
| `core/types/morph_tx.go` | MorphTx struct, encoding/decoding, signing hash |
| `core/types/transaction.go` | TxData interface, type constant (`0x7F`), version validation |
| `core/types/transaction_signing.go` | Signer interface, modernSigner, NewEmeraldSigner |
| `core/types/transaction_marshalling.go` | JSON serialization/deserialization |
| `core/types/receipt.go` | Receipt struct and Morph extension fields |
| `internal/ethapi/transaction_args.go` | RPC param handling, version inference |
| `internal/ethapi/api.go` | RPCTransaction, SendTransaction, PublicMorphAPI |
| `core/tx_pool.go` | Tx pool validation, Jade fork check |
| `core/block_validator.go` | Block validation MorphTx checks |
| `core/state_processor.go` | Post-execution receipt population |
| `core/state_transition.go` | Alt Fee deduction and refund logic |
| `core/blockchain.go` | Reference index maintenance |
| `core/rawdb/accessors_reference_index.go` | Reference index read/write |
| `accounts/abi/bind/base.go` | Contract binding TransactOpts |
| `ethclient/ethclient.go` | Go client wrapper |
| `params/config.go` | EmeraldTime, JadeForkTime |
| `common/types.go` | Reference type, MaxMemoLength |
