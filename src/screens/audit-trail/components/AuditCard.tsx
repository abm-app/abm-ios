import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '@/theme/tokens';
import { Card } from '@/components/ui';
import { AuditEvent, AuditEventType, AuditProperty, PROPERTY_DISPLAY_NAMES } from '@/types/audit';

interface EventConfigItem {
  label: string;
  badgeStyle:
    | 'badgeNewBooking'
    | 'badgeCancellation'
    | 'badgeExtension'
    | 'badgeModification'
    | 'badgeEarlyCheckout';
  textStyle:
    | 'badgeTextNewBooking'
    | 'badgeTextCancellation'
    | 'badgeTextExtension'
    | 'badgeTextModification'
    | 'badgeTextEarlyCheckout';
}

const EVENT_CONFIG: Record<AuditEventType, EventConfigItem> = {
  new_booking: {
    label: 'New Booking',
    badgeStyle: 'badgeNewBooking',
    textStyle: 'badgeTextNewBooking',
  },
  cancellation: {
    label: 'Cancellation',
    badgeStyle: 'badgeCancellation',
    textStyle: 'badgeTextCancellation',
  },
  extension: {
    label: 'Stay Extension',
    badgeStyle: 'badgeExtension',
    textStyle: 'badgeTextExtension',
  },
  modification: {
    label: 'Modification',
    badgeStyle: 'badgeModification',
    textStyle: 'badgeTextModification',
  },
  early_checkout: {
    label: 'Early Checkout',
    badgeStyle: 'badgeEarlyCheckout',
    textStyle: 'badgeTextEarlyCheckout',
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

const IGNORED_DIFF_KEYS = new Set([
  'roomId',
  'id',
  '_id',
  'idempotencyKey',
  'regId',
  'chCode',
  'property',
  'detectedAt',
]);

const FIELD_LABELS: Record<string, string> = {
  arrivalDate: 'Arrival',
  departureDate: 'Departure',
  rate: 'Rate',
  rmCode: 'Room',
  status: 'Status',
  adults: 'Adults',
  children: 'Children',
  discountPercent: 'Discount %',
  discountAmount: 'Discount',
  cancelReason: 'Reason',
  cancelDate: 'Cancelled on',
};

const formatFieldValue = (key: string, value: unknown): string => {
  if (value === undefined || value === null || value === '') return '-';
  if (key === 'arrivalDate' || key === 'departureDate' || key === 'cancelDate') {
    return formatShortDate(String(value));
  }
  if (key === 'rate' || key === 'discountAmount') {
    return typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : `₹${value}`;
  }
  if (key === 'discountPercent') {
    return `${value}%`;
  }
  return String(value);
};

const getDiffEntries = (before?: Record<string, unknown>, after?: Record<string, unknown>) => {
  const b = before || {};
  const a = after || {};
  const allKeys = Array.from(new Set([...Object.keys(b), ...Object.keys(a)]));
  const diffs: { key: string; label: string; beforeVal?: string; afterVal?: string }[] = [];

  for (const key of allKeys) {
    if (IGNORED_DIFF_KEYS.has(key)) continue;
    const bVal = b[key];
    const aVal = a[key];
    if (bVal !== aVal) {
      const label =
        FIELD_LABELS[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      diffs.push({
        key,
        label,
        beforeVal: bVal !== undefined ? formatFieldValue(key, bVal) : undefined,
        afterVal: aVal !== undefined ? formatFieldValue(key, aVal) : undefined,
      });
    }
  }
  return diffs;
};

export function AuditCard({ event }: AuditCardProps) {
  const config = EVENT_CONFIG[event.eventType] || EVENT_CONFIG.modification;
  const timeStr = formatEventTime(event.detectedAt);
  const propertyName =
    (event.property && PROPERTY_DISPLAY_NAMES[event.property as AuditProperty]) ||
    event.property ||
    '';

  const renderDetailRow = () => {
    if (event.eventType === 'new_booking') {
      return (
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Arrival: </Text>
            <Text style={styles.detailAfter}>{formatShortDate(event.after.arrivalDate)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Departure: </Text>
            <Text style={styles.detailAfter}>{formatShortDate(event.after.departureDate)}</Text>
          </View>
        </View>
      );
    }

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
              size={tokens.iconSizes.inline}
              color={tokens.colors.textMuted}
              style={styles.detailArrow}
            />
            <Text style={styles.detailAfter}>{formatShortDate(event.after.departureDate)}</Text>
          </View>
        </View>
      );
    }

    if (event.eventType === 'early_checkout' && event.before.departureDate) {
      return (
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expected departure: </Text>
            <Text style={styles.detailBefore}>{formatShortDate(event.before.departureDate)}</Text>
          </View>
        </View>
      );
    }

    if (event.eventType === 'cancellation') {
      const reason = event.after?.cancelReason || event.before?.cancelReason;
      const cancelDate = event.after?.cancelDate || event.before?.cancelDate;
      if (reason || cancelDate) {
        return (
          <View style={styles.detailContainer}>
            {cancelDate ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Cancelled on: </Text>
                <Text style={styles.detailBefore}>{formatShortDate(cancelDate)}</Text>
              </View>
            ) : null}
            {cancelDate && reason ? <View style={styles.divider} /> : null}
            {reason ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Reason: </Text>
                <Text style={styles.detailAfter}>{reason}</Text>
              </View>
            ) : null}
          </View>
        );
      }
    }

    if (event.eventType === 'modification') {
      const diffs = getDiffEntries(
        event.before as Record<string, unknown>,
        event.after as Record<string, unknown>,
      );

      if (diffs.length === 0) {
        return (
          <View style={styles.detailContainer}>
            <Text style={styles.descriptionText}>Booking details updated</Text>
          </View>
        );
      }

      return (
        <View style={styles.detailContainer}>
          {diffs.map((diff, index) => (
            <React.Fragment key={diff.key}>
              {index > 0 && <View style={styles.divider} />}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{diff.label}: </Text>
                {diff.beforeVal !== undefined ? (
                  <Text style={styles.detailBefore}>{diff.beforeVal}</Text>
                ) : null}
                {diff.beforeVal !== undefined && diff.afterVal !== undefined ? (
                  <Feather
                    name="arrow-right"
                    size={tokens.iconSizes.inline}
                    color={tokens.colors.textMuted}
                    style={styles.detailArrow}
                  />
                ) : null}
                {diff.afterVal !== undefined ? (
                  <Text style={styles.detailAfter}>{diff.afterVal}</Text>
                ) : null}
              </View>
            </React.Fragment>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <Card variant="shadow-outlined" shadow="elevatedCard" style={styles.card}>
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <View style={[styles.badge, styles[config.badgeStyle]]}>
            <Text style={[styles.badgeText, styles[config.textStyle]]}>{config.label}</Text>
          </View>
          {timeStr ? <Text style={styles.timeText}>{timeStr}</Text> : null}
        </View>
        <Text style={styles.headline}>
          Room {event.rmCode} • {event.guestName}
        </Text>
        <View style={styles.metaRow}>
          {propertyName ? (
            <View style={styles.metaItem}>
              <Feather
                name="map-pin"
                size={tokens.iconSizes.inline}
                color={tokens.colors.textMuted}
              />
              <Text style={styles.metaText}>{propertyName}</Text>
            </View>
          ) : null}
          {event.actor ? (
            <View style={styles.metaItem}>
              <Feather name="user" size={tokens.iconSizes.inline} color={tokens.colors.textMuted} />
              <Text style={styles.metaText}>{event.actor}</Text>
            </View>
          ) : null}
        </View>
      </View>
      {renderDetailRow()}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: tokens.listCard.minHeight,
    padding: tokens.spacing.lgMd,
    marginBottom: tokens.spacing.md,
    justifyContent: 'space-between',
  },
  topSection: {
    gap: tokens.spacing.xxs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
  },
  badge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.pill,
  },
  badgeNewBooking: {
    backgroundColor: tokens.colors.badgeLowBg,
  },
  badgeTextNewBooking: {
    color: tokens.colors.badgeLowText,
  },
  badgeCancellation: {
    backgroundColor: tokens.colors.badgeHighBg,
  },
  badgeTextCancellation: {
    color: tokens.colors.danger,
  },
  badgeExtension: {
    backgroundColor: tokens.colors.badgeExtensionBg,
  },
  badgeTextExtension: {
    color: tokens.colors.blue,
  },
  badgeModification: {
    backgroundColor: tokens.colors.badgeModificationBg,
  },
  badgeTextModification: {
    color: tokens.colors.purple,
  },
  badgeEarlyCheckout: {
    backgroundColor: tokens.colors.badgeHighBg,
  },
  badgeTextEarlyCheckout: {
    color: tokens.colors.danger,
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
    marginTop: tokens.spacing.xs,
    marginBottom: tokens.spacing.xxs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  metaText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    fontWeight: '500',
  },
  descriptionText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
  },
  detailContainer: {
    backgroundColor: tokens.colors.surfaceLight,
    borderRadius: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.mdLg,
    marginTop: tokens.spacing.sm,
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
