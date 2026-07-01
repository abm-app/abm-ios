import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { Card, Badge } from '@/components/ui';
import type { Guest } from '@/types/guest';
import type { BadgeVariant } from '@/components/ui/Badge';
import { formatDate } from '@/utils/dateUtils';

interface GuestCardProps {
  guest: Guest;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const getTierVariant = (tier: string): BadgeVariant => {
  const normalized = tier.toLowerCase();
  if (
    normalized.includes('suite') ||
    normalized.includes('executive') ||
    normalized.includes('gold')
  ) {
    return 'medium';
  }
  return 'category';
};

export default function GuestCard({ guest, onPress, style }: GuestCardProps) {
  return (
    <Card padded onPress={onPress} style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {guest.name}
        </Text>
        <Badge label={guest.tier} variant={getTierVariant(guest.tier)} />
      </View>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Points</Text>
          <Text style={styles.statValue}>{guest.totalPointsLifetime.toLocaleString()}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Stays</Text>
          <Text style={styles.statValue}>{guest.totalStays}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.phoneContainer}>
          <Feather name="phone" size={tokens.iconSizes.inline} color={tokens.colors.textMuted} />
          <Text style={styles.phoneText}>{guest.phone}</Text>
        </View>
        {guest.lastStayDate ? (
          <Text style={styles.dateText}>Last Visit: {formatDate(guest.lastStayDate)}</Text>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: tokens.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  name: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.h2,
    color: tokens.colors.textPrimary,
    flex: 1,
    marginRight: tokens.spacing.sm,
  },
  divider: {
    height: tokens.borderWidth.hairline,
    backgroundColor: tokens.colors.border,
    marginBottom: tokens.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: tokens.spacing.xl,
  },
  statBox: {
    marginRight: tokens.spacing.xxxl,
  },
  statLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.xs,
    letterSpacing: tokens.typography.letterSpacing.label,
  },
  statValue: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.h2,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginLeft: tokens.spacing.s,
  },
  dateText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
  },
});
