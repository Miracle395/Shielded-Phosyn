import { Connection, clusterApiUrl } from "@solana/web3.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Force CommonJS load
const incoSdk = require("@inco/solana-sdk");

const { Client, encryption } = incoSdk;

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
