// incoClient.js
import { Connection, clusterApiUrl } from "@solana/web3.js";
// Explicitly import the ESM build to avoid Node CJS/ESM issues
import * as IncoSDK from "@inco/solana-sdk/dist/esm/src/index.js";

const { Client, encryption } = IncoSDK;

const network = process.env.SOLANA_NETWORK || "devnet";
const programId = process.env.INCO_PROGRAM_ID;

export function createIncoClient({ wallet }) {
  const connection = new Connection(
    clusterApiUrl(network),
    "confirmed"
  );

  // Client is a factory function in latest SDK
  return Client({
    network,
    wallet,
    connection,
    programId
  });
}

export { encryption };
