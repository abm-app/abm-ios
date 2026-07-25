import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { MenuStackParamList } from './types';
import MenuScreen from '@/screens/menu/MenuScreen';
import RevenueScreen from '@/screens/revenue/RevenueScreen';
import UserManagementScreen from '@/screens/user-management/UserManagementScreen';
import LoyaltyConfigScreen from '@/screens/loyalty/LoyaltyConfigScreen';

// ─── Stack Navigator ─────────────────────────────────────────────────────────

const Stack = createNativeStackNavigator<MenuStackParamList>();

export default function MenuNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MenuHome" component={MenuScreen} />
      <Stack.Screen name="RevenueAnalytics" component={RevenueScreen} />
      <Stack.Screen name="UserManagement" component={UserManagementScreen} />
      <Stack.Screen name="LoyaltyConfiguration" component={LoyaltyConfigScreen} />
    </Stack.Navigator>
  );
}
