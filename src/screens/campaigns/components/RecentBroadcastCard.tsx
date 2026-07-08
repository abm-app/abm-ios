import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import tokens from '@/theme/tokens';
import { Card, Chip } from '@/components/ui';
import type { RootStackParamList } from '@/navigation/types';

export interface Broadcast {
  id: string;
  title: string;
  status: string;
  audienceCount: number;
  dateStr: string;
}

interface RecentBroadcastCardProps {
  broadcast: Broadcast;
}

export default function RecentBroadcastCard({ broadcast }: RecentBroadcastCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('CampaignDetails', { id: broadcast.id })}
    >
      <Card padded style={styles.card}>
        <View style={styles.chipRow}>
          <Chip
            label={broadcast.status}
            textColor={tokens.colors.primary}
            style={{ backgroundColor: tokens.colors.authInputBg }}
          />
        </View>
        <Text style={styles.title}>{broadcast.title}</Text>
        <Text style={styles.subtitle}>{broadcast.audienceCount.toLocaleString()} Guests</Text>

        <View style={styles.divider} />

        <View style={styles.footerRow}>
          <Feather
            name="calendar"
            size={tokens.iconSizes.taskMeta}
            color={tokens.colors.textMuted}
          />
          <Text style={styles.footerText}>
            {broadcast.status === 'Sent' ? 'Sent on: ' : 'Fires on: '}
            {broadcast.dateStr}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: tokens.spacing.mdLg,
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
  chipRow: {
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.sm,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.h2,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.xs,
  },
  subtitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.lg,
  },
  divider: {
    height: tokens.borderWidth.thin,
    backgroundColor: tokens.colors.border,
    marginBottom: tokens.spacing.mdLg,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  footerText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    fontWeight: '500',
  },
});
