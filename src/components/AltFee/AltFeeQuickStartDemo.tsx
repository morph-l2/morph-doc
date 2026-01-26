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
          <div className="alt-fee-modal-overlay">
            <div
              className="alt-fee-modal alt-fee-modal--mono"
              role="dialog"
              aria-modal="true"
            >
              <div className="alt-fee-modal__header">Confirm transaction</div>
              <div className="alt-fee-modal__body">
                <div className="alt-fee-modal__row">
                  <span className="text--muted">From</span>
                  <span className="alt-fee-modal__value">
                    {confirmData.accountAddress}
                  </span>
                </div>
                <div className="alt-fee-modal__row">
                  <span className="text--muted">To</span>
                  <span className="alt-fee-modal__value">
                    {confirmData.recipient}
                  </span>
                </div>
                <div className="alt-fee-modal__row">
                  <span className="text--muted">Amount</span>
                  <span className="alt-fee-modal__value">
                    {confirmData.amountEth} ETH
                  </span>
                </div>
                <div className="alt-fee-modal__row">
                  <span className="text--muted">Gas payment</span>
                  <span className="alt-fee-modal__value">
                    {confirmData.gasPayment === "token"
                      ? "Token (Alt Fee)"
                      : "Native ETH"}
                  </span>
                </div>
                {confirmData.gasPayment === "token" && (
                  <>
                    <div className="alt-fee-modal__row">
                      <span className="text--muted">Fee token ID</span>
                      <span className="alt-fee-modal__value">
                        {confirmData.feeTokenId}
                      </span>
                    </div>
                    <div className="alt-fee-modal__row">
                      <span className="text--muted">Fee limit</span>
                      <span className="alt-fee-modal__value">
                        {confirmData.feeLimit}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="alt-fee-modal__footer">
                <button
                  className="button button--secondary px-6 alt-fee-modal__btn alt-fee-modal__btn--ghost"
                  onClick={handleCancelConfirm}
                  disabled={isSending}
                >
                  Cancel
                </button>
                <button
                  className="button button--primary px-6 alt-fee-modal__btn alt-fee-modal__btn--solid"
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

