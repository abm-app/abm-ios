import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import tokens from '@/theme/tokens';
import { Card } from '@/components/ui';
import type { RootStackParamList } from '@/navigation/types';
import type { Campaign, CampaignStatus } from '@/types/campaign';
import { formatTimeAgo } from '@/utils/dateUtils';

interface AutomationCardProps {
  automation: Campaign;
}

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  pending_approval: 'Awaiting Approval',
  active: 'Active',
  paused: 'Paused',
  rejected: 'Rejected',
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  draft: { bg: tokens.colors.surface, text: tokens.colors.textMuted },
  pending_approval: { bg: tokens.colors.warningSurface, text: tokens.colors.warning },
  active: { bg: tokens.colors.successLight, text: tokens.colors.success },
  paused: { bg: tokens.colors.surface, text: tokens.colors.textMuted },
  rejected: { bg: tokens.colors.dangerLight, text: tokens.colors.danger },
};

function triggerSummary(automation: Campaign): string {
  const trigger = automation.trigger;
  if (!trigger) return '—';
  switch (trigger.type) {
    case 'post_checkout':
      return 'Right after checkout';
    case 'days_since_visit':
      return `${trigger.days ?? '?'} days after visit`;
    case 'tier_upgrade':
      return 'On tier upgrade';
    default:
      return trigger.type;
  }
}

function lastTriggeredLabel(automation: Campaign): string {
  if (!automation.lastTriggeredAt) return 'Never triggered';
  return `Last sent ${formatTimeAgo(automation.lastTriggeredAt)}`;
}

export default function AutomationCard({ automation }: AutomationCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const statusKey: CampaignStatus = automation.status;
  const statusColors = STATUS_COLORS[statusKey] ?? STATUS_COLORS.draft;
  const stats = automation.stats;

  return (
    <Card
      padded
      variant="shadow-outlined"
      shadow="elevatedCard"
      onPress={() => navigation.navigate('CampaignDetails', { id: automation._id })}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <View style={[styles.statusPill, { backgroundColor: statusColors.bg }]}>
          {statusKey === 'paused' && (
            <Feather
              name="pause"
              size={tokens.iconSizes.inline}
              color={statusColors.text}
              style={styles.pauseIcon}
            />
          )}
          <Text style={[styles.statusText, { color: statusColors.text }]}>
            {STATUS_LABEL[statusKey] ?? statusKey}
          </Text>
        </View>
        {automation.priority !== undefined && automation.trigger?.type !== 'post_checkout' && (
          <Text style={styles.priorityText}>Priority {automation.priority}</Text>
        )}
      </View>

      <Text style={styles.title}>{automation.name}</Text>
      <Text style={styles.subtitle}>{triggerSummary(automation)}</Text>

      {statusKey === 'rejected' && automation.rejectionReason && (
        <Text style={styles.rejectionText}>Reason: {automation.rejectionReason}</Text>
      )}

      <View style={styles.metaRow}>
        <Feather name="clock" size={tokens.iconSizes.taskMeta} color={tokens.colors.textMuted} />
        <Text style={styles.metaText}>{lastTriggeredLabel(automation)}</Text>
      </View>

      {stats && (
        <>
          <View style={styles.divider} />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.sent}</Text>
              <Text style={styles.statLabel}>Sent</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.delivered}</Text>
              <Text style={styles.statLabel}>Delivered</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.read}</Text>
              <Text style={styles.statLabel}>Read</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.failed}</Text>
              <Text style={styles.statLabel}>Failed</Text>
            </View>
          </View>
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: tokens.spacing.mdLg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.sm,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.chip.paddingVertical,
    paddingHorizontal: tokens.chip.paddingHorizontal,
    borderRadius: tokens.borderRadius.pill,
  },
  pauseIcon: {
    marginRight: tokens.spacing.xs,
  },
  statusText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.chip.fontSize,
    fontWeight: tokens.chip.fontWeight,
  },
  priorityText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
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
  },
  rejectionText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.danger,
    marginTop: tokens.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.lg,
  },
  metaText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
  },
  divider: {
    height: tokens.borderWidth.thin,
    backgroundColor: tokens.colors.border,
    marginTop: tokens.spacing.mdLg,
    marginBottom: tokens.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.h2,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  statLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginTop: tokens.spacing.xs,
  },
});
