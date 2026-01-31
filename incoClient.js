// incoClient.js
import { Connection, clusterApiUrl } from "@solana/web3.js";
import pkg from "@inco/solana-sdk";

const { Client, encryption } = pkg;

const network = process.env.SOLANA_NETWORK || "devnet";
const programId = process.env.INCO_PROGRAM_ID;

export function createIncoClient({ wallet }) {
  const connection = new Connection(
    clusterApiUrl(network),
    "confirmed"
  );

  // Note: Client is now a factory function, not a class
  return Client({
    network,
    wallet,
    connection,
    programId
  });
}

export { encryption };
