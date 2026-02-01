import {
  Client,
  encryption
} from "https://esm.sh/@inco/solana-sdk";

import {
  Connection,
  clusterApiUrl
} from "https://esm.sh/@solana/web3.js";

export async function createIncoClient(wallet) {
  const connection = new Connection(
    clusterApiUrl("devnet"),
    "confirmed"
  );

  return new Client({
    network: "devnet",
    wallet,
    connection,
  });
}

export { encryption };
