// incoClient.js
const pkg = require("@inco/solana-sdk");
const { Client, encryption } = pkg;

const { Connection, clusterApiUrl } = require("@solana/web3.js");

const network = process.env.SOLANA_NETWORK || "devnet";
const programId = process.env.INCO_PROGRAM_ID;

function createIncoClient({ wallet }) {
  const connection = new Connection(
    clusterApiUrl(network),
    "confirmed"
  );

  // ✅ IMPORTANT: Client is a FACTORY, not a constructor
  return Client({
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
