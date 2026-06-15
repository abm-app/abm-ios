import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { RootStackParamList } from './types';
import { ThemeProvider } from '@/theme';
import MainScreen from '@/screens/main/MainScreen';
import DevMenu from '@/screens/dev/DevMenu';
import DesignSystemPreview from '@/screens/dev/DesignSystemPreview';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
            {__DEV__ && (
              <>
                <Stack.Screen name="DevMenu" component={DevMenu} options={{ title: 'Developer' }} />
                <Stack.Screen
                  name="DesignSystemPreview"
                  component={DesignSystemPreview}
                  options={{ title: 'Design System' }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
