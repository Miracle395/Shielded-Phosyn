// incoClient.js
import pkg from "@inco/solana-sdk";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import fs from "fs";

const { Client, encryption } = pkg;

/* ================================
   CONFIG
================================ */

const network = process.env.SOLANA_NETWORK || "devnet";
const programId = process.env.INCO_PROGRAM_ID;

// Load server authority keypair
const keypairPath = process.env.SERVER_KEYPAIR_PATH || "./server-keypair.json";
const secret = JSON.parse(fs.readFileSync(keypairPath, "utf8"));
const authority = Keypair.fromSecretKey(Uint8Array.from(secret));

const connection = new Connection(
  clusterApiUrl(network),
  "confirmed"
);

/* ================================
   CLIENT FACTORY
================================ */

export function createIncoClient() {
  return new Client({
    network,
    connection,
    programId,
    wallet: authority, // ✅ server authority only
  });
}

export { encryption };
