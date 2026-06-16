import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import tokens from '@/theme/tokens';
import { useAuthStore } from '@/store/authStore';
import type { ModuleKey } from '@/types/auth';

import type { AppTabParamList } from './types';
import { MODULE_TO_TAB } from './types';

// ─── Tab Navigator ───────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator<AppTabParamList>();

// ─── Tab Icon Map ────────────────────────────────────────────────────────────

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

const TAB_ICONS: Record<keyof AppTabParamList, FeatherIconName> = {
  Dashboard: 'layout',
  LiveStatus: 'list',
  AuditTrail: 'file-text',
  Revenue: 'dollar-sign',
  Reports: 'bar-chart-2',
  Loyalty: 'heart',
  Notifications: 'bell',
  UserManagement: 'users',
};

const TAB_LABELS: Record<keyof AppTabParamList, string> = {
  Dashboard: 'Dashboard',
  LiveStatus: 'Live Status',
  AuditTrail: 'Audit Trail',
  Revenue: 'Revenue',
  Reports: 'Reports',
  Loyalty: 'Loyalty',
  Notifications: 'Notifs',
  UserManagement: 'Users',
};

// ─── Ordered ModuleKeys (determines tab order) ───────────────────────────────

const MODULE_ORDER: ModuleKey[] = [
  'dashboard',
  'live_status',
  'audit_trail',
  'revenue',
  'reports',
  'loyalty',
  'notifications',
  'user_management',
];

// ─── Placeholder Screen ──────────────────────────────────────────────────────

function createPlaceholderScreen(title: string) {
  return function PlaceholderScreen() {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderTitle}>{title}</Text>
        <Text style={styles.placeholderSubtitle}>Coming soon</Text>
      </View>
    );
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AppNavigator() {
  const modules = useAuthStore(s => s.modules);

  const enabledModules = MODULE_ORDER.filter(m => modules.includes(m));

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tokens.colors.textPrimary,
        tabBarInactiveTintColor: tokens.colors.textHint,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarStyle: styles.tabBar,
      }}
    >
      {enabledModules.map(moduleKey => {
        const routeName = MODULE_TO_TAB[moduleKey];
        const Placeholder = createPlaceholderScreen(TAB_LABELS[routeName]);

        return (
          <Tab.Screen
            key={moduleKey}
            name={routeName}
            component={Placeholder}
            options={{
              tabBarLabel: TAB_LABELS[routeName],
              tabBarIcon: ({ color, focused }) => (
                <Feather
                  name={TAB_ICONS[routeName]}
                  size={tokens.iconSizes.tabBar}
                  color={color}
                  style={focused ? styles.iconFocused : undefined}
                />
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: tokens.borderWidth.hairline,
    borderTopColor: tokens.colors.border,
    backgroundColor: tokens.colors.background,
  },
  tabBarLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    letterSpacing: tokens.typography.letterSpacing.badge,
  },
  tabBarItem: {
    paddingVertical: tokens.spacing.xs,
  },
  iconFocused: {
    opacity: 1,
  },
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
