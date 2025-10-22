---
title: 中文开发者集成文档
lang: zh-CN
keywords: [morph,ethereum,rollup,layer2,validity proof,optimistic zk-rollup]
description: Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!
---

### 网络参数

| 网络 | 链 ID | RPC URL | 区块浏览器 |
| --- | --- | --- | --- |
| Morph 主网 | 2818 | [https://rpc-quicknode.morphl2.io](https://rpc-quicknode.morphl2.io) | [https://explorer.morphl2.io/](https://explorer.morphl2.io) |
| Ethereum 主网 | 1 | [https://ethereum-rpc.publicnode.com/](https://ethereum-rpc.publicnode.com) | [https://etherscan.io/](https://etherscan.io) |
| Morph Hoodi 测试网 | 2810 | [https://rpc-quicknode-hoodi.morphl2.io](https://rpc-quicknode-hoodi.morphl2.io) | [https://explorer-hoodi.morphl2.io/](https://explorer-hoodi.morphl2.io) |
| Hoodi 测试网 | 17000 | [https://ethereum-hoodi-rpc.publicnode.com/](https://ethereum-hoodi-rpc.publicnode.com) | [https://hoodi.etherscan.io](https://hoodi.etherscan.io) |


请注意，我们已为公共 RPC 访问设置了速率限制，目前为每个 IP 每分钟 600 次请求。

如果您需要更高的额度，请联系Morph团队为您开放更高限额。您还可以使用我们的合作伙伴产品 [quicknode](https://www.quicknode.com/) 或 [tenderly](https://tenderly.co/) 创建自己的私人 RPC。

:::tip Websocket 连接

wss://rpc-quicknode.morphl2.io

:::

### 浏览器信息

[官方主网浏览器](https://explorer.morphl2.io)

[官方测试网浏览器](https://explorer-hoodi.morphl2.io)

[浏览器 API 文档](https://explorer.morphl2.io/api-docs)

浏览器 API: https://explorer-api.morphl2.io/api

测试网浏览器 API: https://explorer-hoodi-api.morphl2.io/api


有关如何在 Morph 浏览器上验证您的合约的详细指南，[点击这里](../build-on-morph/5-verify-your-smart-contracts.md)

### 桥信息

[官方桥](https://bridge.morphl2.io)

[官方测试网桥](https://bridge-hoodi.morphl2.io)

:::tip 提现和存款时间

由于 Morph opzkEVM 设计，每个提现请求需要经过 48 小时的提现期（挑战窗口）才能完成。

存款需要等待 2 个以太坊Epoch（大约 13~20 分钟）。

:::

#### 新桥接资产支持：

[将您的代币添加到官方桥](https://docs.morphl2.io/docs/build-on-morph/build-on-morph/bridge-between-morph-and-ethereum#add-your-token-to-the-official-bridge)


您还可以使用 LayerZero 来包装您的代币：

[LayerZero 在 Morph 上](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts#morph)


### 交易费用与区块

对于以太坊 Layer2，费用分为两部分：L1 费用和 L2 费用。

对于 L2 费用，Morph 目前使用与以太坊主网相同的 [EIP-1559](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md) 机制来计算交易费用。每笔交易将有一个基础费用和一个优先费用。基础费用设定为 0.001 Gwei。如果区块交易限制（每个区块 100 笔）未达到，用户只需要仅支付基础费即可。

:::tip
请注意,我们在测试网上设置了最低的 L2 优先费(0.01 gwei),这是为了防止垃圾交易影响其他正常交易。对于主网,我们可以在不收取优先级费用的情况下处理交易。
:::

Morph 目前每秒生成 1 个非空区块，如果没有新交易，我们将每 5 秒生成 1 个空区块。

每个区块最多可以容纳 100 笔交易，我们将继续提高限制来达成更高的TPS。

### 重要合约

我们已记录所有重要的 Morph 合约，您可以在 [这里](../developer-resources/1-contracts.md) 找到它们。

### 节点部署

目前我们支持您在 Docker 中运行 Morph 节点（全节点和验证节点）或在Host上运行。

您可以查看 [节点部署指南](../developer-resources/node-operation/full-node/1-run-in-docker.md) 以获取更多详细信息。
