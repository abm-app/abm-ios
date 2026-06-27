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
  const systemRules = filters?.property ? `Property: ${filters.property}` : 'No specific rules';

  return (
    <Card padded style={styles.card}>
      <Text style={styles.sectionTitle}>TARGET AUDIENCE</Text>

      <Text style={styles.label}>Estimated Reach</Text>
      <Text style={styles.reachValue}>~{recipientCount.toLocaleString()} Guests</Text>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Tiers</Text>
        <Text style={styles.rowValue}>{tiers}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Behavior</Text>
        <Text style={styles.rowValue}>{behavior}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>System Rules</Text>
        <Text style={styles.rowValue}>{systemRules}</Text>
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
    color: tokens.colors.textSecondary,
    letterSpacing: tokens.typography.letterSpacing.sectionLabel,
    marginBottom: tokens.spacing.md,
  },
  label: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.xxs,
  },
  reachValue: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.h2,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.md,
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
