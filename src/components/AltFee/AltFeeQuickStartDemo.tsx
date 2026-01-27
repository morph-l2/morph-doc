import React, { useEffect, useState } from "react";
import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { morphHoodiTestnet } from "@morph-network/viem";

type ConfirmPayload = {
  accountAddress: `0x${string}`;
  recipient: `0x${string}`;
  amountEth: string;
  value: bigint;
  gasPayment: "token" | "native";
  feeTokenId?: number;
  feeLimit?: string;
};

export default function AltFeeQuickStartDemo() {
  const [privateKey, setPrivateKey] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [lastDerivedAddress, setLastDerivedAddress] = useState("");
  const [amountEth, setAmountEth] = useState("0.001");
  const [gasPayment, setGasPayment] = useState<"token" | "native">("token");
  const [feeTokenId, setFeeTokenId] = useState("4");
  const [customFeeTokenId, setCustomFeeTokenId] = useState("");
  const [feeLimit, setFeeLimit] = useState("0");
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [confirmData, setConfirmData] = useState<ConfirmPayload | null>(null);
  const rpcUrl = "https://rpc-hoodi.morph.network";

  useEffect(() => {
    const normalizedKey = privateKey.trim();
    if (!/^0x[0-9a-fA-F]{64}$/.test(normalizedKey)) {
      return;
    }

    try {
      const account = privateKeyToAccount(normalizedKey as `0x${string}`);
      if (!toAddress.trim() || toAddress === lastDerivedAddress) {
        setToAddress(account.address);
      }
      setLastDerivedAddress(account.address);
    } catch {
      // Ignore invalid private key decoding.
    }
  }, [privateKey, toAddress, lastDerivedAddress]);

  const executeSend = async (payload: ConfirmPayload) => {
    setStatus("");
    setTxHash("");

    try {
      setIsSending(true);
      const account = privateKeyToAccount(privateKey.trim() as `0x${string}`);

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

      const hash = await walletClient.sendTransaction({
        account,
        to: payload.recipient,
        value: payload.value,
        nonce,
        gas: 100000n,
        maxFeePerGas: 15000000n,
        maxPriorityFeePerGas: 14000000n,
        ...(payload.gasPayment === "token"
          ? {
              // Alt Fee fields
              feeTokenID: payload.feeTokenId ?? 0,
              feeLimit: BigInt(payload.feeLimit ?? "0"),
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

  const handleSend = () => {
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

    let parsedFeeTokenId: number | undefined;
    if (gasPayment === "token") {
      const tokenInput =
        feeTokenId === "custom" ? customFeeTokenId.trim() : feeTokenId.trim();
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

    const account = privateKeyToAccount(normalizedKey as `0x${string}`);
    const recipient = (resolvedTo || account.address) as `0x${string}`;

    setConfirmData({
      accountAddress: account.address,
      recipient,
      amountEth: trimmedAmount,
      value,
      gasPayment,
      feeTokenId: parsedFeeTokenId,
      feeLimit: gasPayment === "token" ? feeLimit.trim() : undefined,
    });
  };

  const handleConfirmSend = async () => {
    if (!confirmData || isSending) {
      return;
    }
    const payload = confirmData;
    setConfirmData(null);
    await executeSend(payload);
  };

  const handleCancelConfirm = () => {
    setConfirmData(null);
    setStatus("Transaction cancelled.");
  };

  return (
    <div className="card alt-fee-card">
      <div className="card__body alt-fee-card__body">
        <div className="alt-fee-card__header">
          <strong>Interactive Demo (Morph Hoodi Testnet Only)</strong>
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
                placeholder="0"
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
        {confirmData && (
          <div className="fixed inset-0 bg-modal-overlay backdrop-blur-[10px] backdrop-opacity-100 flex items-center justify-center z-[9999]">
            <div
              className="max-w-[520px] mx-0 bg-modal-bg rounded-lg w-[92vw] shadow-[0_24px_72px_rgba(0,0,0,0.18)]"
              role="dialog"
              aria-modal="true"
            >
              <div className="text-lg xl:text-xl font-semibold leading-6 px-6 xl:px-8 pt-6 xl:pt-8 pb-4 xl:pb-6 text-modal-title flex items-center justify-between">
                <span>Confirm transaction</span>
                <button
                  type="button"
                  className="absolute p-0 top-4 xl:top-7 right-4 xl:right-7 z-10 cursor-pointer flex justify-center items-center rounded-full hover:bg-bg-img w-8 h-8 text-modal-title text-2xl leading-none"
                  onClick={handleCancelConfirm}
                  aria-label="Close"
                  disabled={isSending}
                >
                  ×
                </button>
              </div>
              <div className="px-6 xl:px-8 flex flex-col gap-4">
                <div className="flex justify-between gap-3 text-sm items-center">
                  <span className="text-modal-text">From</span>
                  <span className="text-modal-title text-right break-all">
                    {confirmData.accountAddress}
                  </span>
                </div>
                <div className="flex justify-between gap-3 text-sm items-center">
                  <span className="text-modal-text">To</span>
                  <span className="text-modal-title text-right break-all">
                    {confirmData.recipient}
                  </span>
                </div>
                <div className="flex justify-between gap-3 text-sm items-center">
                  <span className="text-modal-text">Amount</span>
                  <span className="text-modal-title text-right">
                    {confirmData.amountEth} ETH
                  </span>
                </div>
                <div className="flex justify-between gap-3 text-sm items-center">
                  <span className="text-modal-text">Gas payment</span>
                  <span className="text-modal-title text-right">
                    {confirmData.gasPayment === "token"
                      ? "Token (Alt Fee)"
                      : "Native ETH"}
                  </span>
                </div>
                {confirmData.gasPayment === "token" && (
                  <>
                    <div className="flex justify-between gap-3 text-sm items-center">
                      <span className="text-modal-text">Fee token ID</span>
                      <span className="text-modal-title text-right">
                        {confirmData.feeTokenId}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3 text-sm items-center">
                      <span className="text-modal-text">Fee limit</span>
                      <span className="text-modal-title text-right">
                        {confirmData.feeLimit}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="px-6 xl:px-8 pt-4 xl:pt-6 pb-6 xl:pb-8 flex justify-end gap-3">
                <button
                  className="button button--secondary px-6 rounded-md border border-modal-content-border bg-transparent !text-modal-title hover:opacity-80 transition-opacity"
                  onClick={handleCancelConfirm}
                  disabled={isSending}
                >
                  Cancel
                </button>
                <button
                  className="button button--primary px-6 rounded-md bg-modal-link text-white hover:opacity-80 transition-opacity"
                  onClick={handleConfirmSend}
                  disabled={isSending}
                >
                  {isSending ? "Sending..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

