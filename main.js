import { encryptValue } from "https://esm.sh/@inco/lightning-sdk";

/* ---------------- CONFIG ---------------- */

const {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction
} = solanaWeb3;

const {
  getAssociatedTokenAddress,
  createTransferInstruction
} = splToken;

const connection = new Connection(
  "https://api.devnet.solana.com",
  "confirmed"
);

const USDC_MINT = new PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
);

const INCO_PROGRAM_ID = new PublicKey(
  "5sjEbPiqgZrYwR31ahR6Uk9wf5awoX61YGg7jExQSwaj"
);

const logEl = document.getElementById("log");
const log = (m) => logEl.textContent += m + "\n";

/* ---------------- WALLET ---------------- */

let wallet = null;

document.getElementById("connectBtn").onclick = async () => {
  if (!window.solana) {
    alert("Phantom not found");
    return;
  }
  wallet = window.solana;
  await wallet.connect();
  log("✅ Wallet connected: " + wallet.publicKey.toBase58());
};

/* ---------------- PAYMENT ---------------- */

document.getElementById("sendBtn").onclick = async () => {
  try {
    if (!wallet) throw new Error("Connect wallet first");

    const recipient = new PublicKey(
      document.getElementById("to").value.trim()
    );

    const amountUi = Number(
      document.getElementById("amount").value
    );

    const amount = BigInt(amountUi * 1_000_000);

    log("🔐 Encrypting amount with Inco...");
    const encryptedAmount = await encryptValue(amount);

    const sender = wallet.publicKey;

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
      Number(amount)
    );

    log("⚡ Building Inco encrypted instruction...");
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
    tx.recentBlockhash =
      (await connection.getLatestBlockhash()).blockhash;

    log("✍️ Requesting signature...");
    const signed = await wallet.signTransaction(tx);

    log("📡 Sending...");
    const sig = await connection.sendRawTransaction(
      signed.serialize()
    );

    await connection.confirmTransaction(sig);

    log("✅ SUCCESS");
    log("Tx: " + sig);
    log(
      "Explorer: https://explorer.solana.com/tx/" +
      sig +
      "?cluster=devnet"
    );

  } catch (err) {
    log("❌ ERROR: " + err.message);
    console.error(err);
  }
};
