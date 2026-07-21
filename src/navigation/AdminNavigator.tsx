import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import tokens from '@/theme/tokens';
import type { AdminStackParamList } from './types';
import AdminScreen from '@/screens/admin/AdminScreen';

// ─── Placeholder screens for nested routes ───────────────────────────────────

function createSimplePlaceholder(title: string) {
  return function Placeholder() {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderTitle}>{title}</Text>
        <Text style={styles.placeholderSubtitle}>Coming soon</Text>
      </View>
    );
  };
}

const RevenueAnalyticsScreen = createSimplePlaceholder('Revenue Analytics');
const UserManagementScreen = createSimplePlaceholder('User Management');
const LoyaltyConfigurationScreen = createSimplePlaceholder('Loyalty Configuration');

// ─── Stack Navigator ─────────────────────────────────────────────────────────

const Stack = createNativeStackNavigator<AdminStackParamList>();

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminHome" component={AdminScreen} />
      <Stack.Screen name="RevenueAnalytics" component={RevenueAnalyticsScreen} />
      <Stack.Screen name="UserManagement" component={UserManagementScreen} />
      <Stack.Screen name="LoyaltyConfiguration" component={LoyaltyConfigurationScreen} />
    </Stack.Navigator>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.background,
  },
  placeholderTitle: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.h2,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textPrimary,
  },
  placeholderSubtitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
    marginTop: tokens.spacing.xs,
  },
});
