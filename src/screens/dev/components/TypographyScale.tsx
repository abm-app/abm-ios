import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';

// ─── Typography row data ─────────────────────────────────────────────────────

const typeRows = [
  {
    meta: 'Display / 36px\nAncizar Serif 400',
    label: 'Overall Score',
    style: {
      fontFamily: tokens.typography.fontFamily.heading,
      fontSize: tokens.typography.fontSize.display,
      fontWeight: tokens.typography.fontWeight.regular,
      lineHeight: tokens.typography.lineHeight.display,
      letterSpacing: tokens.typography.letterSpacing.display,
    },
    last: false,
  },
  {
    meta: 'Heading 1 / 26px\nAncizar Serif 400',
    label: 'Dashboard',
    style: {
      fontFamily: tokens.typography.fontFamily.heading,
      fontSize: tokens.typography.fontSize.h1,
      fontWeight: tokens.typography.fontWeight.regular,
      lineHeight: tokens.typography.lineHeight.h1,
    },
    last: false,
  },
  {
    meta: 'Heading 2 / 20px\nAncizar Serif 400',
    label: 'CSAT Trendline',
    style: {
      fontFamily: tokens.typography.fontFamily.heading,
      fontSize: tokens.typography.fontSize.h2,
      fontWeight: tokens.typography.fontWeight.regular,
      lineHeight: tokens.typography.lineHeight.h2,
    },
    last: false,
  },
  {
    meta: 'Subheading / 15px\nInter 600',
    label: 'Quick Insights',
    style: {
      fontSize: tokens.typography.fontSize.subhead,
      fontWeight: tokens.typography.fontWeight.semibold,
      letterSpacing: tokens.typography.letterSpacing.subhead,
    },
    last: false,
  },
  {
    meta: 'Body / 15px\nSF Pro 400',
    label: 'Get imperial restaurant prawns, change that to octopus before the 5 PM service window.',
    style: {
      fontSize: tokens.typography.fontSize.body,
      fontWeight: tokens.typography.fontWeight.regular,
      lineHeight: tokens.typography.lineHeight.body,
      flex: 1,
    },
    last: false,
  },
  {
    meta: 'Label / 11px\nInter 600 caps',
    label: 'Due Date · Recurrence',
    style: {
      fontSize: tokens.typography.fontSize.label,
      fontWeight: tokens.typography.fontWeight.semibold,
      letterSpacing: tokens.typography.letterSpacing.label,
      textTransform: 'uppercase' as const,
    },
    last: false,
  },
  {
    meta: 'Caption / 12px\nInter 400',
    label: 'Created 20 May 2026 · Assigned to Mustafa, Akin, Venkat',
    style: {
      fontSize: tokens.typography.fontSize.caption,
      fontWeight: tokens.typography.fontWeight.regular,
      color: tokens.colors.textMuted,
    },
    last: false,
  },
  {
    meta: 'Numeric / 28px\nInter 300',
    label: '4.8',
    style: {
      fontSize: tokens.typography.fontSize.numeric,
      fontWeight: tokens.typography.fontWeight.light,
      letterSpacing: tokens.typography.letterSpacing.numeric,
    },
    last: true,
  },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export default function TypographyScale() {
  return (
    <View>
      {typeRows.map(row => (
        <View key={row.meta} style={[styles.row, row.last && styles.rowLast]}>
          <Text style={styles.meta}>{row.meta}</Text>
          <Text style={[styles.sample, row.style]}>{row.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Static styles ───────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: tokens.typographyRow.gap,
    paddingVertical: tokens.typographyRow.paddingVertical,
    borderBottomWidth: tokens.borderWidth.hairline,
    borderBottomColor: tokens.colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  meta: {
    width: tokens.typographyRow.metaWidth,
    flexShrink: 0,
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textHint,
  },
  sample: {
    color: tokens.colors.textPrimary,
  },
});
