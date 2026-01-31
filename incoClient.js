// incoClient.js
import pkg from "@inco/solana-sdk"; // CommonJS import for Node ESM
const { Client, encryption } = pkg;

import { Connection, clusterApiUrl } from "@solana/web3.js";

// Default to devnet if not set
const NETWORK = process.env.SOLANA_NETWORK || "devnet";
const PROGRAM_ID = process.env.INCO_PROGRAM_ID || "YourProgramIdHere";

/**
 * Returns a new Inco Client instance for a given wallet
 * @param {Object} params
 * @param {Object} params.wallet - Solana wallet object
 * @returns {Client}
 */
export function createIncoClient({ wallet }) {
  const connection = new Connection(clusterApiUrl(NETWORK), "confirmed");

  return new Client({
    network: NETWORK,
    wallet,
    connection,
    programId: PROGRAM_ID,
  });
}

// Export encryption helper if needed
export { encryption };
