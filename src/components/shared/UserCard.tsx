import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '@/theme/tokens';
import type { AuthUser } from '@/types/auth';

// ─── Props ──────────────────────────────────────────────────────────────────

interface UserCardProps {
  user: AuthUser | null;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function UserCard({ user }: UserCardProps) {
  return (
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
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
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
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textPrimary,
  },
  userEmail: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginTop: tokens.spacing.xxs,
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
    fontWeight: tokens.typography.fontWeight.semibold,
    letterSpacing: tokens.typography.letterSpacing.badge,
  },
});
