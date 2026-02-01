// app.js
import { createIncoClient, encryption } from "./inco.js";

let wallet = null;
let isConnected = false;

const USD_AMOUNT = 1;
const USDC_DECIMALS = 6;

async function connectWallet() {
  if (!window.solana) {
    alert("Please install Phantom or Solflare");
    return;
  }

  wallet = window.solana;
  await wallet.connect();

  isConnected = true;
  const btn = document.getElementById("connectBtn");
  btn.textContent = "Connected";
  btn.disabled = true;
  btn.style.background = "#a5e21d";
}

async function submitPayment() {
  if (!isConnected) {
    alert("Connect your wallet first");
    return;
  }

  const recipient = document.getElementById("recipient").value.trim();
  const memo = document.getElementById("paymentMemo").value.trim();

  if (!recipient) {
    alert("Recipient wallet is required");
    return;
  }

  const serverWallet = {
    publicKey: wallet.publicKey.toString(),
    signTransaction: wallet.signTransaction,
    signAllTransactions: wallet.signAllTransactions,
  };

  const inco = createIncoClient(serverWallet);

  // Convert to smallest unit and encrypt
  const amountBigInt = BigInt(USD_AMOUNT) * 10n ** BigInt(USDC_DECIMALS);
  const encryptedAmount = await encryption.encryptValue(amountBigInt);

  try {
    const txSig = await inco.transfer({
      to: recipient,
      amount: encryptedAmount,
      memo: memo || "",
    });

    // Show success
    document.getElementById("successDetails").innerHTML =
      `Sent $${USD_AMOUNT} USDC<br/>Tx: ${txSig.slice(0, 10)}...`;
    document.getElementById("successScreen").style.display = "block";

    document.getElementById("viewTxBtn").onclick = () =>
      window.open(
        `https://explorer.solana.com/tx/${txSig}?cluster=devnet`,
        "_blank"
      );
  } catch (err) {
    console.error("Transfer error:", err);
    alert(err.message || "Transfer failed");
  }
}

// Event listeners
document.getElementById("connectBtn").addEventListener("click", connectWallet);
document.getElementById("payBtn").addEventListener("click", submitPayment);
