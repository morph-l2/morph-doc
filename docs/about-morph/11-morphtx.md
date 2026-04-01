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

## 1. New Transaction Type

MorphTx is a custom [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718) typed transaction for Morph L2, with type ID `0x7F` (127). It extends the standard DynamicFeeTx (EIP-1559) with the following capabilities:

| Feature | Description |
|---------|-------------|
| **Alt Fee** (Alternative Token Gas Fee) | Pay gas fees with on-chain registered ERC-20 tokens instead of ETH |
| **Reference** | 32-byte transaction reference key for on-chain indexing and querying |
| **Memo** | Up to 64-byte transaction note |

### 1.1 Version System

MorphTx uses a multi-version encoding format for backward compatibility:

| Version | Constant | Status | Description |
|---------|----------|--------|-------------|
| **V0** | `MorphTxVersion0 = 0` | Available after Emerald fork | Legacy format, compatible with original AltFeeTx. Supports Alt Fee only — no Version/Reference/Memo fields. `FeeTokenID` must be > 0 |
| **V1** | `MorphTxVersion1 = 1` | Available after Jade fork | New format. Supports Alt Fee + Reference + Memo. All Morph extension fields are optional. `FeeTokenID` can be 0 (pay with ETH) |

### 1.2 Key Characteristics

- **Gas pricing model**: Fully compatible with EIP-1559 — uses `maxFeePerGas` + `maxPriorityFeePerGas`
- **Signing algorithm**: Standard secp256k1 ECDSA, V value is `{0, 1}` (same as DynamicFeeTx)
- **Chain ID binding**: ChainID is included in the signing hash to prevent cross-chain replay

---

## 2. Data Structures

### 2.1 Core Struct — `MorphTx`

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
    Version    uint8              // Version (0=V0, 1=V1)
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

### 2.2 Dependent Types

| Type | Defined in | Description |
|------|-----------|-------------|
| `common.Reference` | `common/types.go` | `[32]byte` fixed-length array, supports Hex/JSON/GraphQL serialization |
| `common.ReferenceLength` | `common/types.go` | Constant `32` |
| `common.MaxMemoLength` | `common/types.go` | Constant `64` |
| `AccessList` | `core/types/access_list_tx.go` | `[]AccessTuple`, EIP-2930 access list |

### 2.3 Version Validation Rules

**Source**: `core/types/transaction.go` → `ValidateMorphTxVersion()`

| Version | FeeTokenID | FeeLimit | Reference | Memo | Valid? |
|---------|-----------|----------|-----------|------|--------|
| V0 | Must be > 0 | Optional | Must be nil/empty | Must be nil/empty | ✅ |
| V0 | = 0 | - | - | - | ❌ `ErrMorphTxV0IllegalExtraParams` |
| V0 | > 0 | - | Non-empty | - | ❌ `ErrMorphTxV0IllegalExtraParams` |
| V1 | Any | Any | Any | ≤ 64B | ✅ |
| V1 | = 0 | > 0 | - | - | ❌ `ErrMorphTxV1IllegalExtraParams` |
| V1 | - | - | - | > 64B | ❌ `ErrMemoTooLong` |
| Other | - | - | - | - | ❌ `ErrMorphTxUnsupportedVersion` |

**Core constraints:**

- **V0** is designed specifically for Alt Fee — `FeeTokenID` must be non-zero
- **V1** is general-purpose — all extension fields are optional. But if `FeeTokenID == 0` (using ETH), `FeeLimit` must be zero/nil (no need to cap ETH fees)
- **Memo** max 64 bytes applies to all versions

### 2.4 Error Types

| Error | Meaning |
|-------|---------|
| `ErrMorphTxV0IllegalExtraParams` | V0 params invalid (FeeTokenID=0, or Reference/Memo set) |
| `ErrMorphTxV1IllegalExtraParams` | V1 params invalid (FeeTokenID=0 but FeeLimit>0) |
| `ErrMorphTxUnsupportedVersion` | Unsupported version number |
| `ErrMorphTxV1NotYetActive` | V1 tx submitted before Jade fork activation |
| `ErrMemoTooLong` | Memo exceeds 64 bytes |

---

## 3. Fork Timeline & Compatibility

MorphTx requires two forks to fully enable:

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

### 3.1 Emerald Fork

**Source**: `core/types/transaction_signing.go` → `newModernSigner()`
**Config**: `params/config.go` → `EmeraldTime`

After Emerald fork activation:
- `MorphTxType` (0x7F) is registered in `modernSigner`'s supported type list
- `MakeSigner()` returns a signer that accepts MorphTx
- Only V0 is available (V1 is rejected by tx pool and block validator)

Before Emerald fork:
- MorphTx is rejected at the tx pool level (`ErrTxTypeNotSupported`)
- EIP-1559 must already be active (MorphTx depends on the `eip1559` flag)

### 3.2 Jade Fork

**Source**: `core/tx_pool.go`, `core/block_validator.go`
**Config**: `params/config.go` → `JadeForkTime`

After Jade fork activation:
- V1 transactions are accepted by the tx pool
- Block validation allows V1 transactions
- Reference index system becomes active

Before Jade fork:
- Tx pool rejects V1: `!pool.jade && tx.IsMorphTx() && tx.Version() == MorphTxVersion1`
- Block validation rejects V1: `!isJadeFork && tx.IsMorphTx() && tx.Version() == MorphTxVersion1`
- RPC `setDefaults` rejects V1 fields (Reference/Memo) and explicit V1 version

On Jade fork rollback (reorg):
- Tx pool actively removes all V1 transactions (`removeMorphTxV1()`)

### 3.3 Fork Configuration Example (Mainnet)

```json
{
    "emeraldTime": 1766988000,
    "jadeForkTime": 1774418400
}
```

---

## 4. Encoding/Decoding (Wire Format)

### 4.1 Full Wire Format

MorphTx follows the EIP-2718 envelope format: `type byte + inner payload`

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

### 4.2 V0 Encoding

```
Format: 0x7F || RLP([14 fields])

Field order (inside RLP list):
 0. chainID    (*big.Int)
 1. nonce      (uint64)
 2. gasTipCap  (*big.Int)
 3. gasFeeCap  (*big.Int)
 4. gas        (uint64)
 5. to         (*common.Address, nil=contract creation)
 6. value      (*big.Int)
 7. data       ([]byte)
 8. accessList (AccessList)
 9. feeTokenID (uint16)
10. feeLimit   (*big.Int)
11. v          (*big.Int)
12. r          (*big.Int)
13. s          (*big.Int)
```

**Constraint**: `feeTokenID` must be non-zero.

### 4.3 V1 Encoding

```
Format: 0x7F || 0x01 || RLP([16 fields])

Field order (inside RLP list):
 0. chainID    (*big.Int)
 1. nonce      (uint64)
 2. gasTipCap  (*big.Int)
 3. gasFeeCap  (*big.Int)
 4. gas        (uint64)
 5. to         (*common.Address, nil=contract creation)
 6. value      (*big.Int)
 7. data       ([]byte)
 8. accessList (AccessList)
 9. feeTokenID (uint16)
10. feeLimit   (*big.Int)
11. reference  ([]byte, length 0 or 32)
12. memo       ([]byte, length 0~64)
13. v          (*big.Int)
14. r          (*big.Int)
15. s          (*big.Int)
```

**Key details:**

- The **version byte** (0x01) is NOT inside the RLP list — it's a prefix byte
- `reference` and `memo` use `[]byte` type in RLP (not `[32]byte`); empty values encode as RLP empty string (`0x80`)
- V1 adds `reference` and `memo` compared to V0's 14 fields (16 total)

### 4.4 Version Detection Algorithm

When decoding inner payload, the first byte determines the version:

```
firstByte = inner_payload[0]

if firstByte >= 0xC0 or firstByte == 0x00:
    → V0 format (first byte is RLP list prefix)
    → Decode entire payload as RLP list

elif firstByte == 0x01:
    → V1 format (first byte is version)
    → Skip 1 byte, decode remainder as RLP list

else:
    → Unsupported version
```

**Design rationale**: V0's RLP list first byte is always >= 0xC0 (RLP list encoding prefix), while V1's first byte is 0x01. They naturally don't overlap in byte space — no extra metadata needed to distinguish them.

### 4.5 Encoding Paths

Two encoding paths exist, both producing identical byte output:

```
Path 1: Transaction.MarshalBinary()
  └→ Transaction.encodeTyped(buf)
       ├→ buf.WriteByte(0x7F)         // txType prefix
       └→ MorphTx.encode(buf)         // internal encoding (V0 or V1)

Path 2: rlp.Encode(w, morphTx)
  └→ MorphTx.EncodeRLP(w)            // custom rlp.Encoder
       └→ MorphTx.encode(buf)         // same function as Path 1
```

`EncodeRLP` ensures that `Transaction.Hash()` (which internally calls `rlp.Encode`) produces output consistent with `MarshalBinary`.

### 4.6 Decoding Paths

```
Path 1: Transaction.UnmarshalBinary(bytes)
  └→ Transaction.decodeTyped(bytes)
       ├→ Check bytes[0] == 0x7F
       ├→ inner = new(MorphTx)
       └→ inner.decode(bytes[1:])       // version detection + decode

Path 2: rlp.Decode(reader, &morphTx)
  └→ MorphTx.DecodeRLP(stream)         // custom rlp.Decoder
       ├→ stream.Kind() == List → V0
       └→ stream.Uint8() + stream.Raw() → V1
```

**Why `DecodeRLP` is necessary**: Go struct field order (`[...AccessList, Version, FeeTokenID, ...]`) doesn't match V0 wire format (`[...AccessList, FeeTokenID, ...]`). Reflection-based decoding would cause type overflow errors.

### 4.7 Transaction Hash

```
V0: keccak256(0x7F || rlp.Encode(morphTx))
    = keccak256(0x7F || RLP([14 fields including signature]))

V1: keccak256(0x7F || rlp.Encode(morphTx))
    = keccak256(0x7F || 0x01 || RLP([16 fields including signature]))
```

> Note: `rlp.Encode(morphTx)` calls the custom `EncodeRLP`, so V1 output includes the 0x01 prefix.

---

## 5. Signing Mechanism

### 5.1 Signer Requirements

MorphTx must be signed with an Emerald or higher-level signer:

```go
// Recommended
signer := types.NewEmeraldSigner(chainID)

// Or auto-selected by protocol (Emerald must be active)
signer := types.MakeSigner(config, blockNumber, blockTime)

// LatestSignerForChainID returns NewEmeraldSigner
signer := types.LatestSignerForChainID(chainID)
```

### 5.2 Signing Hash Calculation

The signing hash is the digest used for signing/verification — it does NOT include V/R/S signature values.

**V0 signing hash (11 fields):**

```
sigHash = keccak256(0x7F || rlp([
    chainID, nonce, gasTipCap, gasFeeCap, gas, to, value, data,
    accessList, feeTokenID, feeLimit
]))
```

**V1 signing hash (14 fields):**

```
sigHash = keccak256(0x7F || rlp([
    chainID, nonce, gasTipCap, gasFeeCap, gas, to, value, data,
    accessList, feeTokenID, feeLimit, version, reference, memo
]))
```

V1 adds `version`, `reference`, and `memo` compared to V0.

### 5.3 Signing Flow

```go
// 1. Construct unsigned transaction
tx := types.NewTx(&types.MorphTx{
    ChainID:    chainID,
    Nonce:      nonce,
    GasTipCap:  gasTipCap,
    GasFeeCap:  gasFeeCap,
    Gas:        gasLimit,
    To:         &toAddr,
    Value:      value,
    Data:       data,
    FeeTokenID: 1,
    FeeLimit:   feeLimit,
    Version:    types.MorphTxVersion0,
})

// 2. Sign
signer := types.NewEmeraldSigner(chainID)
signedTx, err := types.SignTx(tx, signer, privateKey)
```

**Internal flow:**

```
types.SignTx(tx, signer, privateKey)
  ├→ h = signer.Hash(tx)                    // modernSigner.Hash
  │    └→ tx.inner.sigHash(signer.chainID)   // MorphTx.sigHash
  │         └→ v0SigHash or v1SigHash        // prefixedRlpHash(0x7F, [...])
  ├→ sig = crypto.Sign(h[:], privateKey)     // 65-byte signature
  └→ tx.WithSignature(signer, sig)
       └→ signer.SignatureValues(tx, sig)
            ├→ R = sig[0:32]
            ├→ S = sig[32:64]
            └→ V = sig[64] (0 or 1)
```

### 5.4 V/R/S Specification

- **V value**: 0 or 1 (recovery identifier), same as DynamicFeeTx and other modern tx types
- **Sender recovery**: V + 27 to convert to Homestead format, then call `ecrecover`
- **Signature encoding**: Standard 65 bytes: `R (32 bytes) || S (32 bytes) || V (1 byte)`

---

## 6. RPC Interfaces

### 6.1 Standard `eth` Namespace

#### `eth_sendTransaction`

Constructs MorphTx via `TransactionArgs`. Supported Morph-specific fields:

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

**Type auto-detection**: The transaction is identified as MorphTx when ANY of these fields are set:
- `feeTokenID > 0`
- `version` is explicitly specified
- `reference` is non-empty and non-zero
- `memo` is non-empty

**Version auto-inference (`setDefaults`):**
1. If `version` is explicitly specified → use it and validate params
2. If V1-only fields exist (`reference`/`memo`) → auto-set to V1
3. Otherwise → default to V0

:::warning
If you set both `gasPrice` AND MorphTx fields (e.g., `feeTokenID`), `gasPrice` will override the type detection and produce a `LegacyTx` instead of `MorphTx`, silently discarding all Morph fields. Always use `maxFeePerGas`/`maxPriorityFeePerGas` with MorphTx.
:::

#### `eth_sendRawTransaction`

Accepts a signed transaction in RLP-encoded type envelope format:

```
0x7F || inner_payload
```

The node automatically decodes via `UnmarshalBinary` → `decodeTyped` → `MorphTx.decode`.

#### `eth_getTransactionByHash` / `eth_getTransactionByBlockHashAndIndex`

Returns `RPCTransaction` with MorphTx fields:

```json
{
    "type": "0x7f",
    "chainId": "0xb02",
    "nonce": "0x1",
    "maxFeePerGas": "0x...",
    "maxPriorityFeePerGas": "0x...",
    "gas": "0x...",
    "to": "0x...",
    "value": "0x...",
    "input": "0x...",
    "accessList": [],
    "feeTokenID": "0x1",
    "feeLimit": "0x...",
    "version": "0x1",
    "reference": "0x1234...cdef",
    "memo": "0x68656c6c6f",
    "v": "0x0",
    "r": "0x...",
    "s": "0x..."
}
```

> Note: `version`, `reference`, `memo` fields only appear for V1+ transactions (`omitempty`). V0 transactions only return `feeTokenID` and `feeLimit`.

#### `eth_getTransactionReceipt`

Morph extension fields in the receipt:

```json
{
    "feeTokenID": "0x1",
    "feeLimit": "0x...",
    "feeRate": "0x...",
    "tokenScale": "0x...",
    "version": "0x0",
    "reference": null,
    "memo": null,
    "l1Fee": "0x..."
}
```

#### `eth_estimateGas`

Gas estimation for MorphTx additionally considers:
- Alt Fee token balance and FeeLimit constraint
- L1 Data Fee conversion to token units
- Whether the token is in active state

#### `eth_call`

Supports passing Morph fields in `CallMsg` for simulated execution.

### 6.2 `morph` Namespace (Public)

#### `morph_getTransactionHashesByReference`

Query transactions associated with a Reference, with pagination support.

**Parameters:**

```json
{
    "reference": "0x1234...cdef",
    "offset": "0x0",
    "limit": "0x64"
}
```

**Constraints:**
- `limit`: max 100
- `offset`: max 10000 (prevents linear scan DoS)

**Returns**: sorted by `blockTimestamp` + `txIndex` ascending:

```json
[
    {
        "transactionHash": "0x...",
        "blockNumber": "0x123",
        "blockTimestamp": "0x...",
        "transactionIndex": "0x0"
    }
]
```

### 6.3 `morph` Namespace (Private/Internal)

#### `morph_estimateL1DataFee`

Estimates L1 data fee for a transaction. Input is `TransactionArgs` — Morph fields affect the serialized transaction size and thus the L1 fee.

---

## 7. Go SDK Development Guide

### 7.1 Using `ethclient`

```go
client, _ := ethclient.Dial("http://localhost:8545")

// Query transactions by Reference
results, err := client.GetTransactionHashesByReference(ctx,
    common.HexToReference("0x1234..."),
    nil, // offset, default 0
    nil, // limit, default 100
)
```

### 7.2 Using Contract Bindings (`accounts/abi/bind`)

**Source**: `accounts/abi/bind/base.go`

Morph fields in `TransactOpts`:

```go
type TransactOpts struct {
    // ... standard fields ...
    FeeTokenID uint16
    FeeLimit   *big.Int
    Version    *uint8             // nil = auto-detect
    Reference  *common.Reference
    Memo       *[]byte
}
```

**Usage example:**

```go
auth, _ := bind.NewKeyedTransactorWithChainID(key, chainID)
auth.FeeTokenID = 1
auth.FeeLimit = big.NewInt(1000000)

// V1 transaction (with Reference and Memo)
v1 := types.MorphTxVersion1
auth.Version = &v1
ref := common.HexToReference("0x1234...")
auth.Reference = &ref
memo := []byte("payment for order #123")
auth.Memo = &memo
```

**Auto-detect logic (`morphTxVersion`):**

```
if Version == nil:
    if Reference or Memo exists → V1
    else → V0
else:
    Use specified version and validate parameter compatibility
```

**Transaction type auto-selection**: When `FeeTokenID != 0` or `Version != nil` or Reference/Memo exists, `BoundContract.transact()` calls `createMorphTx()` instead of `createDynamicTx()`.

### 7.3 Direct Transaction Construction

```go
// V0 Example: Pay gas with token ID=1
tx := types.NewTx(&types.MorphTx{
    ChainID:    big.NewInt(2818),
    Nonce:      1,
    GasTipCap:  big.NewInt(1e9),
    GasFeeCap:  big.NewInt(2e9),
    Gas:        21000,
    To:         &toAddr,
    Value:      big.NewInt(1e18),
    FeeTokenID: 1,
    FeeLimit:   big.NewInt(5e17),
    Version:    types.MorphTxVersion0,
})

// V1 Example: Pay with ETH + attach Reference and Memo
ref := common.HexToReference("0xabcd...")
memo := []byte("hello morph")
tx := types.NewTx(&types.MorphTx{
    ChainID:    big.NewInt(2818),
    Nonce:      1,
    GasTipCap:  big.NewInt(1e9),
    GasFeeCap:  big.NewInt(2e9),
    Gas:        21000,
    To:         &toAddr,
    Value:      big.NewInt(1e18),
    FeeTokenID: 0,         // ETH
    Version:    types.MorphTxVersion1,
    Reference:  &ref,
    Memo:       &memo,
})

// Sign
signer := types.NewEmeraldSigner(big.NewInt(2818))
signedTx, _ := types.SignTx(tx, signer, privateKey)

// Serialize (for sending raw transaction)
rawBytes, _ := signedTx.MarshalBinary()
```

### 7.4 Using `CallMsg`

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
    Version:    types.MorphTxVersion0,
}
```

---

## 8. Other Language SDK Guide

### 8.1 Transaction Type Identifier

- EIP-2718 type byte: **`0x7F`** (127)
- This is a typed transaction following the standard envelope format

### 8.2 Encoding Implementation

#### V0 Encoding

```python
raw_bytes = [0x7F] + rlp_encode([
    chain_id,           # big integer
    nonce,              # uint64
    max_priority_fee,   # big integer (gasTipCap)
    max_fee,            # big integer (gasFeeCap)
    gas_limit,          # uint64
    to,                 # 20 bytes or empty (contract creation)
    value,              # big integer
    data,               # bytes
    access_list,        # [[address, [storage_keys]], ...]
    fee_token_id,       # uint16 (MUST be > 0)
    fee_limit,          # big integer
    v,                  # big integer (0 or 1)
    r,                  # big integer
    s,                  # big integer
])
```

#### V1 Encoding

```python
raw_bytes = [0x7F, 0x01] + rlp_encode([
    chain_id,
    nonce,
    max_priority_fee,
    max_fee,
    gas_limit,
    to,
    value,
    data,
    access_list,
    fee_token_id,       # uint16 (can be 0)
    fee_limit,          # big integer
    reference,          # bytes (0 or 32 bytes)
    memo,               # bytes (0~64 bytes)
    v,
    r,
    s,
])
```

### 8.3 Signing Implementation

#### V0 Signing Hash

```python
sig_hash = keccak256(
    [0x7F] + rlp_encode([
        chain_id, nonce, max_priority_fee, max_fee, gas_limit,
        to, value, data, access_list, fee_token_id, fee_limit
    ])
)
```

#### V1 Signing Hash

```python
sig_hash = keccak256(
    [0x7F] + rlp_encode([
        chain_id, nonce, max_priority_fee, max_fee, gas_limit,
        to, value, data, access_list, fee_token_id, fee_limit,
        version, reference, memo
    ])
)
```

**Key differences:**
- V0 signing hash does **not** include `version`/`reference`/`memo`
- V1 signing hash includes `version` (value=1), `reference` (pointer may be nil), `memo` (pointer may be nil)
- In Go, nil pointers encode as RLP empty string (`0x80`) — other language SDKs must handle this correctly

#### Signing & Recovery

- Use standard **secp256k1 ECDSA** to sign the `sig_hash`
- V value is the recovery identifier: **0 or 1** (NOT 27/28)
- To recover the sender address, add 27 to V and use `ecrecover`

### 8.4 Decoding Implementation

```python
# Pseudocode

def decode_morph_tx(raw_bytes):
    assert raw_bytes[0] == 0x7F  # type byte
    payload = raw_bytes[1:]

    first_byte = payload[0]
    if first_byte >= 0xC0 or first_byte == 0x00:
        # V0: direct RLP decode
        fields = rlp_decode(payload)  # 14 fields
        assert fields[9] > 0  # feeTokenID must be non-zero
        return MorphTxV0(fields)

    elif first_byte == 0x01:
        # V1: skip version byte
        fields = rlp_decode(payload[1:])  # 16 fields
        reference = fields[11]  # 0 or 32 bytes
        memo = fields[12]       # 0~64 bytes
        return MorphTxV1(fields)

    else:
        raise Error("unsupported version")
```

### 8.5 JSON-RPC Field Mapping

| Go Field | JSON Field | Type | Description |
|----------|-----------|------|-------------|
| `GasTipCap` | `maxPriorityFeePerGas` | hex big int | EIP-1559 priority fee |
| `GasFeeCap` | `maxFeePerGas` | hex big int | EIP-1559 fee cap |
| `FeeTokenID` | `feeTokenID` | hex uint16 | Token ID |
| `FeeLimit` | `feeLimit` | hex big int | Token fee cap |
| `Version` | `version` | hex uint64 | Version (V1+ only) |
| `Reference` | `reference` | hex bytes32 | Reference key (V1+ only) |
| `Memo` | `memo` | hex bytes | Memo (V1+ only) |

> **Note on type differences:**
> - `TransactionArgs` (sending): `version` is `hexutil.Uint16`
> - `RPCTransaction` (querying): `version` is `hexutil.Uint64`
> - `txJSON` (JSON serialization): `version` is `hexutil.Uint64`

---

## 9. Alt Fee Mechanism

### 9.1 Concept

Alt Fee allows users to pay transaction gas fees using on-chain registered ERC-20 tokens (e.g., USDT, USDC) instead of ETH. Unlike Paymaster-based models that require extra contract calls and external bundlers, Alt Fee is handled directly at the **protocol level**, reducing overhead and improving efficiency.

### 9.2 Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `FeeTokenID` | `uint16` | Token's on-chain registry ID (`0` = ETH, `> 0` = token) |
| `FeeLimit` | `*big.Int` | Maximum token amount the user is willing to pay |

### 9.3 Fee Conversion

The system follows EIP-1559 to calculate fees in ETH, then converts to the selected token using an on-chain oracle rate:

```
tokenAmount = ⌈(ethAmount × tokenScale) / tokenRate⌉
```

Ceiling rounding ensures the token amount always fully covers the ETH fee.

Token rates are maintained by oracle services and stored in the **Token Registry** system contract at:

```
0x5300000000000000000000000000000000000021
```

### 9.4 Constraint Rules

1. **V0 must use Alt Fee**: `FeeTokenID > 0`
2. **V1 Alt Fee is optional**: `FeeTokenID` can be 0 (use ETH)
3. **FeeLimit is linked to FeeTokenID**: If `FeeTokenID == 0`, then `FeeLimit` must be nil/0
4. **Token must be active**: Tx pool and execution check whether the token is in active state

### 9.5 Alt Fee in Gas Estimation

When using `eth_estimateGas`:
- If `FeeTokenID` is set, the node queries the user's **token balance** instead of ETH balance
- L1 Data Fee is converted to token units at the current exchange rate
- `FeeLimit` participates in the payable gas cap calculation

### 9.6 Fee Info in Receipts

After execution, the receipt contains:
- `feeRate`: ETH/token exchange rate used at execution time
- `tokenScale`: Exchange rate precision scale
- `l1Fee`: L1 data fee

---

## 10. Reference Index System

### 10.1 Concept

Reference is a **32-byte on-chain index key** that allows users to associate multiple transactions with the same identifier, queryable via RPC.

### 10.2 Storage Mechanism

**Source**: `core/rawdb/accessors_reference_index.go`

- **Write timing**: When a block is successfully inserted into the chain (`core/blockchain.go` → `maintainReferenceIndex`)
- **Index key format**: `prefix + reference(32B) + blockTimestamp(8B) + txIndex(8B) + txHash(32B)`
- **Value**: Empty (leverages key ordering for range queries)
- **Sort order**: Naturally ascending by `blockTimestamp` + `txIndex`

### 10.3 Querying

Use `morph_getTransactionHashesByReference` RPC (see [Section 6.2](#62-morph-namespace-public)).

### 10.4 Use Cases

- **Order systems**: Hash an order ID as Reference, query all related transactions
- **Batch operations**: Use a batch identifier as Reference, track all transactions in a batch
- **Cross-system correlation**: Map external system IDs to References

### 10.5 Important Notes

- Reference is only available in **V1 MorphTx**
- Reference indexing begins after the **Jade fork**
- The same Reference can be used by multiple transactions
- Index auto-updates with chain reorgs (written on insertion, deleted on rollback)

---

## 11. Receipt Extensions

**Source**: `core/state_processor.go`, `core/types/receipt.go`

MorphTx receipts include these extension fields:

| Field | Type | Condition | Description |
|-------|------|-----------|-------------|
| `FeeTokenID` | `*uint16` | All MorphTx | Token ID used |
| `FeeLimit` | `*big.Int` | All MorphTx | Token fee cap |
| `FeeRate` | `*big.Int` | All MorphTx | ETH/token exchange rate at execution |
| `TokenScale` | `*big.Int` | All MorphTx | Exchange rate precision scale |
| `L1Fee` | `*big.Int` | All MorphTx | L1 data fee |
| `Version` | `uint8` | V1+ only | Transaction version |
| `Reference` | `*common.Reference` | V1+ only | Reference key |
| `Memo` | `*[]byte` | V1+ only | Memo |

---

## 12. Common Pitfalls

### Pitfall 1: `gasPrice` Overrides MorphTx Type Detection

**Problem**: In `eth_sendTransaction` params, if you set both `gasPrice` AND MorphTx fields (e.g., `feeTokenID`), `gasPrice` overrides the final type to `LegacyTxType`, silently discarding all Morph fields.

```go
// internal/ethapi/transaction_args.go → toTransaction()
usedType := types.LegacyTxType
switch {
case ..MorphTx conditions..:
    usedType = types.MorphTxType    // ① First identified as MorphTx
...
}
if args.GasPrice != nil {
    usedType = types.LegacyTxType   // ② But gasPrice overrides!
}
```

**Solution**: Always use `maxFeePerGas` and `maxPriorityFeePerGas` with MorphTx. Never set `gasPrice`.

### Pitfall 2: V0 vs V1 `FeeTokenID` Semantics

| | V0 | V1 |
|---|---|---|
| `FeeTokenID == 0` | ❌ Invalid | ✅ Valid (means use ETH) |
| Purpose | Alt Fee only | General-purpose MorphTx, Alt Fee optional |

If migrating from V0 to V1, note that `FeeTokenID` is no longer required.

### Pitfall 3: V1 Signing Hash Includes nil Pointer RLP Encoding

In the V1 signing hash, `reference` and `memo` participate in RLP encoding **even when nil** (nil encodes as `0x80`). Other language SDK implementations must handle this correctly.

### Pitfall 4: Submitting V1 Transactions Before Jade Fork

Before Jade fork activation:
- `eth_sendTransaction`'s `setDefaults` will directly reject
- `eth_sendRawTransaction` will be rejected at tx pool entry
- Even if you can construct a V1 transaction, block validation will reject it

### Pitfall 5: RPC `version` Field Only Appears for V1+

V0 transactions' `RPCTransaction` does NOT include `version`, `reference`, or `memo` fields (`omitempty`). SDKs must handle missing fields:

- If `version` is missing → default to V0
- If `reference` is missing → nil
- If `memo` is missing → nil

### Pitfall 6: V0 Encoding Rejects `FeeTokenID == 0`

V0 format validates `FeeTokenID != 0` at both encoding and decoding time:
- You cannot construct a V0 transaction with `FeeTokenID == 0`
- If you receive a transaction claiming to be V0 but with `FeeTokenID == 0`, decoding will fail

---

## 13. Appendix: Full Call Path Diagrams

### 13.1 Send Transaction (`eth_sendTransaction`)

```
User JSON-RPC request
    │
    ▼
PublicTransactionPoolAPI.SendTransaction()
    │
    ├→ args.setDefaults(ctx, backend)
    │    ├→ Fill maxFeePerGas / maxPriorityFeePerGas (EIP-1559)
    │    ├→ Fill nonce
    │    ├→ isMorphTxArgs() → true?
    │    │    ├→ Check Jade fork status
    │    │    ├→ Infer version (V0/V1)
    │    │    └→ validateMorphTxVersion()
    │    ├→ Validate memo length
    │    └→ DoEstimateGas() → estimate gas (with Alt Fee logic)
    │
    ├→ args.toTransaction()
    │    └→ Construct types.MorphTx{...}
    │       └→ types.NewTx(data)
    │
    ├→ wallet.SignTx(account, tx, chainID)
    │    └→ keystore.SignTx()
    │         └→ types.SignTx(tx, LatestSignerForChainID(chainID), key)
    │              └→ NewEmeraldSigner → modernSigner.Hash → MorphTx.sigHash
    │
    └→ SubmitTransaction()
         └→ backend.SendTx() → enters tx pool
              └→ TxPool.validateTx()
                   ├→ Check eip1559 active
                   ├→ Check Jade fork (V1)
                   ├→ ValidateMorphTxVersion()
                   ├→ Check token active (Alt Fee)
                   └→ Check balance (ETH or token)
```

### 13.2 Send Raw Transaction (`eth_sendRawTransaction`)

```
User submits raw bytes (0x7F || inner_payload)
    │
    ▼
PublicTransactionPoolAPI.SendRawTransaction()
    │
    ├→ tx.UnmarshalBinary(rawBytes)
    │    └→ decodeTyped(rawBytes)
    │         ├→ rawBytes[0] == 0x7F → inner = new(MorphTx)
    │         └→ inner.decode(rawBytes[1:])
    │              ├→ First byte version detection
    │              ├→ V0: decodeV0MorphTxRLP()
    │              └→ V1: decodeV1MorphTxRLP()
    │
    └→ SubmitTransaction()
         └→ (same as above)
```

### 13.3 Query Transaction

```
eth_getTransactionByHash
    │
    ▼
NewRPCTransaction(tx, ...)
    ├→ types.Sender(signer, tx) → recover sender
    ├→ tx.RawSignatureValues() → V, R, S
    ├→ case types.MorphTxType:
    │    ├→ Fill accessList, chainID, gasFeeCap, gasTipCap
    │    ├→ Fill feeTokenID, feeLimit
    │    └→ if tx.Version() >= V1:
    │         └→ Fill version, reference, memo
    └→ Return RPCTransaction JSON
```

### 13.4 Block Validation

```
BlockValidator.ValidateBody(block)
    │
    ├→ isJadeFork = config.IsJadeFork(block.Time())
    │
    └→ for tx in block.Transactions():
         ├→ if !isJadeFork && tx.IsMorphTx() && tx.Version() == V1:
         │    └→ return ErrMorphTxV1NotYetActive
         └→ tx.ValidateMorphTxVersion()
              └→ Check version/field validity
```

### 13.5 Execution & Receipt Generation

```
StateProcessor.applyTransaction(tx)
    │
    ├→ tx.AsMessage(signer, baseFee)
    │    ├→ ValidateMorphTxVersion()
    │    └→ Construct Message{feeTokenID, version, reference, memo, ...}
    │
    ├→ ApplyMessage(evm, msg, gasPool)
    │    └→ StateTransition.Execute()
    │         ├→ buyGas() → if Alt Fee, query token balance & rate
    │         ├→ EVM execution
    │         └→ refundGas() → refund unused gas (ETH or token)
    │
    └→ Build Receipt
         ├→ receipt.FeeTokenID = tx.FeeTokenID()
         ├→ receipt.FeeLimit = tx.FeeLimit()
         ├→ receipt.FeeRate = result.FeeRate
         ├→ receipt.TokenScale = result.TokenScale
         ├→ receipt.L1Fee = result.L1DataFee
         └→ if tx.Version() >= V1:
              ├→ receipt.Version = tx.Version()
              ├→ receipt.Reference = tx.Reference()
              └→ receipt.Memo = tx.Memo()
```

---

## Appendix B: Source File Index

| File Path | Responsibility |
|-----------|---------------|
| `core/types/morph_tx.go` | MorphTx struct, encoding/decoding, signing hash |
| `core/types/transaction.go` | TxData interface, type constant (0x7F), version validation, AsMessage |
| `core/types/transaction_signing.go` | Signer interface, modernSigner, SignTx, NewEmeraldSigner |
| `core/types/transaction_marshalling.go` | JSON serialization/deserialization |
| `core/types/receipt.go` | Receipt struct and Morph extension fields |
| `core/types/hashing.go` | prefixedRlpHash |
| `internal/ethapi/transaction_args.go` | RPC param handling, version inference, validation |
| `internal/ethapi/api.go` | RPCTransaction, SendTransaction, Receipt serialization, PublicMorphAPI |
| `internal/ethapi/backend.go` | morph namespace registration |
| `core/tx_pool.go` | Tx pool validation, Jade fork check, V1 cleanup |
| `core/block_validator.go` | Block validation MorphTx checks |
| `core/state_processor.go` | Post-execution receipt population |
| `core/state_transition.go` | Alt Fee deduction and refund logic |
| `core/blockchain.go` | Reference index maintenance |
| `core/rawdb/accessors_reference_index.go` | Reference index read/write |
| `accounts/abi/bind/base.go` | Contract binding TransactOpts and createMorphTx |
| `accounts/external/backend.go` | External signer MorphTx field passing |
| `signer/core/apitypes/types.go` | Clef signer SendTxArgs.ToTransaction |
| `ethclient/ethclient.go` | Go client wrapper |
| `rpc/types.go` | ReferenceQueryArgs / ReferenceTransactionResult |
| `rollup/fees/rollup_fee.go` | L1 data fee calculation with MorphTx serialization |
| `params/config.go` | EmeraldTime, JadeForkTime configuration |
| `common/types.go` | Reference type, MaxMemoLength |
| `interfaces.go` | CallMsg Morph fields |
