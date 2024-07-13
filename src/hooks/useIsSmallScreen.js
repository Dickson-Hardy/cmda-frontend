import { useEffect, useState } from "react";

export function useIsSmallScreen(query) {
  const [isSmallScreen, setIsSmallScreen] = useState(window.matchMedia(`(max-width: ${query})`).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${query})`);

    const handleResize = () => setIsSmallScreen(mediaQuery.matches);

    // Set the event listener for screen size changes
    mediaQuery.addEventListener("change", handleResize);

    // Clean up the event listener on unmount
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, [query]);

  return isSmallScreen;
}
