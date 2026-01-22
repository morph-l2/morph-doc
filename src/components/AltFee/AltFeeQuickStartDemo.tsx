import React, { useState } from "react";
import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { morphHoodiTestnet } from "@morph-network/viem";

export default function AltFeeQuickStartDemo() {
  const [privateKey, setPrivateKey] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amountEth, setAmountEth] = useState("0.001");
  const [gasPayment, setGasPayment] = useState<"token" | "native">("token");
  const [feeTokenId, setFeeTokenId] = useState("4");
  const [customFeeTokenId, setCustomFeeTokenId] = useState("");
  const [feeLimit, setFeeLimit] = useState("252637086960555000");
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState("");
  const [isSending, setIsSending] = useState(false);
  const rpcUrl = "https://rpc-hoodi.morph.network";

  const handleSend = async () => {
    setStatus("");
    setTxHash("");

    const normalizedKey = privateKey.trim();

    if (!normalizedKey) {
      setStatus("Please enter a private key (testnet only).");
      return;
    }

    if (!/^0x[0-9a-fA-F]{64}$/.test(normalizedKey)) {
      setStatus("Invalid private key format. Expected 0x + 64 hex chars.");
      return;
    }

    const resolvedTo = toAddress.trim() || "";
    if (resolvedTo && !/^0x[0-9a-fA-F]{40}$/.test(resolvedTo)) {
      setStatus("Invalid recipient address format.");
      return;
    }

    const trimmedAmount = amountEth.trim();
    if (!trimmedAmount) {
      setStatus("Please enter an amount.");
      return;
    }

    let value: bigint;
    try {
      value = parseEther(trimmedAmount);
    } catch (error) {
      setStatus("Invalid amount format. Use a decimal ETH value.");
      return;
    }

    let parsedFeeTokenId = 0;
    if (gasPayment === "token") {
      const tokenInput = feeTokenId === "custom" ? customFeeTokenId.trim() : feeTokenId.trim();
      if (!tokenInput) {
        setStatus("Please select a gas fee token.");
        return;
      }
      parsedFeeTokenId = Number(tokenInput);
      if (!Number.isInteger(parsedFeeTokenId) || parsedFeeTokenId <= 0) {
        setStatus("Invalid gas fee token ID.");
        return;
      }
      if (!feeLimit.trim() || !/^\d+$/.test(feeLimit.trim())) {
        setStatus("Invalid fee limit. Use an integer token amount.");
        return;
      }
    }

    try {
      setIsSending(true);
      const account = privateKeyToAccount(normalizedKey as `0x${string}`);

      const publicClient = createPublicClient({
        chain: morphHoodiTestnet,
        transport: http(rpcUrl),
      });

      const walletClient = createWalletClient({
        account,
        chain: morphHoodiTestnet,
        transport: http(rpcUrl),
      });

      const nonce = await publicClient.getTransactionCount({
        address: account.address,
      });

      const recipient = (resolvedTo || account.address) as `0x${string}`;
      const hash = await walletClient.sendTransaction({
        account,
        to: recipient,
        value,
        nonce,
        gas: 100000n,
        maxFeePerGas: 15000000n,
        maxPriorityFeePerGas: 14000000n,
        ...(gasPayment === "token"
          ? {
              // Alt Fee fields
              feeTokenID: parsedFeeTokenId,
              feeLimit: BigInt(feeLimit.trim()),
            }
          : {}),
      });

      setTxHash(hash);
      setStatus("Sent successfully.");
      console.log("Transaction hash:", hash);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Send failed.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="card alt-fee-card">
      <div className="card__body alt-fee-card__body">
        <div className="alt-fee-card__header">
          <strong>Interactive Demo (Testnet Only)</strong>
        </div>
        <div className="alt-fee-form">
          <div className="alt-fee-field">
            <label htmlFor="alt-fee-private-key">privateKey</label>
            <input
              id="alt-fee-private-key"
              type="password"
              placeholder="0x..."
              value={privateKey}
              onChange={(event) => setPrivateKey(event.target.value)}
              autoComplete="off"
              className="alt-fee-input"
            />
            <div className="alt-fee-note text--muted text-sm text-warning">
              All operations are performed locally on this page. Your private key
              is not stored.
            </div>
          </div>
          <div className="alt-fee-field">
            <label htmlFor="alt-fee-to-address">Recipient address</label>
            <input
              id="alt-fee-to-address"
              type="text"
              placeholder="0x... (leave empty to send to self)"
              value={toAddress}
              onChange={(event) => setToAddress(event.target.value)}
              autoComplete="off"
              className="alt-fee-input"
            />
          </div>
          <div className="alt-fee-field">
            <label htmlFor="alt-fee-amount">Amount (ETH)</label>
            <input
              id="alt-fee-amount"
              type="text"
              inputMode="decimal"
              placeholder="0.001"
              value={amountEth}
              onChange={(event) => setAmountEth(event.target.value)}
              className="alt-fee-input"
            />
          </div>
          <div className="alt-fee-field">
            <label htmlFor="alt-fee-gas-payment">Gas payment</label>
            <select
              id="alt-fee-gas-payment"
              value={gasPayment}
              onChange={(event) =>
                setGasPayment(event.target.value as "token" | "native")
              }
              className="alt-fee-select"
            >
              <option value="token">Token (Alt Fee)</option>
              <option value="native">Native ETH</option>
            </select>
          </div>
          {gasPayment === "token" && (
            <div className="alt-fee-field alt-fee-field--stacked">
              <label htmlFor="alt-fee-token-id">Gas fee token</label>
              <select
                id="alt-fee-token-id"
                value={feeTokenId}
                onChange={(event) => setFeeTokenId(event.target.value)}
                className="alt-fee-select"
              >
                <option value="4">Token ID 4 (USDT)</option>
                <option value="6">Token ID 6 (USDC)</option>
                <option value="custom">Custom token ID</option>
              </select>
              {feeTokenId === "custom" && (
                <input
                  type="number"
                  placeholder="Token ID"
                  value={customFeeTokenId}
                  onChange={(event) => setCustomFeeTokenId(event.target.value)}
                  className="alt-fee-input alt-fee-input--inline"
                />
              )}
              <label htmlFor="alt-fee-limit">Fee limit (token amount, integer)</label>
              <input
                id="alt-fee-limit"
                type="text"
                inputMode="numeric"
                placeholder="252637086960555000"
                value={feeLimit}
                onChange={(event) => setFeeLimit(event.target.value)}
                className="alt-fee-input"
              />
            </div>
          )}
        </div>
        <div className="alt-fee-actions">
          <button
            className="button button--primary alt-fee-button"
            onClick={handleSend}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send transaction"}
          </button>
        </div>
        <div className="alt-fee-status">
          {status && <div>{status}</div>}
          {txHash && (
            <div>
              Tx Hash:{" "}
              <a
                href={`https://explorer-hoodi.morph.network/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {txHash}
              </a>
            </div>
          )}
        </div>
        <div className="alt-fee-footnote text--muted">
          This demo sends a transaction on Morph Hoodi Testnet. You still need a
          small testnet balance for gas.
        </div>
        <div>
        </div>
      </div>
    </div>
  );
}

