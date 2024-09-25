---
title: Difference between Morph and Ethereum
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!
---
There are several technical differences between Ethereum’s EVM and Morph's optimistic zkEVM. We’ve compiled a list to help you understand these distinctions better.


:::tip
For most Solidity developers, these technical details won't significantly impact your development experience.
:::

## EVM Opcodes


| Opcode                      | Solidity equivalent | Morph Behavior                                                                                            |
| --------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------- |
| `BLOCKHASH`                 | `block.blockhash`   | Returns `keccak(chain_id \|\| block_number)` for the last 256 blocks.                                      |
| `COINBASE`                  | `block.coinbase`    | Returns the pre-deployed fee vault contract address. See [Contracts](../../build-on-morph/developer-resources/1-contracts.md) |
| `DIFFICULTY` / `PREVRANDAO` | `block.difficulty`  | Returns 0.                                                                                                 |
| `SELFDESTRUCT`              | `selfdestruct`      | Disabled. If the opcode is encountered, the transaction will be reverted.                     |
| `BLOBHASH`              | `tx.blob_versioned_hashes[index]`      | Not supported                     |
| `BLOBBASEFEE`              | `blob_base_fee = BLOBBASEFEE()`      | Not supported                    |

## EVM Precompiles

The `RIPEMD-160` (address `0x3`) `blake2f` (address `0x9`), and `point evaluation` (address `0x0a`) precompiles are currently not supported. Calls to unsupported precompiled contracts will revert. We plan to enable these precompiles in future hard forks.

The `modexp` precompile is supported but only supports inputs of size less than or equal to 32 bytes (i.e. `u256`).

The `ecPairing` precompile is supported, but the number of points(sets, pairs) is limited to 4, instead of 6.

The other EVM precompiles are all supported: `ecRecover`, `identity`, `ecAdd`, `ecMul`.

### Precompile Limits

Because of a bounded size of the zkEVM circuits, there is an upper limit on the number of calls that can be made for some precompiles. These transactions will not revert, but simply be skipped by the sequencer if they cannot fit into the space of the circuit. 

| Precompile / Opcode | Limit | 
| ------------------- | ----- |
| `keccak256`         | 3157  |
| `ecRecover`         | 119   |
| `modexp`            | 23    |
| `ecAdd`             | 50    |
| `ecMul`             | 50    |
| `ecPairing`         | 2     |

:::tip Several opcode not available

`BLOBHASH` and `BLOBBASEFEE` are not supported on Morph yet. Additionally, [EIP-4788](https://eips.ethereum.org/EIPS/eip-4788) for accessing the Beacon Chain block root is not supported. 

:::

## State Account

### **Additional Fields**

We added two fields in the current `StateAccount` object: `PoseidonCodehash` and `CodeSize`.

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

Related to this, we maintain two types of codehash for each contract bytecode: Keccak hash and Poseidon hash.

`KeccakCodeHash` is kept to maintain compatibility for `EXTCODEHASH`. `PoseidonCodeHash` is used for verifying the correctness of bytecodes loaded in the zkEVM, where Poseidon hashing is far more efficient.

### CodeSize

When verifying `EXTCODESIZE`, it is expensive to load the whole contract data into the zkEVM. Instead, we store the contract size in storage during contract creation. This way, we do not need to load the code — a storage proof is sufficient to verify this opcode.

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




<!--
We also introduce the concept of system transactions that are created by the `op-node`, and are used to execute deposits and update the L2's view of L1. They have the following attributes:

- Every block will contain at least one system transaction called the L1 attributes deposited transaction. It will always be the first transaction in the block.
- Some blocks will contain one or more user-deposited transactions.
- All system transactions have an [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718)-compatible transaction type of `0x7E`.
- All system transactions are unsigned, and set their `v`, `r`, and `s` fields to `null`.


:::Warning Known Issue
Some Ethereum client libraries, such as Web3js, cannot parse the `null` signature fields described above. To work around this issue, you will need to manually filter out the system transactions before passing them to the library. 
:::
-->

## Future EIPs

Morph closely monitors emerging Ethereum Improvement Proposals (EIPs) and adopts them when suitable. For more specifics, join our community forum or [Discord](https://discord.gg/L2Morph) for discussions.

<!-- ## EVM Target version 

To avoid unexpected behaviors in your contracts, we recommend using ‘london’ as the target version when compiling your smart contracts.

You can read in more details on Shanghai hard fork differences from London on the [Ethereum Execution spec](https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/shanghai.md) and how the new PUSH0 instruction [impacts the Solidity compiler](https://blog.soliditylang.org/2023/05/10/solidity-0.8.20-release-announcement/).
-->

