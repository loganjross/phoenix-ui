import { Cluster, PublicKey } from "@solana/web3.js";

export type Explorer =
  | "Solana Explorer"
  | "Solscan"
  | "Solana Beach"
  | "Solana FM";
export const explorerOptions: Array<{
  name: Explorer;
  logoUri: string;
}> = [
  {
    name: "Solana Explorer",
    logoUri:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
  { name: "Solscan", logoUri: "https://public-api.solscan.io/logo.png" },
  {
    name: "Solana Beach",
    logoUri:
      "https://assets-global.website-files.com/6364e65656ab107e465325d2/637adcf5fa17b74dc65e5d1d_WEK9dEnl4oNDB85bhe4UvHpRBh8ck_Uu5mnGQjiEMtg.jpeg",
  },
  {
    name: "Solana FM",
    logoUri:
      "https://pbs.twimg.com/profile_images/1603277783542558720/m838ShBK_400x400.jpg",
  },
];

export function getExplorerTxUrl(
  explorer: Explorer,
  txId: string,
  cluster?: Cluster
): string {
  switch (explorer) {
    case "Solana Explorer":
      return `https://explorer.solana.com/tx/${txId}${
        cluster && cluster !== "mainnet-beta" ? `?cluster=${cluster}` : ""
      }`;
    case "Solscan":
      return `https://solscan.io/tx/${txId}${
        cluster && cluster !== "mainnet-beta" ? `?cluster=${cluster}` : ""
      }`;
    case "Solana Beach":
      return `https://solanabeach.io/transaction/${txId}${
        cluster && cluster !== "mainnet-beta" ? `?cluster=${cluster}` : ""
      }`;
    case "Solana FM":
      return `https://solana.fm/tx/${txId}${
        cluster && cluster !== "mainnet-beta" ? `?cluster=${cluster}` : ""
      }`;
    default:
      return "";
  }
}

export function getExplorerAccountUrl(
  explorer: Explorer,
  pubkey: string | PublicKey,
  cluster?: Cluster
): string {
  const address = pubkey.toString();
  switch (explorer) {
    case "Solana Explorer":
      return `https://explorer.solana.com/address/${address}${
        cluster && cluster !== "mainnet-beta" ? `?cluster=${cluster}` : ""
      }`;
    case "Solscan":
      return `https://solscan.io/account/${address}${
        cluster && cluster !== "mainnet-beta" ? `?cluster=${cluster}` : ""
      }`;
    case "Solana Beach":
      return `https://solanabeach.io/address/${address}${
        cluster && cluster !== "mainnet-beta" ? `?cluster=${cluster}` : ""
      }`;
    case "Solana FM":
      return `https://solana.fm/address/${address}${
        cluster && cluster !== "mainnet-beta" ? `?cluster=${cluster}` : ""
      }`;
    default:
      return "";
  }
}

export function getExplorerTokenUrl(
  explorer: Explorer,
  mint: string | PublicKey,
  cluster?: Cluster
): string {
  const tokenMint = mint.toString();
  switch (explorer) {
    case "Solana Explorer":
      return `https://explorer.solana.com/address/${tokenMint}${
        cluster && cluster !== "mainnet-beta" ? `?cluster=${cluster}` : ""
      }`;
    case "Solscan":
      return `https://solscan.io/token/${tokenMint}${
        cluster && cluster !== "mainnet-beta" ? `?cluster=${cluster}` : ""
      }`;
    case "Solana Beach":
      return `https://solanabeach.io/token/${tokenMint}${
        cluster && cluster !== "mainnet-beta" ? `?cluster=${cluster}` : ""
      }`;
    case "Solana FM":
      return `https://solana.fm/address/${tokenMint}${
        cluster && cluster !== "mainnet-beta" ? `?cluster=${cluster}` : ""
      }`;
    default:
      return "";
  }
}

/**
 * Opens a transaction in an Explorer
 *
 * @param txId Transaction ID
 * @param explorer Explorer to use
 * @param cluster Cluster to the transaction is on (Optional)
 */
export function openTxInExplorer(
  txId: string,
  explorer: Explorer,
  cluster: Cluster
) {
  window.open(
    getExplorerTxUrl(explorer, txId, cluster),
    "_blank",
    "noopener noreferrer"
  );
}

/**
 * Opens an account in an Explorer
 *
 * @param pubkey Account's public key
 * @param explorer Explorer to use
 * @param cluster Cluster to the transaction is on (Optional)
 */
export function openAccountInExplorer(
  pubkey: string | PublicKey,
  explorer: Explorer,
  cluster: Cluster
) {
  window.open(
    getExplorerAccountUrl(explorer, pubkey, cluster),
    "_blank",
    "noopener noreferrer"
  );
}

/**
 * Opens a token in an Explorer
 *
 * @param mint The token's mint address
 * @param explorer Explorer to use
 * @param cluster Cluster to the token is on (Optional)
 */
export function openTokenInExplorer(
  mint: string | PublicKey,
  explorer: Explorer,
  cluster: Cluster
) {
  window.open(
    getExplorerTokenUrl(explorer, mint, cluster),
    "_blank",
    "noopener noreferrer"
  );
}
