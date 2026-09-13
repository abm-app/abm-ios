import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tokens from '@/theme/tokens';
import { Card } from '@/components/ui';
import type { Campaign, WeekdayCode } from '@/types/campaign';
import { formatTimeAgo } from '@/utils/dateUtils';

interface Props {
  campaign: Campaign;
}

const WEEKDAY_LABELS: Record<WeekdayCode, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
};

function formatHour(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:00 ${period}`;
}

function triggerSummary(campaign: Campaign): string {
  const trigger = campaign.trigger;
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

export default function AutomationConfigCard({ campaign }: Props) {
  const tiers = campaign.filters?.tier ? String(campaign.filters.tier) : 'All';
  const stats = campaign.stats;
  const sendWindow = campaign.sendWindow;
  const isPostCheckout = campaign.trigger?.type === 'post_checkout';

  return (
    <>
      <Card padded style={styles.card}>
        <Text style={styles.sectionTitle}>TRIGGER & AUDIENCE</Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Sends</Text>
          <Text style={styles.rowValue}>{triggerSummary(campaign)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Guest Tiers</Text>
          <Text style={styles.rowValue}>{tiers}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Estimated Reach</Text>
          <Text style={styles.rowValue}>
            ~{(campaign.recipientCount ?? 0).toLocaleString()} Guests
          </Text>
        </View>

        {!isPostCheckout && (
          <>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Priority</Text>
              <Text style={styles.rowValue}>{campaign.priority ?? '—'}</Text>
            </View>
          </>
        )}

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Last Triggered</Text>
          <Text style={styles.rowValue}>
            {campaign.lastTriggeredAt ? formatTimeAgo(campaign.lastTriggeredAt) : 'Never'}
          </Text>
        </View>
      </Card>

      <Card padded style={styles.card}>
        <Text style={styles.sectionTitle}>SEND WINDOW</Text>
        {isPostCheckout || !sendWindow ? (
          <Text style={styles.infoText}>
            Doesn’t apply to this trigger — sends immediately, any time of day.
          </Text>
        ) : (
          <>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Hours (IST)</Text>
              <Text style={styles.rowValue}>
                {formatHour(sendWindow.startHour)} – {formatHour(sendWindow.endHour)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Days</Text>
              <Text style={styles.rowValue}>
                {sendWindow.days.map(d => WEEKDAY_LABELS[d]).join(', ')}
              </Text>
            </View>
          </>
        )}
      </Card>

      {stats && (
        <Card padded style={styles.card}>
          <Text style={styles.sectionTitle}>DELIVERY STATS</Text>
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
        </Card>
      )}
    </>
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
  divider: {
    height: tokens.borderWidth.hairline,
    backgroundColor: tokens.colors.border,
    marginTop: tokens.spacing.lg,
  },
  infoText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
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
