import React, { useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View, ActivityIndicator } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';

import RootNavigator from '@/navigation/RootNavigator';
import queryClient from '@/api/queryClient';
import tokens from '@/theme/tokens';
import logger from '@/utils/logger';

// Controls how a notification is presented while the app is in the foreground.
// Without this, foreground notifications are received but never shown to the user.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'AncizarSerif-Regular': require('./assets/fonts/AncizarSerif-Regular.ttf'),
    'AncizarSerif-Bold': require('./assets/fonts/AncizarSerif-Bold.ttf'),
    'AncizarSerif-Italic': require('./assets/fonts/AncizarSerif-Italic.ttf'),
    'AncizarSerif-BoldItalic': require('./assets/fonts/AncizarSerif-BoldItalic.ttf'),
  });

  // Android 8+ requires notifications to belong to a channel, or they arrive silent/
  // low-priority. This matches the `defaultChannel: 'default'` set in app.config.ts's
  // expo-notifications plugin config — that only tells FCM which channel ID to default
  // to, it doesn't create the channel itself, which is why this still has to happen here.
  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.DEFAULT,
      }).catch(error => {
        logger.error('[App] Failed to set up Android notification channel', error);
      });
    }
  }, []);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar barStyle="dark-content" backgroundColor={tokens.colors.background} />
      <RootNavigator />
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
