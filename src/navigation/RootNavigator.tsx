import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { RootStackParamList } from './types';
import { ThemeProvider } from '@/theme';
import { useAuthStore } from '@/store/authStore';
import tokens from '@/theme/tokens';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import DesignSystemPreviewScreen from '@/screens/dev/DesignSystemPreview';
import CampaignDetailsScreen from '@/screens/campaigns/CampaignDetailsScreen';
import AutomationRunHistoryScreen from '@/screens/campaigns/AutomationRunHistoryScreen';
import GuestProfileScreen from '@/screens/guests/GuestProfileScreen';
import ReportViewerScreen from '@/screens/reports/ReportViewerScreen';
import AuditTrailScreen from '@/screens/audit-trail/AuditTrailScreen';
import { navigationRef } from './navigationRef';
import { useNotificationListeners } from '@/hooks/notifications/useNotificationListeners';
import { useBadgeSync } from '@/hooks/notifications/useBadgeSync';
import { usePushRegistration } from '@/hooks/notifications/usePushRegistration';

const Stack = createNativeStackNavigator<RootStackParamList>();

// We use a static import because dynamic require() breaks Fast Refresh.
// The screen is only rendered conditionally below when __DEV__ is true.

export default function RootNavigator() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const isRestoring = useAuthStore(s => s.isRestoring);
  const restoreSession = useAuthStore(s => s.restoreSession);

  useNotificationListeners();
  useBadgeSync();

  const { mutate: registerPushToken } = usePushRegistration();

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  // Runs on every app open that ends up authenticated, not just a fresh login — a user who
  // denied (or hadn't yet answered) the iOS permission prompt at login time would otherwise
  // never get a push token, since a fresh login is the only other trigger for this and most
  // users log in once and stay logged in indefinitely.
  useEffect(() => {
    if (isAuthenticated) {
      registerPushToken();
    }
  }, [isAuthenticated, registerPushToken]);

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
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
              <>
                <Stack.Screen name="Main" component={AppNavigator} />
                <Stack.Screen name="CampaignDetails" component={CampaignDetailsScreen} />
                <Stack.Screen name="AutomationRunHistory" component={AutomationRunHistoryScreen} />
                <Stack.Screen name="GuestProfile" component={GuestProfileScreen} />
                <Stack.Screen name="AuditTrail" component={AuditTrailScreen} />
                <Stack.Screen name="ReportViewer" component={ReportViewerScreen} />
                {__DEV__ && (
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
