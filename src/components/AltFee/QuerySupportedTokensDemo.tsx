import React, { useState } from "react";
import { createPublicClient, http } from "viem";
import { readContract } from "viem/actions";
import {
  morphHoodiTestnet,
  TOKEN_REGISTRY_PROXY_ADDRESS,
  tokenRegistryAbi,
} from "@morph-network/viem";

type TokenItem = {
  tokenID?: number | bigint;
  tokenAddress?: string;
};

export default function QuerySupportedTokensDemo() {
  const [status, setStatus] = useState("");
  const [tokens, setTokens] = useState<TokenItem[] | null>(null);
  const [rawResult, setRawResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [network, setNetwork] = useState<"mainnet" | "testnet">("testnet");
  const rpcUrl = (network) =>
    network === "mainnet"
      ? "https://rpc.morph.network"
      : "https://rpc-hoodi.morph.network";
  const explorerBase =
    network === "mainnet"
      ? "https://explorer.morph.network"
      : "https://explorer-hoodi.morph.network";

  const handleQuery = async () => {
    setStatus("");
    setTokens(null);
    setRawResult("");

    try {
      setIsLoading(true);
      const publicClient = createPublicClient({
        chain: morphHoodiTestnet,
        transport: http(rpcUrl(network)),
      });

      const result = await readContract(publicClient, {
        address: TOKEN_REGISTRY_PROXY_ADDRESS,
        abi: tokenRegistryAbi,
        functionName: "getSupportedTokenList",
      });

      const resultArray = Array.isArray(result) ? result : [result];
      setTokens(resultArray as TokenItem[]);
      setRawResult(JSON.stringify(result, null, 2));
      setStatus("Query succeeded.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Query failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card alt-fee-card">
      <div className="card__body alt-fee-card__body">
        <div className="alt-fee-card__header">
          <strong>Query Supported Tokens</strong>
        </div>
        <div className="alt-fee-toolbar">
          <div className="w-full flex flex-row gap gap-4 items-center">
            <label htmlFor="supported-tokens-network">Network</label>
            <select
              id="supported-tokens-network"
              value={network}
              onChange={(event) =>
                setNetwork(event.target.value as "mainnet" | "testnet")
              }
              className="alt-fee-select alt-fee-select--sm"
            >
              <option value="testnet">Hoodi Testnet</option>
              <option value="mainnet">Mainnet</option>
            </select>
          </div>
          <button
            className="button button--primary alt-fee-button"
            onClick={handleQuery}
            disabled={isLoading}
          >
            {isLoading ? "Querying..." : "Query supported tokens"}
          </button>
        </div>
        {status && <div className="alt-fee-status">{status}</div>}
        {tokens && tokens.length > 0 && (
          <div className="alt-fee-table">
            <table>
              <thead>
                <tr>
                  <th>Token ID</th>
                  <th>Token Address</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token, index) => (
                  <tr key={`${token.tokenID ?? "token"}-${index}`}>
                    <td>{token.tokenID?.toString?.() ?? "-"}</td>
                    <td>
                      {token.tokenAddress ? (
                        <a
                          href={`${explorerBase}/address/${token.tokenAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {token.tokenAddress}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {rawResult && (
          <div className="hidden">
            <div className="margin-bottom--xs">Raw response</div>
            <pre>{rawResult}</pre>
          </div>
        )}
        <div className="alt-fee-footnote text--muted">
          This query uses{" "}
          <a href={rpcUrl(network)} target="_blank" rel="noopener noreferrer">
            Morph {network === "mainnet" ? "Mainnet" : "Hoodi Testnet"} RPC
          </a>
          .
        </div>
      </div>
    </div>
  );
}

