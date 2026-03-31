---
title: Prune State
lang: en-US
---
The performance of a full node will degrade when the storage size reaches a high volume. We suggest that the fullnode always keep light storage by pruning the storage.

:::note
To prune a Geth node at least 200 GB of free disk space is recommended. This means pruning cannot be used to save a hard drive that has been completely filled. A good rule of thumb is to prune before the node fills ~80% of the available disk space.
:::

The hardware is important, **make sure the SSD meets: solid-state drive(SSD), 8k IOPS, 500 MB/S throughput, read latency < 1ms.**

### MPT Nodes (post-Jade Fork)

After the [Jade Fork](./upgrade-node/0-jade-fork-overview.md), nodes run with `--morph-mpt` and use standard MPT state storage. Use the standard prune command:

1. Stop the node, including the consensus client (`morphnode`) and the execution client (`geth`).
2. Run the prune command:
   ```bash
   nohup geth snapshot prune-state --datadir "$GETH_DB_DIR" > prune.log &
   ```
   It will take several hours to finish.
3. Start the node once it is done.

### zkTrie Nodes (pre-Jade Fork)

:::caution
This section only applies to nodes still running with zkTrie state storage. After the Jade Fork, MPT storage is recommended for new deployments, but existing zkTrie nodes that updated their binaries can continue operating normally. See the [Jade Fork Overview](./upgrade-node/0-jade-fork-overview.md) for details.
:::

For nodes still running with zkTrie state storage, use the zkTrie-specific prune command:

1. Stop the node, including the consensus client (`morphnode`) and the execution client (`geth`).
2. Run the prune command:
   ```bash
   nohup geth snapshot prune-zk-state --datadir "$GETH_DB_DIR" > prune.log &
   ```
   It will take 5~7 hours to finish.
3. Start the node once it is done.



