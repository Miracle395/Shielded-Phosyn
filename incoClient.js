// incoClient.js
const { createClient, encryption } = require("@inco/solana-sdk");
const { Connection, clusterApiUrl } = require("@solana/web3.js");

const network = process.env.SOLANA_NETWORK || "devnet";
const programId = process.env.INCO_PROGRAM_ID;

function createIncoClient({ wallet }) {
  const connection = new Connection(
    clusterApiUrl(network),
    "confirmed"
  );

  return createClient({
    network,
    wallet,
    connection,
    programId
  });
}

module.exports = {
  createIncoClient,
  encryption
};
