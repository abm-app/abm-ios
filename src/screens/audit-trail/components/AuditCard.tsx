import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '@/theme/tokens';
import { Card } from '@/components/ui';
import type { AuditEvent, AuditEventType } from '@/api/endpoints/auditApi';

const EVENT_CONFIG: Record<
  AuditEventType,
  { label: string; colors: { bg: string; text: string } }
> = {
  cancellation: {
    label: 'Cancellation',
    colors: {
      bg: tokens.colors.badgeHighBg,
      text: tokens.colors.danger,
    },
  },
  extension: {
    label: 'Stay Extension',
    colors: {
      bg: tokens.colors.badgeExtensionBg,
      text: tokens.colors.blue,
    },
  },
  modification: {
    label: 'Modification',
    colors: {
      bg: tokens.colors.badgeModificationBg,
      text: tokens.colors.purple,
    },
  },
  room_change: {
    label: 'Room Change',
    colors: {
      bg: tokens.colors.badgeRoomChangeBg,
      text: tokens.colors.warning,
    },
  },
  checkout: {
    label: 'Checkout',
    colors: {
      bg: tokens.colors.badgeHighBg,
      text: tokens.colors.danger,
    },
  },
};

export interface AuditCardProps {
  event: AuditEvent;
}

const formatShortDate = (isoStr?: string) => {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};

const formatEventTime = (isoStr?: string) => {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isSameMonth =
    date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

  const timeStr = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
    .format(date)
    .toUpperCase();

  if (isToday) {
    return timeStr;
  } else if (isSameMonth) {
    const day = date.getDate();
    return `${day}, ${timeStr}`;
  } else {
    const monthDay = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
      date,
    );
    return `${monthDay}, ${timeStr}`;
  }
};

export function AuditCard({ event }: AuditCardProps) {
  const config = EVENT_CONFIG[event.eventType] || EVENT_CONFIG.modification;
  const timeStr = formatEventTime(event.detectedAt);

  const renderDetailRow = () => {
    if (
      event.eventType === 'extension' &&
      event.before.departureDate &&
      event.after.departureDate
    ) {
      return (
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Departure: </Text>
            <Text style={styles.detailBefore}>{formatShortDate(event.before.departureDate)}</Text>
            <Feather
              name="arrow-right"
              size={14}
              color={tokens.colors.textMuted}
              style={styles.detailArrow}
            />
            <Text style={styles.detailAfter}>{formatShortDate(event.after.departureDate)}</Text>
          </View>
          {event.revenueDelta !== undefined && (
            <>
              <View style={styles.divider} />
              <Text style={styles.revenueText}>
                Revenue updated:{' '}
                <Text style={styles.revenueDelta}>
                  {event.revenueDelta > 0 ? '+' : ''} ₹ {event.revenueDelta.toLocaleString('en-IN')}
                </Text>
              </Text>
            </>
          )}
        </View>
      );
    }

    if (event.description) {
      return <Text style={styles.descriptionText}>{event.description}</Text>;
    }

    if (event.eventType === 'room_change' && event.before.rmCode && event.after.rmCode) {
      return (
        <View style={styles.detailContainer}>
          <Text style={styles.descriptionText}>
            Room {event.before.rmCode} → {event.after.rmCode}
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <Card padded variant="shadow-outlined" shadow="elevatedCard" style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: config.colors.bg }]}>
          <Text style={[styles.badgeText, { color: config.colors.text }]}>{config.label}</Text>
        </View>
        {timeStr ? <Text style={styles.timeText}>{timeStr}</Text> : null}
      </View>
      <Text style={styles.headline}>
        Room {event.rmCode} • {event.guestName}
      </Text>
      {renderDetailRow()}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: tokens.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.pill,
  },
  badgeText: {
    fontSize: tokens.badge.fontSize,
    fontWeight: tokens.badge.fontWeight,
    letterSpacing: tokens.typography.letterSpacing.badge,
  },
  timeText: {
    fontSize: tokens.typography.fontSize.caption,
    fontFamily: tokens.typography.fontFamily.sub,
    color: tokens.colors.textMuted,
  },
  headline: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.xs,
  },
  descriptionText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
    marginTop: tokens.spacing.xs,
  },
  detailContainer: {
    backgroundColor: tokens.colors.surfaceLight,
    borderRadius: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.mdLg,
    marginTop: tokens.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textPrimary,
  },
  detailBefore: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.danger,
    textDecorationLine: 'line-through',
  },
  detailArrow: {
    marginHorizontal: tokens.spacing.md,
  },
  detailAfter: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.success,
    fontWeight: '600',
  },
  divider: {
    height: tokens.borderWidth.thin,
    backgroundColor: tokens.colors.border,
    marginVertical: tokens.spacing.sm,
  },
  revenueText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textSecondary,
  },
  revenueDelta: {
    fontWeight: '600',
    color: tokens.colors.success,
  },
});
