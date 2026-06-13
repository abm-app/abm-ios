import React from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

function MainApp() {
  const [fontsLoaded] = useFonts({
    'AncizarSerif-Regular': require('./assets/fonts/AncizarSerif-Regular.ttf'),
    'AncizarSerif-Italic': require('./assets/fonts/AncizarSerif-Italic.ttf'),
    'AncizarSerif-Bold': require('./assets/fonts/AncizarSerif-Bold.ttf'),
    'AncizarSerif-BoldItalic': require('./assets/fonts/AncizarSerif-BoldItalic.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
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

if (process.env.STORYBOOK_ENABLED === 'true') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AppEntry = require('./.storybook').default;
}

export default AppEntry;
