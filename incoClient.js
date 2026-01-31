import { Connection, clusterApiUrl } from "@solana/web3.js";
import { Client } from "@inco/solana-sdk";

const network = process.env.SOLANA_NETWORK;
const programId = process.env.INCO_PROGRAM_ID;

export function createIncoClient({ wallet }) {
  const connection = new Connection(
    clusterApiUrl(network),
    "confirmed"
  );

  return new Client({
    network,
    wallet,
    connection,
    programId
  });
}
