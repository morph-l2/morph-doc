import React, { useMemo, useState } from "react";
import { morphHoodiTestnet, morphMainnet } from "@morph-network/viem";

type NetworkKey = "mainnet" | "testnet";

const networkOptions: Record<
  NetworkKey,
  {
    label: string;
    chain: typeof morphMainnet;
    rpcUrl: string;
    explorerUrl: string;
  }
> = {
  mainnet: {
    label: "Morph Mainnet",
    chain: morphMainnet,
    rpcUrl: "https://rpc.morph.network",
    explorerUrl: "https://explorer.morph.network",
  },
  testnet: {
    label: "Morph Hoodi Testnet",
    chain: morphHoodiTestnet,
    rpcUrl: "https://rpc-hoodi.morph.network",
    explorerUrl: "https://explorer-hoodi.morph.network",
  },
};

export default function ChainConfigDemo() {
  const [network, setNetwork] = useState<NetworkKey>("testnet");
  const data = useMemo(() => networkOptions[network], [network]);

  return (
    <div className="card alt-fee-card">
      <div className="card__body alt-fee-card__body">
        <div className="alt-fee-card__header">
          <strong>Chain Config Quick View</strong>
        </div>
        <div className="alt-fee-toolbar">
          <div className="w-full flex flex-row gap gap-4 items-center">
            <label htmlFor="chain-config-network">Network</label>
            <select
              id="chain-config-network"
              value={network}
              onChange={(event) => setNetwork(event.target.value as NetworkKey)}
              className="alt-fee-select alt-fee-select--sm"
            >
              <option value="testnet">Hoodi Testnet</option>
              <option value="mainnet">Mainnet</option>
            </select>
          </div>
        </div>
        <div className="alt-fee-table">
          <table>
          <tbody>
            <tr>
              <th>Name</th>
              <td>{data.chain.name}</td>
            </tr>
            <tr>
              <th>Chain ID</th>
              <td>{data.chain.id}</td>
            </tr>
            <tr>
              <th>RPC</th>
              <td>
                <a href={data.rpcUrl} target="_blank" rel="noopener noreferrer">
                  {data.rpcUrl}
                </a>
              </td>
            </tr>
            <tr>
              <th>Explorer</th>
              <td>
                <a
                  href={data.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.explorerUrl}
                </a>
              </td>
            </tr>
            <tr>
              <th>Native Currency</th>
              <td>
                {data.chain.nativeCurrency.name} (
                {data.chain.nativeCurrency.symbol})
              </td>
            </tr>
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

