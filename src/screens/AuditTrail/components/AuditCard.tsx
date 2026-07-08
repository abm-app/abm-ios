import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '@/theme/tokens';
import { formatDateTime, formatDate } from '@/utils/dateUtils';
import type { AuditEvent, AuditEventType } from '@/api/endpoints/auditApi';

const EVENT_CONFIG: Record<AuditEventType, { label: string; color: string; background: string }> = {
  extension: {
    label: 'STAY EXTENSION',
    color: tokens.colors.primary,
    background: tokens.colors.surface,
  },
  room_change: {
    label: 'ROOM CHANGE',
    color: tokens.colors.info,
    background: tokens.colors.surface,
  },
  checkout: {
    label: 'CHECKOUT',
    color: tokens.colors.danger,
    background: tokens.colors.badgeHighBg,
  },
};

export interface AuditCardProps {
  event: AuditEvent;
}

export function AuditCard({ event }: AuditCardProps) {
  const config = EVENT_CONFIG[event.eventType];
  const detectedAtStr = formatDateTime(event.detectedAt);

  const renderDetailRow = () => {
    if (
      event.eventType === 'extension' &&
      event.before.departureDate &&
      event.after.departureDate
    ) {
      return (
        <View style={styles.detailContainer}>
          <Text style={styles.detailBefore}>
            Departure: {formatDate(event.before.departureDate)}
          </Text>
          <Feather
            name="arrow-right"
            size={14}
            color={tokens.colors.textMuted}
            style={styles.detailArrow}
          />
          <Text style={styles.detailAfter}>Departure: {formatDate(event.after.departureDate)}</Text>
        </View>
      );
    }

    if (event.eventType === 'room_change' && event.before.rmCode && event.after.rmCode) {
      return (
        <View style={styles.detailContainer}>
          <Text style={styles.detailRoomChange}>
            Room {event.before.rmCode} → {event.after.rmCode}
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: config.background }]}>
          <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
        </View>
        {detectedAtStr ? <Text style={styles.timeText}>{detectedAtStr}</Text> : null}
      </View>
      <Text style={styles.headline}>
        Room {event.rmCode} • {event.guestName}
      </Text>
      {renderDetailRow()}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
  },
  headline: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: 18,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
    marginTop: tokens.spacing.xs,
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.spacing.sm,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    marginTop: tokens.spacing.md,
  },
  detailBefore: {
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
    textDecorationLine: 'line-through',
  },
  detailArrow: {
    marginHorizontal: tokens.spacing.sm,
  },
  detailAfter: {
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.primary,
    fontWeight: 'bold',
  },
  detailRoomChange: {
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textSecondary,
  },
});
