// inco.js
import { Client, encryption } from "https://cdn.jsdelivr.net/npm/@inco/solana-sdk@latest/dist/esm/src/index.js";
import { Connection, clusterApiUrl } from "https://cdn.jsdelivr.net/npm/@solana/web3.js@1.98.0/lib/index.iife.min.js";

const NETWORK = "devnet"; // or mainnet
const PROGRAM_ID = "YourProgramIdHere"; // set your Inco program ID

export function createIncoClient(wallet) {
  const connection = new Connection(clusterApiUrl(NETWORK), "confirmed");
  return new Client({
    network: NETWORK,
    wallet,
    connection,
    programId: PROGRAM_ID,
  });
}

export { encryption };
