import express from "express";
import { createIncoClient, encryption } from "../incoClient.js";

const router = express.Router();

/**
 * Expected body:
 * {
 *   wallet: {
 *     publicKey: string,
 *     signTransaction: Function,
 *     signAllTransactions: Function
 *   },
 *   to: string,
 *   amount: string, // BigInt as string
 *   memo?: string
 * }
 */
router.post("/", async (req, res) => {
  try {
    const { wallet, to, amount, memo } = req.body;

    if (!wallet || !to || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Minimal wallet adapter (relay-only, no private key)
    const serverWallet = {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions
    };

    const inco = createIncoClient({ wallet: serverWallet });

    // String → BigInt
    const amountBigInt = BigInt(amount);

    // Encrypt amount using Inco SDK
    const encryptedAmount = await encryption.encryptValue(amountBigInt);

    // Submit private transfer
    const txSig = await inco.transfer({
      to,
      amount: encryptedAmount,
      memo
    });

    return res.json({
      success: true,
      txSig
    });
  } catch (err) {
    console.error("Transfer error:", err);
    return res.status(500).json({
      error: err?.message || "Transfer failed"
    });
  }
});

export default router;
