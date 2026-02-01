// incoClient.js
const pkg = require("@inco/solana-sdk"); // CommonJS
const { Client, encryption } = pkg;

const { Connection, clusterApiUrl } = require("@solana/web3.js");

const network = process.env.SOLANA_NETWORK || "devnet";
const programId = process.env.INCO_PROGRAM_ID || "YourProgramIdHere";

function createIncoClient({ wallet }) {
  const connection = new Connection(clusterApiUrl(network), "confirmed");

  return new Client({
    network,
    wallet,
    connection,
    programId,
  });
}

module.exports = { createIncoClient, encryption };
