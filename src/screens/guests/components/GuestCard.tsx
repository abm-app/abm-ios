import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import tokens from '@/theme/tokens';
import { Card, Badge } from '@/components/ui';
import { Avatar } from '@/components/shared';
import type { Guest } from '@/types/guest';
import type { RootStackParamList } from '@/navigation/types';
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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('GuestProfile', { id: guest._id });
    }
  };

  return (
    <Card padded onPress={handlePress} style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.guestInfoGroup}>
          <Avatar name={guest.name} size={40} />
          <Text style={styles.name} numberOfLines={1}>
            {guest.name}
          </Text>
        </View>
        <Badge label={guest.tier} variant={getTierVariant(guest.tier)} />
      </View>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Available Points</Text>
          <Text style={styles.statValue}>{guest.spendableBalance.toLocaleString()}</Text>
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
    backgroundColor: tokens.colors.white,
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: tokens.colors.borderDark,
    borderRadius: tokens.borderRadius.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  guestInfoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    flex: 1,
    marginRight: tokens.spacing.md,
  },
  name: {
    fontFamily: tokens.typography.fontFamily.headingBold,
    fontSize: tokens.typography.fontSize.h2,
    color: tokens.colors.textPrimary,
    flex: 1,
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
    fontWeight: '700',
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
