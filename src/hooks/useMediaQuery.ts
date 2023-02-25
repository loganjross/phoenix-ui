import { useEffect, useState } from "react";

/**
 * Returns true if the screen width is <= to the given value.
 *
 * @param screenWidth The target screen width
 */
export function useMediaQuery(screenWidth: number): boolean {
  const [matches, setMatches] = useState(true);

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    const mediaQueryList = window.matchMedia(`(min-width: ${screenWidth}px)`);
    mediaQueryList.addEventListener("change", handler);

    setMatches(mediaQueryList.matches);

    return () => mediaQueryList.removeEventListener("change", handler);
  }, [screenWidth]);

  return !matches;
}
