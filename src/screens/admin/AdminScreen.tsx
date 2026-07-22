import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import tokens from '@/theme/tokens';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/auth/useLogout';
import { Backdrop, ConfirmationModal, UserCard, AdminMenuList } from '@/components/shared';
import type { AdminMenuItem } from '@/components/shared/AdminMenuList';
import type { AdminStackParamList } from '@/navigation/types';

// ─── Navigation type ─────────────────────────────────────────────────────────

type AdminNavProp = NativeStackNavigationProp<AdminStackParamList>;

// ─── Menu items ──────────────────────────────────────────────────────────────

const MENU_ITEMS: AdminMenuItem[] = [
  { label: 'Revenue Analytics', icon: 'bar-chart-2', route: 'RevenueAnalytics' },
  { label: 'User Management', icon: 'users', route: 'UserManagement' },
  { label: 'Loyalty Configuration', icon: 'award', route: 'LoyaltyConfiguration' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<AdminNavProp>();
  const user = useAuthStore(state => state.user);
  const logoutMutation = useLogout();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const rootContainerStyle = useMemo(() => [styles.root, { paddingTop: insets.top }], [insets.top]);

  return (
    <View style={rootContainerStyle}>
      <Backdrop />

      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Feather name="search" size={tokens.iconSizes.md} color={tokens.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutPill}
            activeOpacity={0.7}
            onPress={() => setLogoutModalVisible(true)}
          >
            <Text style={styles.logoutPillText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Card */}
      <UserCard user={user} />

      {/* Menu List */}
      <AdminMenuList
        items={MENU_ITEMS}
        onNavigate={route => navigation.navigate(route as keyof AdminStackParamList)}
      />

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={() => {
          setLogoutModalVisible(false);
          logoutMutation.mutate();
        }}
        title="Log Out"
        content="Are you sure you want to log out?"
        confirmLabel={logoutMutation.isPending ? 'Logging out...' : 'Log Out'}
        confirmDisabled={logoutMutation.isPending}
        iconVariant="danger"
        icon={<Feather name="log-out" size={32} color={tokens.colors.danger} />}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.xlMd,
    paddingTop: tokens.spacing.sm,
  },
  headerTitle: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.h1,
    color: tokens.colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  iconButton: {
    padding: tokens.spacing.xs,
  },
  logoutPill: {
    paddingHorizontal: tokens.spacing.lgMd,
    paddingVertical: tokens.spacing.xs,
    backgroundColor: tokens.colors.badgeHighBg,
    borderRadius: tokens.borderRadius.pill,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.danger,
  },
  logoutPillText: {
    color: tokens.colors.danger,
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: tokens.typography.fontWeight.semibold,
  },
});
