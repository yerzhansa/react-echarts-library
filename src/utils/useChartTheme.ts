"use client";

import { useEffect, useState } from "react";

export type ChartTheme = "light" | "dark";

/**
 * React hook that returns a chart theme synced to the OS `prefers-color-scheme`
 * media query. Pass an `override` to force a value; otherwise the hook reacts
 * to system theme changes.
 *
 * SSR-safe: returns `'light'` on the server, then corrects on hydration.
 *
 * @example
 * ```tsx
 * function ThemedChart() {
 *   const theme = useChartTheme();   // reacts to OS dark-mode toggle
 *   return <EChartsReact option={option} theme={theme} />;
 * }
 * ```
 */
export function useChartTheme(override?: ChartTheme): ChartTheme {
  const [systemTheme, setSystemTheme] = useState<ChartTheme>(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return "light";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };
    // `addEventListener` is the modern API; `addListener` is the legacy fallback.
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    mql.addListener(handler);
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    return () => mql.removeListener(handler);
  }, []);

  return override ?? systemTheme;
}
