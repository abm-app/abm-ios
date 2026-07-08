import React from 'react';
import { StyleSheet, Text, View, TextStyle } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import tokens from '@/theme/tokens';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/auth/useLogout';
import { Button } from '@/components/ui';
import { FloatingTabBar } from '@/components/shared';
import type { AppTabParamList } from './types';
import { TAB_PERMISSIONS } from '@/config/roles';
import CampaignDashboardScreen from '@/screens/campaigns/CampaignDashboardScreen';
import GuestDirectoryScreen from '@/screens/guests/GuestDirectoryScreen';
import DashboardScreen from '@/screens/dashboard/DashboardScreen';
import OperationsNavigator from '@/navigation/OperationsNavigator';

// ─── Tab Navigator ───────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator<AppTabParamList>();

// ─── Tab Icon Map ────────────────────────────────────────────────────────────

type IconConfig =
  | {
      family: 'Feather';
      name: React.ComponentProps<typeof Feather>['name'];
      transform?: TextStyle['transform'];
    }
  | {
      family: 'Ionicons';
      name: React.ComponentProps<typeof Ionicons>['name'];
      transform?: TextStyle['transform'];
    }
  | {
      family: 'MaterialCommunityIcons';
      name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
      transform?: TextStyle['transform'];
    };

const TAB_ICONS: Record<keyof AppTabParamList, IconConfig> = {
  Dashboard: { family: 'Feather', name: 'layers' },
  Operations: {
    family: 'Ionicons',
    name: 'key-outline',
    transform: [{ rotate: '90deg' }, { scaleY: -1 }],
  },
  Guests: { family: 'Feather', name: 'star' },
  Campaigns: { family: 'MaterialCommunityIcons', name: 'bullhorn-outline' },
  Admin: { family: 'Feather', name: 'more-horizontal' },
};

const TAB_LABELS: Record<keyof AppTabParamList, string> = {
  Dashboard: 'Dashboard',
  Operations: 'Operations',
  Guests: 'Guest',
  Campaigns: 'Campaigns',
  Admin: 'Menu',
};

const TAB_ORDER: (keyof AppTabParamList)[] = [
  'Dashboard',
  'Operations',
  'Guests',
  'Campaigns',
  'Admin',
];

// ─── Placeholder Screen ──────────────────────────────────────────────────────

function createPlaceholderScreen(title: string) {
  return function PlaceholderScreen() {
    const logoutMutation = useLogout();

    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderTitle}>{title}</Text>
        <Text style={styles.placeholderSubtitle}>Coming soon</Text>
        <Button
          label={logoutMutation.isPending ? 'Logging out...' : 'Logout'}
          onPress={() => logoutMutation.mutate()}
          style={styles.logoutButton}
          disabled={logoutMutation.isPending}
        />
      </View>
    );
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

const AccessDeniedScreen = createPlaceholderScreen('Access Denied');

const PLACEHOLDER_SCREENS = Object.fromEntries(
  Object.entries(TAB_LABELS).map(([routeName, label]) => [
    routeName,
    createPlaceholderScreen(label as string),
  ]),
) as unknown as Record<keyof AppTabParamList, React.ComponentType>;

export default function AppNavigator() {
  const user = useAuthStore(s => s.user);

  if (!user || !user.role) {
    return <AccessDeniedScreen />;
  }

  const enabledTabs = TAB_ORDER.filter(tabName =>
    (TAB_PERMISSIONS[tabName] as readonly string[]).includes(user.role),
  );

  if (enabledTabs.length === 0) {
    return <AccessDeniedScreen />;
  }

  return (
    <Tab.Navigator
      tabBar={props => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {enabledTabs.map(routeName => {
        const ScreenComponent =
          routeName === 'Dashboard'
            ? DashboardScreen
            : routeName === 'Operations'
              ? OperationsNavigator
              : routeName === 'Campaigns'
                ? CampaignDashboardScreen
                : routeName === 'Guests'
                  ? GuestDirectoryScreen
                  : PLACEHOLDER_SCREENS[routeName];

        return (
          <Tab.Screen
            key={routeName}
            name={routeName}
            component={ScreenComponent}
            options={{
              tabBarLabel: TAB_LABELS[routeName],
              tabBarIcon: ({ color, focused }) => {
                const IconConfig = TAB_ICONS[routeName];

                if (IconConfig.family === 'Ionicons') {
                  return (
                    <Ionicons
                      name={IconConfig.name}
                      size={tokens.iconSizes.tabBar}
                      color={color}
                      style={[
                        focused ? styles.iconFocused : undefined,
                        IconConfig.transform && { transform: IconConfig.transform },
                      ]}
                    />
                  );
                }

                if (IconConfig.family === 'MaterialCommunityIcons') {
                  return (
                    <MaterialCommunityIcons
                      name={IconConfig.name}
                      size={tokens.iconSizes.tabBar}
                      color={color}
                      style={[
                        focused ? styles.iconFocused : undefined,
                        IconConfig.transform && { transform: IconConfig.transform },
                      ]}
                    />
                  );
                }

                return (
                  <Feather
                    name={IconConfig.name}
                    size={tokens.iconSizes.tabBar}
                    color={color}
                    style={[
                      focused ? styles.iconFocused : undefined,
                      IconConfig.transform && { transform: IconConfig.transform },
                    ]}
                  />
                );
              },
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
  logoutButton: {
    marginTop: tokens.spacing.xxxl,
    minWidth: tokens.spacing.buttonMinWidth,
  },
});
