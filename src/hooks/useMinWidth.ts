import { useEffect, useState } from "react";

const BREAKPOINTS = {
  sm: 40,  // 40rem  = 640px
  md: 48,  // 48rem  = 768px
  lg: 64,  // 64rem  = 1024px
  xl: 80,  // 80rem  = 1280px
  "2xl": 96, // 96rem = 1536px
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

const useMinWidth = (breakpoint: Breakpoint) => {
  const rem = BREAKPOINTS[breakpoint];
  const [matches, setMatches] = useState(
    typeof window !== "undefined"
      ? window.matchMedia(`(min-width: ${rem}rem)`).matches
      : false
  );

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${rem}rem)`);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [rem]);

  return matches;
};
export default useMinWidth
