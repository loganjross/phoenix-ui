import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

import { DEFAULT_RPC_ENDPOINTS } from "../providers/SettingsProvider";
import { validateRpcUrl } from "./validate";

export const COMPUTE_UNIT_LIMIT = 1000000;
export const MICROLAMPORTS_PER_LAMPORT = 1000000;
export const MICROLAMPORTS_PER_SOL =
  LAMPORTS_PER_SOL * MICROLAMPORTS_PER_LAMPORT;

/**
 * Returns the average tps over the last 15 samples for a given endpoint
 *
 * @param rpcEndoint The rpc endpoint to query
 */
export async function getAveTps(rpcEndoint: string) {
  const isValid = await validateRpcUrl(rpcEndoint);
  if (!isValid) return 0;

  const connection = new Connection(rpcEndoint, "confirmed");
  try {
    const samples = await connection.getRecentPerformanceSamples(15);
    const totalTps = samples.reduce((acc, val) => {
      return acc + val.numTransactions / val.samplePeriodSecs;
    }, 0);
    const aveTps = Math.round(totalTps / samples.length);
    return aveTps;
  } catch (err) {
    console.error(`Error getting tps for ${connection.rpcEndpoint}: `, err);
    return 0;
  }
}

/**
 * Checks to make sure a given account pubkey is valid
 *
 * @param pubkey The `PublicKey` to check
 */
export async function checkAccountPubkey(pubkey: PublicKey | string) {
  if (typeof pubkey === "string") {
    pubkey = new PublicKey(pubkey);
  }

  const connection = new Connection(
    DEFAULT_RPC_ENDPOINTS["mainnet-beta"],
    "confirmed"
  );

  let isValid = false;
  try {
    const accountInfo = await connection.getAccountInfo(pubkey);
    isValid = accountInfo !== null;
  } catch {}

  return isValid;
}
