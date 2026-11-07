import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { Card } from '@/components/ui';
import { PROPERTY_DISPLAY_NAMES } from '@/types/audit';
import type { MoneyAuditEvent, MoneyEventType } from '@/types/audit';
import { formatDateTimeIST } from '@/utils/dateUtils';
import { MONEY_EVENT_LABELS, getMoneyEventSummary } from '@/utils/moneyAuditEvents';

type Tone = 'good' | 'change' | 'bad' | 'category';

const EVENT_TONE: Record<MoneyEventType, Tone> = {
  expense_created: 'good',
  expense_updated: 'change',
  expense_deleted: 'bad',
  expense_category_created: 'category',
  expense_category_updated: 'category',
  petty_cash_added: 'good',
  petty_cash_removed: 'bad',
};

interface MoneyAuditCardProps {
  event: MoneyAuditEvent;
  highlighted?: boolean;
}

// For expense, category and petty cash events, which have no room or guest.
export function MoneyAuditCard({ event, highlighted = false }: MoneyAuditCardProps) {
  const tone = EVENT_TONE[event.eventType];
  const summary = getMoneyEventSummary(event.eventType, event.before, event.after);
  const time = formatDateTimeIST(event.detectedAt);
  const propertyName = event.property ? PROPERTY_DISPLAY_NAMES[event.property] : '';

  return (
    <Card
      variant="shadow-outlined"
      shadow="elevatedCard"
      style={[styles.card, highlighted && styles.cardHighlighted]}
    >
      <View style={styles.headerRow}>
        <View style={[styles.badge, styles[`${tone}Badge`]]}>
          <Text style={[styles.badgeText, styles[`${tone}Text`]]}>
            {MONEY_EVENT_LABELS[event.eventType]}
          </Text>
        </View>
        {time ? <Text style={styles.timeText}>{time}</Text> : null}
      </View>

      {summary ? <Text style={styles.headline}>{summary}</Text> : null}

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
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: tokens.spacing.lgMd,
    marginBottom: tokens.spacing.md,
    gap: tokens.spacing.xs,
  },
  cardHighlighted: {
    borderWidth: tokens.borderWidth.thick,
    borderColor: tokens.colors.info,
    backgroundColor: tokens.colors.infoLight,
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
  goodBadge: {
    backgroundColor: tokens.colors.badgeLowBg,
  },
  changeBadge: {
    backgroundColor: tokens.colors.badgeModificationBg,
  },
  badBadge: {
    backgroundColor: tokens.colors.badgeHighBg,
  },
  categoryBadge: {
    backgroundColor: tokens.colors.badgeExtensionBg,
  },
  badgeText: {
    fontSize: tokens.badge.fontSize,
    fontWeight: tokens.badge.fontWeight,
    letterSpacing: tokens.typography.letterSpacing.badge,
  },
  goodText: {
    color: tokens.colors.badgeLowText,
  },
  changeText: {
    color: tokens.colors.purple,
  },
  badText: {
    color: tokens.colors.danger,
  },
  categoryText: {
    color: tokens.colors.blue,
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
});
