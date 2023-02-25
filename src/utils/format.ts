import { PublicKey } from "@solana/web3.js";

import { MS_PER_SECOND } from "./time";

export const ONE_BILLION = 1000000000;
export const ONE_MILLION = 1000000;
export const ONE_THOUSAND = 1000;

/**
 * Format a public key to a shortened string
 *
 * @param publicKey Public key to format
 * @param halfLength Character length to retain on each side (default: 4)
 */
export function formatPubkey(
  publicKey: string | PublicKey,
  halfLength = 4
): string {
  return `${publicKey.toString().substring(0, halfLength)}...${publicKey
    .toString()
    .substring(publicKey.toString().length - halfLength)}`;
}

/**
 * Returns a formatted string representation of a number.
 *
 * @param value Number to format
 * @param decimals Number of decimal places to retain (default: 3)
 * @param isDollars Whether to format value as USD (default: false)
 */
export function formatNumberToString(
  value: number,
  decimals = 3,
  isDollars = false
): string {
  let numString = value.toLocaleString(undefined, {
    minimumFractionDigits: isDollars ? 2 : decimals,
    maximumFractionDigits: isDollars ? 2 : decimals,
  });

  return isDollars ? `$${numString}` : numString;
}

/**
 * Abbreviates large totals. For USDC/USDT, the total is formatted as $; for other quote tokens, the total is suffixed with units.
 *
 * @param value The total to abbreviate
 * @param isDollars Whether to format value as USD (default: false)
 */
export function abbreviateTotal(value: number, isDollars = false): string {
  let abbrev = "";
  let strValue = "";
  if (value > ONE_BILLION) {
    abbrev = "B";
    value /= ONE_BILLION;
  }
  if (value > ONE_MILLION) {
    abbrev = "M";
    value /= ONE_MILLION;
  }
  if (value > ONE_THOUSAND) {
    abbrev = "K";
    value /= ONE_THOUSAND;
  }

  strValue = value.toFixed(1);
  while (strValue.endsWith("0") || strValue.endsWith(".")) {
    strValue = strValue.slice(0, -1);
  }

  return `${isDollars ? "$" : ""}${strValue}${abbrev}`;
}

/**
 * Returns a formatted date string from a given unix timestamp
 *
 * @param timestamp The timestamp
 */
export function formatDate(timestamp: number): {
  date: string;
  time: string;
} {
  const date = new Date(timestamp * MS_PER_SECOND);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();
  const seconds = "0" + date.getSeconds();

  return {
    date: `${month}/${day}/${year}`,
    time: `${hours % 12 || 12}:${minutes.substr(-2)}:${seconds.substr(-2)} ${
      hours < 12 ? "AM" : "PM"
    }`,
  };
}
