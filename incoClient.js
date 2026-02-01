import { encryptValue } from "https://esm.sh/@inco/lightning-sdk";

export async function encryptAmount(amount) {
  return encryptValue(BigInt(amount));
}
