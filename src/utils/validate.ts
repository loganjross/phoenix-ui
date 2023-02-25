import { Connection } from "@solana/web3.js";

/**
 * Validates a given RPC URL
 *
 * @param rpcUrl The RPC URL to validate
 */
export async function validateRpcUrl(rpcUrl: string) {
  if (!rpcUrl.includes("http")) return false;

  try {
    const connection = new Connection(rpcUrl);
    await connection.getVersion();
    return true;
  } catch (err) {
    return false;
  }
}
