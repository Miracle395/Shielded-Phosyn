import express from "express";
import { createIncoClient } from "../incoClient.js";
import { encryption } from "@inco/solana-sdk";

const router = express.Router();

/**
 * Expected body:
 * {
 *   fromPubkey: string,
 *   to: string,
 *   amount: string (BigInt as string),
 *   memo?: string,
 *   signedMessage: Uint8Array (base64)
 * }
 */
router.post("/", async (req, res) => {
  try {
    const {
      wallet,
      to,
      amount,
      memo
    } = req.body;

    if (!wallet || !to || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Recreate wallet adapter (minimal)
    const serverWallet = {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions
    };

    const inco = createIncoClient({ wallet: serverWallet });

    // Convert string → BigInt
    const amountBigInt = BigInt(amount);

    // Encrypt amount
    const encryptedAmount =
      await encryption.encryptValue(amountBigInt);

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
