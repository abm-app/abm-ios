import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';

export interface MiniStat {
  id: string;
  value: string | number;
  label: string;
}

export interface DashboardScoreCardProps {
  /** Numeric score displayed in large heading font (e.g. "4.8"). */
  score: string | number;
  /** Uppercase subtitle below the score (e.g. "Overall Score"). */
  label: string;
  /** Compact stats rendered in a horizontal row below the label. Each stat shows a value
   * and an uppercase label on a muted surface background. */
  miniStats: MiniStat[];
  /** Additional container styles merged after card defaults. */
  style?: import('react-native').StyleProp<import('react-native').ViewStyle>;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DashboardScoreCard({
  score,
  label,
  miniStats,
  style,
}: DashboardScoreCardProps) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.score}>{score}</Text>
      <Text style={styles.scoreLabel}>{label}</Text>
      <View style={styles.miniStatsRow}>
        {miniStats.map(stat => (
          <View key={stat.id} style={styles.miniStat}>
            <Text style={styles.miniStatValue}>{stat.value}</Text>
            <Text style={styles.miniStatLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
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
    paddingVertical: tokens.scoreCard.paddingVertical,
    paddingHorizontal: tokens.scoreCard.paddingHorizontal,
  },
  score: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.score,
    fontWeight: tokens.typography.fontWeight.regular,
    lineHeight: tokens.typography.fontSize.score,
    letterSpacing: tokens.typography.letterSpacing.score,
  },
  scoreLabel: {
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: tokens.typography.letterSpacing.scoreSub,
    marginTop: tokens.scoreCard.subtitleMarginTop,
    marginBottom: tokens.scoreCard.subtitleMarginBottom,
  },
  miniStatsRow: {
    flexDirection: 'row',
    gap: tokens.scoreCard.miniStatGap,
  },
  miniStat: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.sm,
    padding: tokens.scoreCard.miniStatPadding,
    alignItems: 'center',
  },
  miniStatValue: {
    fontSize: tokens.typography.fontSize.miniStatNumber,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.textPrimary,
  },
  miniStatLabel: {
    fontSize: tokens.typography.fontSize.miniStatLabel,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.textHint,
    letterSpacing: tokens.typography.letterSpacing.miniStatLabel,
    textTransform: 'uppercase',
    marginTop: tokens.statCard.miniStatLabelMarginTop,
  },
});
