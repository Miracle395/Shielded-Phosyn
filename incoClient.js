import { Connection, clusterApiUrl } from "@solana/web3.js";
import pkg from "@inco/solana-sdk";

const { Client, encryption } = pkg;

export { encryption };

export function createIncoClient({ wallet }) {
  const network = process.env.SOLANA_NETWORK;
  const programId = process.env.INCO_PROGRAM_ID;

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
