import { useEffect, useState } from "react";

export function useIsSmallScreen(query) {
  const [isSmallScreen, setIsSmallScreen] = useState(window.matchMedia(`(max-width: ${query})`).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 750px)");

    const handleResize = () => setIsSmallScreen(mediaQuery.matches);

    // Add the event listener on initial render and cleanup on unmount
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return isSmallScreen;
}
