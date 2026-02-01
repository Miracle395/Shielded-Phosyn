// index.js
import express from "express";
import cors from "cors";

import transferRoute from "./routes/transfer.js";

const app = express();
const PORT = process.env.PORT || 3000;

/* ================================
   MIDDLEWARE
================================ */

app.use(cors());
app.use(express.json());

/* ================================
   ROUTES
================================ */

app.use("/api/transfer", transferRoute);

/* ================================
   HEALTH CHECK
================================ */

app.get("/", (req, res) => {
  res.send("Phosyn backend running 🛡️");
});

/* ================================
   START SERVER
================================ */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
