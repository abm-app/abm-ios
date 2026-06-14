import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';

import tokens, { type Tokens } from './tokens';

SplashScreen.preventAutoHideAsync();

interface ThemeContextValue {
  tokens: Tokens;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [fontsLoaded] = useFonts({
    // Ancizar Serif — local assets (require required by expo-font for .ttf assets)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'AncizarSerif-Regular': require('../../assets/fonts/AncizarSerif-Regular.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'AncizarSerif-Italic': require('../../assets/fonts/AncizarSerif-Italic.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'AncizarSerif-Bold': require('../../assets/fonts/AncizarSerif-Bold.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'AncizarSerif-BoldItalic': require('../../assets/fonts/AncizarSerif-BoldItalic.ttf'),
    // Inter — Google Fonts via @expo-google-fonts/inter
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const value = useMemo(() => ({ tokens }), []);

  if (!fontsLoaded) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTokens(): Tokens {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTokens must be used within a ThemeProvider');
  }
  return context.tokens;
}
