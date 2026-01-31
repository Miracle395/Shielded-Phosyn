// routes/transfer.js
import express from "express";
import { createIncoClient, encryption } from "../incoClient.js";

const router = express.Router();

/**
 * Expected body:
 * {
 *   wallet: { publicKey: string, signTransaction: function, signAllTransactions: function },
 *   to: string,
 *   amount: string (BigInt as string),
 *   memo?: string
 * }
 */
router.post("/", async (req, res) => {
  try {
    const { wallet, to, amount, memo } = req.body;

    if (!wallet || !to || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Minimal wallet adapter
    const serverWallet = {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions
    };

    const inco = createIncoClient({ wallet: serverWallet });

    // Convert string → BigInt
    const amountBigInt = BigInt(amount);

    // Encrypt amount for Inco Lightning privacy
    const encryptedAmount = await encryption.encryptValue(amountBigInt);

    // Submit private transfer
    const txSig = await inco.transfer({
      to,
      amount: encryptedAmount,
      memo
    });

    res.json({
      success: true,
      txSig
    });
  } catch (err) {
    console.error("Transfer error:", err);
    res.status(500).json({
      error: err.message || "Transfer failed"
    });
  }
});

export default router;
