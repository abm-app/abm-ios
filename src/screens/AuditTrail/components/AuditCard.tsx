import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '@/theme/tokens';
import type { AuditEvent, AuditEventType } from '@/api/endpoints/auditApi';

const EVENT_CONFIG: Record<AuditEventType, { label: string; color: string; background: string }> = {
  cancellation: {
    label: 'CANCELLATION',
    color: tokens.colors.danger,
    background: tokens.colors.badgeHighBg,
  },
  extension: {
    label: 'STAY EXTENSION',
    color: tokens.colors.info,
    background: tokens.colors.badgeExtensionBg,
  },
  modification: {
    label: 'MODIFICATION',
    color: tokens.colors.purple,
    background: tokens.colors.badgeModificationBg,
  },
  room_change: {
    label: 'ROOM CHANGE',
    color: tokens.colors.warning,
    background: tokens.colors.badgeRoomChangeBg,
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

const formatShortDate = (isoStr?: string) => {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};

const formatTime = (isoStr?: string) => {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    .format(date)
    .toUpperCase();
};

export function AuditCard({ event }: AuditCardProps) {
  const config = EVENT_CONFIG[event.eventType] || EVENT_CONFIG.modification;
  const timeStr = formatTime(event.detectedAt);

  const renderDetailRow = () => {
    if (
      event.eventType === 'extension' &&
      event.before.departureDate &&
      event.after.departureDate
    ) {
      return (
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailBefore}>
              Departure: {formatShortDate(event.before.departureDate)}
            </Text>
            <Feather
              name="arrow-right"
              size={14}
              color={tokens.colors.textMuted}
              style={styles.detailArrow}
            />
            <Text style={styles.detailAfter}>
              Departure: {formatShortDate(event.after.departureDate)}
            </Text>
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
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: config.background }]}>
          <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
        </View>
        {timeStr ? <Text style={styles.timeText}>{timeStr}</Text> : null}
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
    padding: tokens.spacing.lgMd,
    marginBottom: tokens.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: tokens.typography.fontSize.label,
    fontFamily: tokens.typography.fontFamily.sub,
    fontWeight: '700',
    letterSpacing: tokens.typography.letterSpacing.caps,
  },
  timeText: {
    fontSize: tokens.typography.fontSize.caption,
    fontFamily: tokens.typography.fontFamily.sub,
    color: tokens.colors.textMuted,
  },
  headline: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: 16,
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
    height: 1,
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
