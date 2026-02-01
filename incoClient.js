// incoClient.js
import { createRequire } from "module";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import fs from "fs";

const require = createRequire(import.meta.url);

// 🔥 FORCE ESM ENTRY
const incoPkg = await import("@inco/solana-sdk/dist/esm/src/index.js");

const { createClient, encryption } = incoPkg;

/* ================================
   CONFIG
================================ */

const network = process.env.SOLANA_NETWORK || "devnet";
const programId = process.env.INCO_PROGRAM_ID;

if (!programId) {
  throw new Error("INCO_PROGRAM_ID missing");
}

const keypairPath = process.env.SERVER_KEYPAIR_PATH || "./server-keypair.json";
const secret = JSON.parse(fs.readFileSync(keypairPath, "utf8"));
const authority = Keypair.fromSecretKey(Uint8Array.from(secret));

const connection = new Connection(clusterApiUrl(network), "confirmed");

/* ================================
   CLIENT
================================ */

export function createIncoClient() {
  return createClient({
    network,
    connection,
    programId,
    wallet: authority
  });
}

export { encryption };
