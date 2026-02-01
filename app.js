import { createIncoClient, encryption } from "./inco.js";

const USD_AMOUNT = 1;
const USDC_DECIMALS = 6;

let wallet = null;

const connectBtn = document.getElementById("connectBtn");
const payBtn = document.getElementById("payBtn");
const result = document.getElementById("result");

connectBtn.onclick = async () => {
  if (!window.solana) {
    alert("Install Phantom");
    return;
  }

  wallet = window.solana;
  await wallet.connect();

  connectBtn.textContent = "Connected";
  connectBtn.disabled = true;
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
