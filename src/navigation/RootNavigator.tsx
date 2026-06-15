import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { RootStackParamList } from './types';
import { ThemeProvider } from '@/theme';
import MainScreen from '@/screens/main/MainScreen';

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
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
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
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
