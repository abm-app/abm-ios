import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import tokens from '@/theme/tokens';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/auth/useLogout';
import { Backdrop, ConfirmationModal } from '@/components/shared';
import type { AdminStackParamList } from '@/navigation/types';

// ─── Navigation type ─────────────────────────────────────────────────────────

type AdminNavProp = NativeStackNavigationProp<AdminStackParamList>;

// ─── Menu items ──────────────────────────────────────────────────────────────

interface MenuItem {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  route: keyof AdminStackParamList;
}

const MENU_ITEMS: MenuItem[] = [
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

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
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
      <View style={styles.userCard}>
        <View style={styles.userRow}>
          <View style={styles.avatarCircle}>
            <Feather name="user" size={22} color={tokens.colors.avatarWarmIcon} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name ?? 'User'}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user?.email ?? ''}
            </Text>
          </View>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{(user?.role ?? '').toUpperCase()}</Text>
          </View>
        </View>
      </View>

      {/* Menu List */}
      <View style={styles.menuCard}>
        {MENU_ITEMS.map((item, index) => (
          <React.Fragment key={item.route}>
            {index > 0 && <View style={styles.menuDivider} />}
            <TouchableOpacity
              style={styles.menuRow}
              activeOpacity={0.6}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <Feather
                    name={item.icon}
                    size={tokens.iconSizes.content}
                    color={tokens.colors.textPrimary}
                  />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Feather
                name="chevron-right"
                size={tokens.iconSizes.content}
                color={tokens.colors.textMuted}
              />
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>

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
    fontWeight: '600',
  },
  userCard: {
    marginTop: tokens.spacing.lgMd,
    marginHorizontal: tokens.spacing.xlMd,
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.borderRadius.xl,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.border,
    padding: tokens.spacing.lgMd,
    ...tokens.shadow.modal,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.mdLg,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: tokens.colors.avatarWarmBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.subhead,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  userEmail: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xxs,
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  roleBadgeText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textInverse,
    fontWeight: '600',
    letterSpacing: tokens.typography.letterSpacing.badge,
  },
  menuCard: {
    marginTop: tokens.spacing.lgMd,
    marginHorizontal: tokens.spacing.xlMd,
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.borderRadius.xl,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.border,
    ...tokens.shadow.modal,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.lgMd,
    paddingVertical: tokens.spacing.lg,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.mdLg,
  },
  menuIconContainer: {
    width: 34,
    height: 34,
    borderRadius: tokens.borderRadius.sm,
    backgroundColor: tokens.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textPrimary,
  },
  menuDivider: {
    height: tokens.borderWidth.hairline,
    backgroundColor: tokens.colors.border,
    marginHorizontal: tokens.spacing.lgMd,
  },
});
