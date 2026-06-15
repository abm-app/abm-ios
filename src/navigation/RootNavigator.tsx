import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { RootStackParamList } from './types';
import MainScreen from '@/screens/main/MainScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function DevScreens() {
  // Lazy-load dev-only screens so they are not bundled in production builds.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DevMenu = require('@/screens/dev/DevMenu').default;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DesignSystemPreview = require('@/screens/dev/DesignSystemPreview').default;

  return (
    <>
      <Stack.Screen name="DevMenu" component={DevMenu} options={{ title: 'Developer' }} />
      <Stack.Screen
        name="DesignSystemPreview"
        component={DesignSystemPreview}
        options={{ title: 'Design System' }}
      />
    </>
  );
}

export default function RootNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
          {__DEV__ ? <DevScreens /> : null}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
