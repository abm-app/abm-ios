import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';

import ENV from '@/config/env';
import RootNavigator from '@/navigation/RootNavigator';
import queryClient from '@/api/queryClient';

let AppEntry: React.ComponentType;

if (ENV.STORYBOOK_ENABLED) {
  AppEntry = require('./.rnstorybook').default;
} else {
  AppEntry = RootNavigator;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'AncizarSerif-Regular': require('./assets/fonts/AncizarSerif-Regular.ttf'),
    'AncizarSerif-Bold': require('./assets/fonts/AncizarSerif-Bold.ttf'),
    'AncizarSerif-Italic': require('./assets/fonts/AncizarSerif-Italic.ttf'),
    'AncizarSerif-BoldItalic': require('./assets/fonts/AncizarSerif-BoldItalic.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppEntry />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
