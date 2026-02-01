// routes/transfer.js
import express from "express";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { PublicKey } from "@solana/web3.js";

import { createIncoClient, encryption } from "../incoClient.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { from, to, amount, memo, signedMessage } = req.body;

    if (!from || !to || !amount || !signedMessage) {
      return res.status(400).json({ error: "Missing fields" });
    }

    /* ================================
       1️⃣ VERIFY WALLET SIGNATURE
    ================================= */

    const message = new TextEncoder().encode(
      `Phosyn payment ${amount} to ${to}`
    );

    const isValid = nacl.sign.detached.verify(
      message,
      Uint8Array.from(signedMessage),
      new PublicKey(from).toBytes()
    );

    if (!isValid) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    /* ================================
       2️⃣ INIT INCO CLIENT (SERVER)
    ================================= */

    const inco = createIncoClient(); // server authority only

    /* ================================
       3️⃣ ENCRYPT AMOUNT
    ================================= */

    const encryptedAmount = await encryption.encryptValue(
      BigInt(amount)
    );

    /* ================================
       4️⃣ PRIVATE TRANSFER
    ================================= */

    const txSig = await inco.transfer({
      from,
      to,
      amount: encryptedAmount,
      memo: memo || "",
    });

    res.json({
      success: true,
      txSig,
    });

  } catch (err) {
    console.error("Transfer error:", err);
    res.status(500).json({
      error: err.message || "Transfer failed",
    });
  }
});

export default router;
