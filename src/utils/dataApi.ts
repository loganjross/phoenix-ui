import { Cluster } from "@solana/web3.js";

import { MS_PER_SECOND } from "./time";

const API_KEY = process.env.REACT_APP_API_KEY || "";
if (!API_KEY) {
  throw Error(
    "REACT_APP_API_KEY is undefined, please add it to the .env file."
  );
}

export type MarketEndpoint =
  | "get-market-volume"
  | "get-top-of-book"
  | "get-market-trade-list"
  | "get-top-trades"
  | "get-top-makers"
  | "get-historical-prices";

export type TraderEndpoint =
  | "get-volume-for-trader"
  | "get-trade-history"
  | "get-fees-paid-for-trader";

/**
 * Returns the base API URL for a given cluster
 */
function getBaseApiUrl(cluster?: Cluster) {
  return `https://api.${
    cluster === "devnet" ? "devnet" : "mainnet"
  }.phoenix-v1.com`;
}

/**
 * Fetches market data from all endpoints in the Phoenix Data API
 *
 * @param cluster Cluster to fetch data from
 * @param address Market address
 */
export async function fetchApiMarketData<T>(
  endpoint: MarketEndpoint,
  cluster: Cluster,
  address: string,
  start: number | null,
  end: number | null,
  extraParams: string = ""
): Promise<T> {
  const timeframeQuery = start
    ? `&start_timestamp=${Math.floor(
        start / MS_PER_SECOND
      )}&end_timestamp=${Math.floor(end ? end / MS_PER_SECOND : Date.now())}`
    : "";
  const res = await fetch(
    `${getBaseApiUrl(
      cluster
    )}/${endpoint}?market=${address}${timeframeQuery}${extraParams}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
    }
  );

  return await res.json();
}

/**
 * Fetches trader data from all endpoints in the Phoenix Data API
 *
 * @param cluster Cluster to fetch data from
 * @param address The trader address
 * @param marketAddress Market address
 */
export async function fetchApiTraderData<T>(
  endpoint: TraderEndpoint,
  cluster: Cluster,
  address: string,
  marketAddress: string,
  start: number | null,
  end: number | null,
  extraParams: string = ""
): Promise<T> {
  const timeframeQuery =
    start && end
      ? `&start_timestamp=${Math.floor(
          start / MS_PER_SECOND
        )}&end_timestamp=${Math.floor(end / MS_PER_SECOND)}`
      : start || end
      ? `&timestamp=${start || end}`
      : "";
  const res = await fetch(
    `${getBaseApiUrl(
      cluster
    )}/${endpoint}?trader=${address}&market=${marketAddress}${timeframeQuery}${extraParams}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
    }
  );

  return await res.json();
}
