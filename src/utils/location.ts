export const BANNED_COUNTRY_CODES = ["US"];

/**
 * Checks if the user is located in a banned country.
 */
export async function checkUserLocation(): Promise<boolean> {
  const res = await fetch("https://ipapi.co/json");
  const data = await res.json();
  if (
    BANNED_COUNTRY_CODES.includes(data.country) ||
    BANNED_COUNTRY_CODES.includes(data.country_code) ||
    BANNED_COUNTRY_CODES.includes(data.country_code_iso3)
  ) {
    return true;
  }

  return false;
}
