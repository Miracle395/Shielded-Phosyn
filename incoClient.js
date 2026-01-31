// incoClient.js
import { Client, encryption } from "@inco/solana-sdk";
import { Connection, clusterApiUrl } from "@solana/web3.js";

const network = process.env.SOLANA_NETWORK;
const programId = process.env.INCO_PROGRAM_ID;

/**
 * Creates a new Inco client instance for private transfers.
 * @param {Object} options
 * @param {Object} options.wallet - Wallet adapter with publicKey & signing functions
 * @returns {Client} Inco client
 */
export function createIncoClient({ wallet }) {
  const connection = new Connection(clusterApiUrl(network), "confirmed");

  return new Client({
    network,
    wallet,
    connection,
    programId,
  });
}

// Export encryption helper
export { encryption };
