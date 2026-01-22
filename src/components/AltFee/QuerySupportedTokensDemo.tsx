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
    <div className="card margin--md">
      <div className="card__body">
        <div className="margin-bottom--sm">
          <strong>Query Supported Tokens (Testnet)</strong>
        </div>
        <div className="margin-bottom--sm">
          <label htmlFor="supported-tokens-network">Network: </label>
          <select
            id="supported-tokens-network"
            value={network}
            onChange={(event) =>
              setNetwork(event.target.value as "mainnet" | "testnet")
            }
            style={{ width: "20%", padding: "8px", marginTop: "4px" }}
          >
            <option value="testnet">Hoodi Testnet</option>
            <option value="mainnet">Mainnet</option>
          </select>
        </div>
        <button
          className="button button--primary margin-bottom--sm"
          onClick={handleQuery}
          disabled={isLoading}
        >
          {isLoading ? "Querying..." : "Query supported tokens"}
        </button>
        {status && <div className="margin-bottom--sm">{status}</div>}
        {tokens && tokens.length > 0 && (
          <div className="margin-bottom--sm">
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
        <div className="margin-top--sm text--muted">
          This query uses <a href={rpcUrl(network)} target="_blank" rel="noopener noreferrer">Morph {network === "mainnet" ? "Mainnet" : "Hoodi Testnet"} RPC</a>.
        </div>
      </div>
    </div>
  );
}

