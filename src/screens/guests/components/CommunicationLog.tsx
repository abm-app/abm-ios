import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '@/theme/tokens';
import { formatDateTimeIST, formatTimeIST } from '@/utils/dateUtils';

import { useGuestCommunications } from '@/hooks/guests/useGuests';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/shared';
import { Card } from '@/components/ui';

interface CommunicationLogProps {
  guestId: string;
  doNotContact: boolean;
}

const TRIGGER_LABELS: Record<string, string> = {
  campaign: 'Campaign',
  post_checkout: 'Post checkout',
  re_engagement: 'Re-engagement',
  milestone: 'Milestone',
  days_since_visit: 'Days since visit',
  tier_upgrade: 'Tier upgrade',
};

function triggerLabel(triggerType: string): string {
  return TRIGGER_LABELS[triggerType] || 'System';
}

/**
 * templateId is a WhatsApp template name (post_checkout), but campaigns created
 * before the backend resolved it store Meta's numeric id instead.
 */
function templateLabel(templateId: string): string {
  if (!templateId) return 'WhatsApp message';
  if (/^\d+$/.test(templateId)) return 'WhatsApp message';
  return templateId
    .split('_')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function CommunicationLog({ guestId, doNotContact }: CommunicationLogProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGuestCommunications(guestId);

  const communications = data?.pages.flatMap(page => page.messages);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'read':
        return { label: 'READ', color: tokens.colors.info, icon: 'check-circle' as const };
      case 'delivered':
        return { label: 'DELIVERED', color: tokens.colors.textMuted, icon: 'check' as const };
      case 'failed':
        return { label: 'FAILED', color: tokens.colors.danger, icon: 'x-circle' as const };
      case 'skipped':
        return { label: 'SKIPPED', color: tokens.colors.warning, icon: 'slash' as const };
      case 'sent':
      default:
        return { label: 'SENT', color: tokens.colors.textMuted, icon: 'check' as const };
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <ErrorState message={error?.message || 'Failed to load communications'} onRetry={refetch} />
    );
  }

  if (!communications || communications.length === 0) {
    return (
      <View style={styles.container}>
        {doNotContact && (
          <View style={styles.dncWarning}>
            <Feather name="alert-circle" size={16} color={tokens.colors.warning} />
            <Text style={styles.dncWarningText}>
              Do-Not-Contact is enabled. This guest will not receive recent marketing campaigns.
            </Text>
          </View>
        )}
        <EmptyState
          icon="message-square"
          title="No communications"
          subtitle="No recent messages for this guest."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {doNotContact && (
        <View style={styles.dncWarning}>
          <Feather name="alert-circle" size={16} color={tokens.colors.warning} />
          <Text style={styles.dncWarningText}>
            Do-Not-Contact is enabled. This guest will not receive recent marketing campaigns.
          </Text>
        </View>
      )}

      {communications.map((msg, index) => {
        const isLast = index === communications.length - 1;
        const statusDisplay = getStatusDisplay(msg.status);
        const isSkipped = msg.status === 'skipped';

        const deliveredAt = formatTimeIST(msg.deliveredAt ?? undefined);
        const readAt = formatTimeIST(msg.readAt ?? undefined);
        const deliveryParts = [
          deliveredAt ? `Delivered ${deliveredAt}` : null,
          readAt ? `Read ${readAt}` : null,
        ].filter(Boolean);

        return (
          <View key={msg.id} style={styles.timelineRow}>
            <View style={styles.timelineLeft}>
              <View
                style={[styles.timelineDot, msg.status === 'read' ? styles.timelineDotRead : null]}
              />
              {!isLast && <View style={styles.timelineLine} />}
            </View>

            <Card variant="flat" padded style={styles.timelineContent}>
              <View style={styles.msgHeader}>
                <Text style={styles.msgMeta}>
                  {isSkipped ? 'NOT SENT' : 'SENT'}:{' '}
                  {(formatDateTimeIST(msg.sentAt) || '').toUpperCase()} •{' '}
                  {triggerLabel(msg.triggerType).toUpperCase()}
                </Text>
                <View style={styles.statusBadge}>
                  <Feather name={statusDisplay.icon} size={12} color={statusDisplay.color} />
                  <Text style={[styles.statusText, { color: statusDisplay.color }]}>
                    {statusDisplay.label}
                  </Text>
                </View>
              </View>

              <Text style={styles.templateName}>{templateLabel(msg.templateId)}</Text>
              <Text style={styles.msgBody} numberOfLines={2}>
                {msg.templateBody}
              </Text>

              {deliveryParts.length > 0 && (
                <Text style={styles.deliveryTimes}>{deliveryParts.join(' • ')}</Text>
              )}

              {msg.failureReason && (
                <Text style={[styles.reasonText, styles.failureReason]}>{msg.failureReason}</Text>
              )}
              {isSkipped && msg.skipReasonText && (
                <Text style={[styles.reasonText, styles.skipReason]}>{msg.skipReasonText}</Text>
              )}
            </Card>
          </View>
        );
      })}

      {hasNextPage && (
        <Pressable
          style={styles.loadMore}
          onPress={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          <Text style={styles.loadMoreText}>
            {isFetchingNextPage ? 'LOADING…' : 'LOAD OLDER MESSAGES'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: tokens.spacing.md,
  },
  dncWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.bannerWarningBg,
    padding: tokens.spacing.md,
    borderRadius: tokens.borderRadius.md,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.bannerWarningBorder,
    marginBottom: tokens.spacing.xl,
  },
  dncWarningText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textSecondary,
    marginLeft: tokens.spacing.sm,
    flex: 1,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: tokens.spacing.md,
  },
  timelineLeft: {
    width: 24,
    alignItems: 'center',
    marginRight: tokens.spacing.sm,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.borderMd,
    marginTop: 6,
  },
  timelineDotRead: {
    backgroundColor: tokens.colors.textPrimary,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: tokens.colors.border,
    marginTop: tokens.spacing.sm,
  },
  timelineContent: {
    flex: 1,
  },
  msgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  msgMeta: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: 10,
    color: tokens.colors.textMuted,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: 10,
    fontWeight: '700',
    marginLeft: tokens.spacing.xxs,
  },
  templateName: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.subhead,
    color: tokens.colors.textPrimary,
    fontWeight: '600',
    marginBottom: tokens.spacing.xs,
  },
  msgBody: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textSecondary,
  },
  deliveryTimes: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: 10,
    color: tokens.colors.textMuted,
    marginTop: tokens.spacing.xs,
  },
  reasonText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    marginTop: tokens.spacing.xs,
  },
  failureReason: {
    color: tokens.colors.danger,
  },
  skipReason: {
    color: tokens.colors.warning,
  },
  loadMore: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    marginTop: tokens.spacing.xs,
  },
  loadMoreText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: tokens.colors.textSecondary,
  },
});
