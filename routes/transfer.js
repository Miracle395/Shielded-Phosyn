// routes/transfer.js
const express = require("express");
const { createIncoClient, encryption } = require("../incoClient.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { from, to, amount, memo } = req.body;

    // ✅ FIXED validation
    if (!from || !to || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // ✅ Server-side wallet (Inco controlled)
    const serverWallet = {
      publicKey: from
    };

    const inco = createIncoClient({ wallet: serverWallet });

    // ✅ amount is human-readable ("1")
    const amountBigInt = BigInt(amount);
    const encryptedAmount = await encryption.encryptValue(amountBigInt);

    const txSig = await inco.transfer({
      to,
      amount: encryptedAmount,
      memo: memo || ""
    });

    res.json({ success: true, txSig });

  } catch (err) {
    console.error("Transfer error:", err);
    res.status(500).json({
      error: err.message || "Transfer failed"
    });
  }
});

module.exports = router;
