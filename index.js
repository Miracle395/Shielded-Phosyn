// index.js
import express from "express";
import cors from "cors";
import transferRoute from "./routes/transfer.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/transfer", transferRoute);

app.get("/", (_, res) => {
  res.send("🛡️ Phosyn backend running");
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on ${PORT}`);
});
