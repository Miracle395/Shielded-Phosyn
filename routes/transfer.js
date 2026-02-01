// routes/transfer.js
const express = require("express");
const { createIncoClient, encryption } = require("../incoClient.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { wallet, to, amount, memo } = req.body;

    if (!wallet || !wallet.publicKey || !to || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const serverWallet = {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction || false,
      signAllTransactions: wallet.signAllTransactions || false,
    };

    const inco = createIncoClient({ wallet: serverWallet });

    const amountBigInt = BigInt(amount);
    const encryptedAmount = await encryption.encryptValue(amountBigInt);

    const txSig = await inco.transfer({
      to,
      amount: encryptedAmount,
      memo: memo || "",
    });

    res.json({ success: true, txSig });
  } catch (err) {
    console.error("Transfer error:", err);
    res.status(500).json({ error: err.message || "Transfer failed" });
  }
});

module.exports = router;
