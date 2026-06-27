import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';

import logger from '@/utils/logger';
import tokens, { type Tokens } from './tokens';

import ancizarRegular from '../../assets/fonts/AncizarSerif-Regular.ttf';
import ancizarItalic from '../../assets/fonts/AncizarSerif-Italic.ttf';
import ancizarBold from '../../assets/fonts/AncizarSerif-Bold.ttf';
import ancizarBoldItalic from '../../assets/fonts/AncizarSerif-BoldItalic.ttf';

void SplashScreen.preventAutoHideAsync().catch(() => {});

interface ThemeContextValue {
  tokens: Tokens;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [fontsLoaded, fontError] = useFonts({
    // Ancizar Serif — local assets
    'AncizarSerif-Regular': ancizarRegular,
    'AncizarSerif-Italic': ancizarItalic,
    'AncizarSerif-Bold': ancizarBold,
    'AncizarSerif-BoldItalic': ancizarBoldItalic,
    // Inter — Google Fonts via @expo-google-fonts/inter
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  const value = useMemo(() => ({ tokens }), []);

  if (fontError) {
    logger.warn('[ThemeContext] Font loading failed:', fontError.message);
  }

  if (!fontsLoaded && !fontError) {
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
