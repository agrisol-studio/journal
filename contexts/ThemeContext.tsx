import React, { createContext, useContext } from 'react';
import themes from '@/constants/themes';

const themeMap: Record<string, any> = themes;
const ThemeContext = createContext(themes.melior);

export function ThemeProvider({ affiliation, children }: { affiliation?: string; children: React.ReactNode }) {
  const normalizedAffiliation = affiliation?.toLowerCase();
  const theme = normalizedAffiliation && themeMap[normalizedAffiliation] ? themeMap[normalizedAffiliation] : themes.neutral;
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
} 