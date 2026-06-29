import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tokens from '@/theme/tokens';
import { Card } from '@/components/ui';
import type { Campaign } from '@/types/campaign';

interface Props {
  campaign: Campaign;
}

export default function CampaignTargetAudience({ campaign }: Props) {
  const { filters, recipientCount } = campaign;

  const tiers = filters?.tier ? String(filters.tier) : 'All';
  const behavior = filters?.lapsedDays ? `Lapsed > ${filters.lapsedDays} days` : 'Active';

  return (
    <Card padded style={styles.card}>
      <Text style={styles.sectionTitle}>TARGET AUDIENCE</Text>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Estimated Reach</Text>
        <Text style={styles.rowValue}>~{recipientCount.toLocaleString()} Guests</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Tiers</Text>
        <Text style={styles.rowValue}>{tiers}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Behavior</Text>
        <Text style={styles.rowValue}>{behavior}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: tokens.spacing.mdLg,
  },
  sectionTitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.sectionLabel,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
    letterSpacing: tokens.typography.letterSpacing.sectionLabel,
    marginBottom: tokens.spacing.md,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: tokens.colors.border,
    marginTop: tokens.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: tokens.spacing.lg,
  },
  rowLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
    flex: 1,
  },
  rowValue: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
});
