import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { RootStackParamList } from './types';
import { ThemeProvider } from '@/theme';
import { useAuthStore } from '@/store/authStore';
import tokens from '@/theme/tokens';
import MainScreen from '@/screens/main/MainScreen';
import AuthNavigator from './AuthNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Dev-only screens — conditional require so Metro strips them in production builds.
let DevMenuScreen: React.ComponentType | null = null;
let DesignSystemPreviewScreen: React.ComponentType | null = null;

if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  DevMenuScreen = require('@/screens/dev/DevMenu').default;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  DesignSystemPreviewScreen = require('@/screens/dev/DesignSystemPreview').default;
}

export default function RootNavigator() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const isRestoring = useAuthStore(s => s.isRestoring);
  const restoreSession = useAuthStore(s => s.restoreSession);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  if (isRestoring) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={tokens.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
              <>
                <Stack.Screen name="Main" component={MainScreen} />
                {DevMenuScreen && (
                  <Stack.Screen
                    name="DevMenu"
                    component={DevMenuScreen}
                    options={{ title: 'Developer' }}
                  />
                )}
                {DesignSystemPreviewScreen && (
                  <Stack.Screen
                    name="DesignSystemPreview"
                    component={DesignSystemPreviewScreen}
                    options={{ title: 'Design System' }}
                  />
                )}
              </>
            ) : (
              <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.background,
  },
});
