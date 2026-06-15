import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';
import SectionLabel from './SectionLabel';

// ─── Data ────────────────────────────────────────────────────────────────────

interface TypographyRow {
  name: string;
  size: number;
  family: string;
  weight: number;
  lineHeight?: number;
  letterSpacing?: number;
  sample: string;
  metaExtra?: string;
}

const rows: TypographyRow[] = [
  {
    name: 'Display',
    size: 36,
    family: 'Ancizar Serif',
    weight: 400,
    lineHeight: 1.1,
    letterSpacing: -0.02,
    sample: 'Overall Score',
    metaExtra: 'lh 1.1, ls -0.02em',
  },
  {
    name: 'Heading 1',
    size: 26,
    family: 'Ancizar Serif',
    weight: 400,
    lineHeight: 1.2,
    sample: 'Dashboard',
    metaExtra: 'lh 1.2',
  },
  {
    name: 'Heading 2',
    size: 20,
    family: 'Ancizar Serif',
    weight: 400,
    lineHeight: 1.3,
    sample: 'CSAT Trendline',
    metaExtra: 'lh 1.3',
  },
  {
    name: 'Subheading',
    size: 15,
    family: 'Inter',
    weight: 600,
    letterSpacing: 0.01,
    sample: 'Quick Insights',
    metaExtra: 'ls 0.01em',
  },
  {
    name: 'Body',
    size: 15,
    family: 'SF Pro',
    weight: 400,
    lineHeight: 1.6,
    sample:
      'Get imperial restaurant prawns, change that to octopus before the 5 PM service window.',
    metaExtra: 'lh 1.6',
  },
  {
    name: 'Label',
    size: 11,
    family: 'Inter',
    weight: 600,
    letterSpacing: 0.08,
    sample: 'Due Date · Recurrence',
    metaExtra: 'caps, ls 0.08em',
  },
  {
    name: 'Caption',
    size: 12,
    family: 'Inter',
    weight: 400,
    sample: 'Created 20 May 2026 · Assigned to Mustafa, Akin, Venkat',
  },
  {
    name: 'Numeric',
    size: 28,
    family: 'Inter',
    weight: 300,
    letterSpacing: -0.03,
    sample: '4.8',
    metaExtra: 'ls -0.03em',
  },
];

// ─── Pre-computed sample styles ──────────────────────────────────────────────

const sampleStyles = {
  display: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.display,
    fontWeight: tokens.typography.fontWeight.regular,
    lineHeight: tokens.typography.lineHeight.display,
    letterSpacing: tokens.typography.letterSpacing.display,
    color: tokens.colors.textPrimary,
  },
  h1: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.h1,
    fontWeight: tokens.typography.fontWeight.regular,
    lineHeight: tokens.typography.lineHeight.h1,
    color: tokens.colors.textPrimary,
  },
  h2: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.h2,
    fontWeight: tokens.typography.fontWeight.regular,
    lineHeight: tokens.typography.lineHeight.h2,
    color: tokens.colors.textPrimary,
  },
  subhead: {
    fontSize: tokens.typography.fontSize.subhead,
    fontWeight: tokens.typography.fontWeight.semibold,
    letterSpacing: tokens.typography.letterSpacing.subhead,
    color: tokens.colors.textPrimary,
  },
  body: {
    fontSize: tokens.typography.fontSize.body,
    fontWeight: tokens.typography.fontWeight.regular,
    lineHeight: tokens.typography.lineHeight.body,
    color: tokens.colors.textPrimary,
  },
  label: {
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.semibold,
    letterSpacing: tokens.typography.letterSpacing.label,
    textTransform: 'uppercase' as const,
    color: tokens.colors.textPrimary,
  },
  caption: {
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: tokens.typography.fontWeight.regular,
    color: tokens.colors.textMuted,
  },
  numeric: {
    fontSize: tokens.typography.fontSize.numeric,
    fontWeight: tokens.typography.fontWeight.light,
    letterSpacing: tokens.typography.letterSpacing.numeric,
    color: tokens.colors.textPrimary,
  },
} as const;

const sampleStyleMap: Record<string, object> = {
  Display: sampleStyles.display,
  'Heading 1': sampleStyles.h1,
  'Heading 2': sampleStyles.h2,
  Subheading: sampleStyles.subhead,
  Body: sampleStyles.body,
  Label: sampleStyles.label,
  Caption: sampleStyles.caption,
  Numeric: sampleStyles.numeric,
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function TypographyScaleSection() {
  return (
    <View style={styles.section}>
      <SectionLabel title="Typography Scale" />
      {rows.map((row, index) => {
        const isLast = index === rows.length - 1;
        return (
          <View key={row.name} style={[styles.row, isLast && styles.rowLast]}>
            <View style={styles.meta}>
              <Text style={styles.metaName}>
                {row.name} / {row.size}px
              </Text>
              <Text style={styles.metaFamily}>
                {row.family} {row.weight}
              </Text>
              {row.metaExtra ? <Text style={styles.metaExtra}>{row.metaExtra}</Text> : null}
            </View>
            <Text style={[styles.sample, sampleStyleMap[row.name]]}>{row.sample}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  section: {
    marginBottom: tokens.dsSection.marginBottom,
  },
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
  },
  metaName: {
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textHint,
  },
  metaFamily: {
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textHint,
  },
  metaExtra: {
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textHint,
  },
  sample: {
    flex: 1,
  },
});
