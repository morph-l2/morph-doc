---
title: Difference between Morph and Ethereum
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!
---

There are several technical differences between Ethereum’s EVM and Morph's optimistic zkEVM.

We’ve compiled a list to help you understand these distinctions better.

:::tip
For most Solidity developers, these technical details won't significantly impact your development experience.
:::

## EVM Opcodes


| Opcode                      | Solidity equivalent | Morph Behavior                                                                                            |
| --------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------- |
| `BLOCKHASH`                 | `block.blockhash`   | Returns `keccak(chain_id \|\| block_number)` for the last 256 blocks.                                      |
| `COINBASE`                  | `block.coinbase`    | Returns the pre-deployed fee vault contract address. See [Contracts](../../build-on-morph/developer-resources/1-contracts.md) |
| `DIFFICULTY` / `PREVRANDAO` | `block.difficulty`  | Returns 0.                                                                                                 |
| `SELFDESTRUCT`              | `selfdestruct`      | Disabled. If the opcode is triggered, the transaction will be reverted.                     |
| `BLOBHASH`              | `tx.blob_versioned_hashes[index]`      | Not supported                     |
| `BLOBBASEFEE`              | `blob_base_fee = BLOBBASEFEE()`      | Not supported                    |

## EVM Precompiles

The `RIPEMD-160` (address `0x3`), `blake2f` (address `0x9`), and `point evaluation` (address `0x0a`) precompiles are currently unsupported. Calls to these unsupported precompiled contracts will result in a transaction revert.

The `modexp` precompile is supported, but it only accepts inputs that are 32 bytes or smaller (i.e., `u256`).

The `ecPairing` precompile is also supported; however, the maximum number of points (sets or pairs) is limited to 4, rather than 6.

All other EVM precompiles are fully supported: `ecRecover`, `identity`, `ecAdd`, and `ecMul`.

### Certain Precompile Limits

There is a maximum limit on the number of calls that can be made to certain precompiles due to the bounded size of zkEVM circuits. 

While these transactions won't be reverted, the sequencer will skip them if they exceed the circuit's capacity.


| Precompile / Opcode | Limit | 
| ------------------- | ----- |
| `keccak256`         | 3157  |
| `ecRecover`         | 119   |
| `modexp`            | 23    |
| `ecAdd`             | 50    |
| `ecMul`             | 50    |
| `ecPairing`         | 2     |

:::tip Several opcode not available

`BLOBHASH` and `BLOBBASEFEE` are not supported on Morph yet.

[EIP-4788](https://eips.ethereum.org/EIPS/eip-4788) for accessing the Beacon Chain block root is not supported too. 

:::

## State Account

### **Additional Fields**

We have introduced two new fields to the existing `StateAccount` object: `PoseidonCodehash` and `CodeSize`.

```go
type StateAccount struct {
	Nonce    uint64
	Balance  *big.Int
	Root     common.Hash // merkle root of the storage trie
	KeccakCodeHash []byte // still the Keccak codehash
	// added fields
	PoseidonCodeHash []byte // the Poseidon codehash
	CodeSize uint64
}
```
### **CodeHash**

In this context, we keep two varieties of code hashes for each contract's bytecode: the `Keccak hash` and the `Poseidon hash`.

The `KeccakCodeHash` is preserved to ensure compatibility with `EXTCODEHASH`, while the `PoseidonCodeHash` is utilized for verifying the accuracy of bytecodes loaded in the zkEVM, as Poseidon hashing offers significantly greater efficiency.

## Block Time

:::tip Block Time Subject to Change

Blocks are produced every second, with an empty block generated if there are no transactions for 5 seconds. However, this frequency may change in the future.
:::

To compare, Ethereum has a block time of ~12 seconds.

Reasons for Faster Block Time in Morph

User Experience: 

- A faster, consistent block time provides quicker feedback, enhancing the user experience.

- Optimization: As we refine the zkEVM circuits in our testnets, we can achieve higher throughput than Ethereum, even with a smaller gas limit per block or batch.


Notice:
- `TIMESTAMP` will return the timestamp of the block. It will update every second.
- `BLOCKNUMBER` will return an actual block number. It will update every second. The one-to-one mapping between blocks and transactions will no longer apply.

