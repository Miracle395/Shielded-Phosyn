import { createIncoClient, encryption } from "./inco.js";

const USD_AMOUNT = 1;
const USDC_DECIMALS = 6;

let wallet = null;

const connectBtn = document.getElementById("connectBtn");
const payBtn = document.getElementById("payBtn");
const result = document.getElementById("result");

connectBtn.onclick = async () => {
  console.log("Connect clicked");

  const provider =
    window.phantom?.solana || window.solana;

  if (!provider) {
    alert("❌ Phantom wallet not detected.\nOpen this site in Phantom browser or install Phantom.");
    return;
  }

  try {
    wallet = provider;

    const res = await wallet.connect();
    console.log("Wallet connected:", res.publicKey.toString());

    connectBtn.textContent = "Connected";
    connectBtn.disabled = true;
    connectBtn.style.background = "#4caf50";
  } catch (err) {
    console.error("Wallet connection failed:", err);
    alert("Wallet connection rejected");
  }
};

payBtn.onclick = async () => {
  if (!wallet) {
    alert("Connect wallet first");
    return;
  }

  try {
    const inco = await createIncoClient(wallet);

    const recipient =
      document.getElementById("recipient").value;

    const memo =
      document.getElementById("memo").value;

    const amount =
      (BigInt(USD_AMOUNT) * 10n ** 6n);

    const encryptedAmount =
      await encryption.encryptValue(amount);

    const txSig = await inco.transfer({
      to: recipient,
      amount: encryptedAmount,
      memo,
    });

    result.innerHTML = `
      ✅ Payment sent<br/>
      <a href="https://explorer.solana.com/tx/${txSig}?cluster=devnet" target="_blank">
        View on Explorer
      </a>
    `;
  } catch (err) {
    console.error(err);
    alert(err.message || "Payment failed");
  }
};
