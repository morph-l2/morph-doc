---
title: Difference between Morph and Ethereum
lang: en-US
keywords: [morph,ethereum,rollup,layer2,validity proof,optimstic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimstic zk-rollup solution. Try it now!
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
| `COINBASE`                  | `block.coinbase`    | Returns the pre-deployed fee vault contract address. See [Contracts](../developer-resources/1-contracts.md). |
| `DIFFICULTY` / `PREVRANDAO` | `block.difficulty`  | Returns 0.                                                                                                 |
| `BASEFEE`                   | `block.basefee`     | Disabled. If the opcode is encountered, the transaction will be reverted.                        |
| `SELFDESTRUCT`              | `selfdestruct`      | Disabled. If the opcode is encountered, the transaction will be reverted.                     |


[^eip1559]: We have currently disabled EIP-1559 on Scroll.
[^willadpot]: Will change to adopt Ethereum’s solution in the future.

## EVM Precompiles

The `SHA2-256` (address `0x2`), `RIPEMD-160` (address `0x3`), and `blake2f` (address `0x9`) precompiles are currently not supported. Calls to these contracts will be reverted. We plan to enable these three precompiles in a future hard fork.


The `modexp` precompile is supported, but only for inputs up to 32 bytes (i.e. `u256`).

The `ecPairing` precompile is supported but limits the number of points(sets, pairs) to 4, instead of 6.

Other EVM precompiles like `ecRecover`, `identity`, `ecAdd`, and `ecMul` are fully supported.


## State Account

### **Additional Fields**

We have introduced two additional fields in the `StateAccount` object: `PoseidonCodehash` and `CodeSize`.

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


- There are two types of codehash for each contract bytecode: `KeccakCodeHash`and `PoseidonCodeHash`.

- `KeccakCodeHash` is kept to maintain compatibility for EXTCODEHASH. 

- `PoseidonCodeHash` is used for verifying the correctness of bytecodes loaded in the zkEVM, where Poseidon hashing is far more efficient.

### CodeSize

When verifying `EXTCODESIZE`, loading the entire contract data into the zkEVM is costly. Instead, we store the contract size in storage at contract creation. This approach avoids the need to load the code, as storage proof is sufficient to verify this opcode.



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
Some Ethereum client libraries, such as Web3j, cannot parse the `null` signature fields described above. To work around this issue, you will need to manually filter out the system transactions before passing them to the library. 
:::
-->

## Future EIPs

Morph closely monitors emerging Ethereum Improvement Proposals (EIPs) and adopts them when suitable. For more specifics, join our community forum or Discord for discussions.

<!-- ## EVM Target version 

To avoid unexpected behaviors in your contracts, we recommend using ‘london’ as the target version when compiling your smart contracts.

You can read in more details on Shanghai hard fork differences from London on the [Ethereum Execution spec](https://github.com/ethereum/execution-specs/tree/master/network-upgrades/mainnet-upgrades/shanghai.md) and how the new PUSH0 instruction [impacts the Solidity compiler](https://blog.soliditylang.org/2023/05/10/solidity-0.8.20-release-announcement/).
-->

## [Transaction Fees](../build-on-morph/4-understand-transaction-cost-on-morph.md)
