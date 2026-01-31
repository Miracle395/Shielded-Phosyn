// incoClient.js
import pkg from "@inco/solana-sdk"; // <-- import the CommonJS module as default
const { Client, encryption } = pkg;

import { Connection, clusterApiUrl } from "@solana/web3.js";

const network = process.env.SOLANA_NETWORK || "devnet";
const programId = process.env.INCO_PROGRAM_ID || "YourProgramIdHere";

export function createIncoClient({ wallet }) {
  const connection = new Connection(clusterApiUrl(network), "confirmed");

  return new Client({
    network,
    wallet,
    connection,
    programId,
  });
}

export { encryption };
