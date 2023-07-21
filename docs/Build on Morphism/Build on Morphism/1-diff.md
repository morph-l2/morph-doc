---
title: Difference between Morphism and Ethereum
lang: en-US
---


There are a number of technical details that differ between Ethereum mainnet's EVM and Morphism's modified design for a zkEVM. Below you can see those differences as they exist now.

For open-source contributors and infrastructure builders, please contact our team for additional support.

:::tip
For the average Solidity developer, these details won't affect your development experience.
:::

## EVM Opcodes

Opcode  | Solidity equivalent | Ethereum Behavior | Morphism Behavior|
- | - | - | -|
COINBASE   | block.coinbase   | In Ethereum Clique, the eth address of the signer. | Returns the pre-deployed fee vault contract address.|
DIFFICULTY/PREVRANDAO | block.difficulty | After PoS, the previous block’s randao value. | Returns 0.|
BLOCKHASH     | block.blockhash    | **Input**: blockNumber from top of the stack, and the valid range is [NUMBER-256, NUMBER-1]. **Output**: hash of the given block number, or 0 if the block number is not in the valid range. | Matches Ethereum, but limits the range of input blockNumber to be NUMBER-1.|
SELFDESTRUCT  | selfdestruct  | [Plans to deprecate and substitute with SENDALL](https://eips.ethereum.org/EIPS/eip-4758) | Disabled in the sequencer. Runtime error, same behavior as the INVALID opcode. *Will change to adopt Ethereum’s solution in the future.*|
PUSH0 | /| Part of EVM as of Shanghai hard fork | Runtime Error, will act as an INVALID opcode. Will be supported |

## EVM Precompiles

The *SHA2-256* (address 0x2), *RIPEMD-160* (address 0x3), and *blake2f* (address 0x9) precompiles are currently not supported. Calls to these precompiled contracts will revert. We plan to enable these 3 precompiles in a future hard fork.

The other EVM precompiles are all supported: *ecRecover*, *identity*, *modexp*, *ecAdd*, *ecMul*, *ecPairing*.

## State Account

### Additional Fields

We added two fields in the current StateAccount object: PoseidonCodehash and CodeSize.


```
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

### CodeHash
Related to this, we maintain two types of codehash for each contract bytecode: Keccak hash and Poseidon hash.
KeccakCodeHash is kept to maintain compatibility for EXTCODEHASH. PoseidonCodeHash is used for verifying correctness of bytecodes loaded in the zkEVM, where Poseidon hashing is far more efficient.

### CodeSize
When verifying EXTCODESIZE, it is expensive to load the whole contract data into the zkEVM. Instead, we store the contract size in storage during contract creation. This way, we do not need to load the code — a storage proof is sufficient to verify this opcode.

## Block Time

:::warning Block Time Subject to Change

Currently blocks are produced every second and empty block if no transctions for 5 seconds
However, that value may change in the future.

:::

- `TIMESTAMP` will return the timestamp of the block. It will update every second.
- `BLOCKNUMBER` will return an actual block number. It will update every second. The one-to-one mapping between blocks and transactions will no longer apply.


<!--
We also introduce the concept of system transactions that are created by the `op-node`, and are used to execute deposits and update the L2's view of L1. They have the following attributes:

- Every block will contain at least one system transaction called the L1 attributes deposited transaction. It will always be the first transaction in the block.
- Some blocks will contain one or more user-deposited transactions.
- All system transactions have an [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718)-compatible transaction type of `0x7E`.
- All system transactions are unsigned, and set their `v`, `r`, and `s` fields to `null`.


:::warning Known Issue
Some Ethereum client libraries, such as Web3j, cannot parse the `null` signature fields described above. To work around this issue, you will need to manually filter out the system transactions before passing them to the library. 
:::
-->

## Future EIPs
We keep a close on eye on all emerging EIPs adopted by Ethereum and adopt them when suitable. If you’re interested in more specifics, reach out in our community forum or on the Morphism Discord.

EVM Target version
To ensure no unexpected behaviour happens in your contracts, we recommend using london as target version when compiling your smart contracts.
You can read in more details on Shanghai hard fork differences from London on the [Ethereum Execution spec](https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/shanghai.md) and how the new PUSH0 instruction [impacts the Solidity compiler](https://blog.soliditylang.org/2023/05/10/solidity-0.8.20-release-announcement/).

## [Transaction Fees](./4-txfee.md)
