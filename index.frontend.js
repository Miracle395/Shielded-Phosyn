import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction
} from "https://esm.sh/@solana/web3.js";

import {
  getAssociatedTokenAddress,
  createTransferInstruction
} from "https://esm.sh/@solana/spl-token";

import { encryptAmount } from "./incoClient.js";

const logEl = document.getElementById("log");
const log = (m) => (logEl.textContent += m + "\n");

const connection = new Connection(
  "https://api.devnet.solana.com",
  "confirmed"
);

// 🔴 REQUIRED: SET THESE
const USDC_MINT = new PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
);

const INCO_PROGRAM_ID = new PublicKey(
  "5sjEbPiqgZrYwR31ahR6Uk9wf5awoX61YGg7jExQSwaj"
);

async function privateTransfer({ to, amount }) {
  if (!window.solana) {
    throw new Error("Wallet not found");
  }

  await window.solana.connect();

  const sender = window.solana.publicKey;
  const recipient = new PublicKey(to);

  log("🔐 Encrypting amount...");
  const encryptedAmount = await encryptAmount(amount);

  const senderATA = await getAssociatedTokenAddress(
    USDC_MINT,
    sender
  );

  const recipientATA = await getAssociatedTokenAddress(
    USDC_MINT,
    recipient
  );

  log("🪙 Building SPL transfer...");
  const transferIx = createTransferInstruction(
    senderATA,
    recipientATA,
    sender,
    amount
  );

  log("⚡ Building Inco instruction...");
  const incoIx = new TransactionInstruction({
    programId: INCO_PROGRAM_ID,
    keys: [
      { pubkey: sender, isSigner: true, isWritable: false }
    ],
    data: Buffer.from(encryptedAmount)
  });

  const tx = new Transaction().add(
    transferIx,
    incoIx
  );

  tx.feePayer = sender;
  tx.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  log("✍️ Requesting signature...");
  const signed = await window.solana.signTransaction(tx);

  log("📡 Sending transaction...");
  const sig = await connection.sendRawTransaction(
    signed.serialize()
  );

  await connection.confirmTransaction(sig);

  log("✅ SUCCESS: " + sig);
}

document.getElementById("send").onclick = async () => {
  try {
    const to = document.getElementById("to").value.trim();
    const amountUi = Number(
      document.getElementById("amount").value
    );

    const amount = amountUi * 1_000_000; // USDC decimals

    await privateTransfer({ to, amount });
  } catch (e) {
    log("❌ ERROR: " + e.message);
  }
};
