import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const decorators = [
  (Story) => (
    <SafeAreaProvider>
      <Story />
    </SafeAreaProvider>
  ),
];

export const parameters = {};
