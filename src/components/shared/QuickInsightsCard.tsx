import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';

export type InsightTone = 'danger' | 'warning' | 'info' | 'muted';

export interface InsightItem {
  id: string;
  label: string;
  tone: InsightTone;
  percentage: number;
}

export interface QuickInsightsCardProps {
  items: InsightItem[];
  style?: import('react-native').StyleProp<import('react-native').ViewStyle>;
}

// ─── Pre-created token-derived style maps (module-level, computed once) ──────

const toneColorMap: Record<InsightTone, string> = {
  danger: tokens.colors.danger,
  warning: tokens.colors.warning,
  info: tokens.colors.info,
  muted: tokens.colors.insightTrackMuted,
};

// ─── Utility: clamp percentage to 0–100 ──────────────────────────────────────

function clampPercentage(value: number): number {
  return Math.max(0, Math.min(100, value));
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function QuickInsightsCard({ items, style }: QuickInsightsCardProps) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>Quick Insights</Text>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const clamped = clampPercentage(item.percentage);
        const barColor = toneColorMap[item.tone];

        return (
          <View key={item.id} style={[styles.row, !isLast && styles.rowDivider]}>
            <View style={[styles.dot, { backgroundColor: barColor }]} />
            <Text style={styles.label}>{item.label}</Text>
            <View style={styles.track}>
              <View style={[styles.bar, { width: `${clamped}%`, backgroundColor: barColor }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ─── Static base styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.background,
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.border,
    borderRadius: tokens.borderRadius.xl,
    paddingVertical: tokens.insight.paddingVertical,
    paddingHorizontal: tokens.insight.paddingHorizontal,
  },
  title: {
    fontSize: tokens.typography.fontSize.button,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.insight.titleMarginBottom,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.insight.rowGap,
    paddingVertical: tokens.insight.rowPaddingVertical,
  },
  rowDivider: {
    borderBottomWidth: tokens.borderWidth.hairline,
    borderBottomColor: tokens.colors.border,
  },
  dot: {
    width: tokens.insight.dotSize,
    height: tokens.insight.dotSize,
    borderRadius: tokens.insight.dotSize / 2,
  },
  label: {
    flex: 1,
    fontSize: tokens.typography.fontSize.chip,
    color: tokens.colors.textPrimary,
  },
  track: {
    width: tokens.insight.trackWidth,
    height: tokens.insight.trackHeight,
    backgroundColor: tokens.colors.border,
    borderRadius: tokens.insight.trackBorderRadius,
    overflow: 'hidden',
  },
  bar: {
    height: tokens.insight.barHeight,
    borderRadius: tokens.insight.barBorderRadius,
  },
});
