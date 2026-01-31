import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import transferRoute from "./routes/transfer.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/transfer", transferRoute);

app.get("/", (_, res) => {
  res.send("✅ Phosyn Inco backend running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
