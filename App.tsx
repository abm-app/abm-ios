import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import ENV from '@/config/env';
import { ThemeProvider } from '@/theme';

function MainApp() {
  return (
    <ThemeProvider>
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

let AppEntry: React.ComponentType = MainApp;

if (ENV.STORYBOOK_ENABLED) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AppEntry = require('./.rnstorybook').default;
}

export default AppEntry;
