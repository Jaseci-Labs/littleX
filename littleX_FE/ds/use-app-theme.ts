"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

export interface UseAppThemeReturn {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
  toggleTheme: () => void;
  isLoaded: boolean;
}

export function useAppTheme(): UseAppThemeReturn {
  const { theme, setTheme, systemTheme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle hydration mismatch by waiting for client-side rendering
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Determine if the current theme is dark
  const isDark =
    isLoaded &&
    (theme === "dark" || (theme === "system" && systemTheme === "dark"));

  // Determine if the current theme is light
  const isLight =
    isLoaded &&
    (theme === "light" || (theme === "system" && systemTheme === "light"));

  // Determine if using system theme
  const isSystem = isLoaded && theme === "system";

  // Toggle between light and dark themes
  const toggleTheme = () => {
    if (isDark) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return {
    theme: (theme as ThemeMode) || "system",
    setTheme: (newTheme: ThemeMode) => setTheme(newTheme),
    isDark,
    isLight,
    isSystem,
    toggleTheme,
    isLoaded,
  };
}
