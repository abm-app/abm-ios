import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Card from '@/components/ui/Card';
import tokens from '@/theme/tokens';
import type { FinanceSummary } from '@/types/revenue';
import { formatRupees } from '@/utils/formatters';

// ─── Props ──────────────────────────────────────────────────────────────────

interface FinanceBreakdownProps {
  title: string;
  finance: FinanceSummary;
  // Lists extra expenses by category when the server sent them (owner, monthly view).
  showCategories?: boolean;
  // Reports show the room revenue line to managers too; the Revenue screen already shows it.
  alwaysShowRoomRevenue?: boolean;
  style?: StyleProp<ViewStyle>;
}

interface LineProps {
  label: string;
  value: string;
  emphasised?: boolean;
  negative?: boolean;
}

function Line({ label, value, emphasised = false, negative = false }: LineProps) {
  return (
    <View style={[styles.row, emphasised && styles.rowEmphasised]}>
      <Text style={[styles.label, emphasised && styles.labelEmphasised]}>{label}</Text>
      <Text
        style={[styles.value, emphasised && styles.valueEmphasised, negative && styles.negative]}
      >
        {value}
      </Text>
    </View>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

// Shows only the lines the server sent: an owner gets every line and the net, a manager only
// cash received. A missing line is hidden, never shown as zero.
export default function FinanceBreakdown({
  title,
  finance,
  showCategories = false,
  alwaysShowRoomRevenue = false,
  style,
}: FinanceBreakdownProps) {
  const { roomRevenue, cashReceived, pettyCashSpending, extraExpenses, net } = finance;
  const categories = showCategories ? finance.extraExpensesByCategory : undefined;

  return (
    <Card variant="outlined" padded style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>

      {(net !== undefined || alwaysShowRoomRevenue) && (
        <Line label="Room revenue" value={formatRupees(roomRevenue)} />
      )}
      <Line label="Cash received" value={formatRupees(cashReceived)} />
      {pettyCashSpending !== undefined && (
        <Line label="Petty cash spending" value={formatRupees(pettyCashSpending)} />
      )}
      {extraExpenses !== undefined && (
        <Line label="Extra expenses" value={formatRupees(extraExpenses)} />
      )}
      {net !== undefined && (
        <Line label="Net" value={formatRupees(net)} emphasised negative={net < 0} />
      )}

      {categories && categories.length > 0 && (
        <View style={styles.categories}>
          <Text style={styles.title}>Extra expenses by category</Text>
          {categories.map(category => (
            <Line
              key={category.categoryId ?? 'uncategorised'}
              label={category.name}
              value={formatRupees(category.amount)}
            />
          ))}
        </View>
      )}
    </Card>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: tokens.typography.letterSpacing.captionCaps,
    marginBottom: tokens.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: tokens.spacing.xs,
  },
  rowEmphasised: {
    marginTop: tokens.spacing.xs,
    paddingTop: tokens.spacing.sm,
    borderTopWidth: tokens.borderWidth.hairline,
    borderTopColor: tokens.colors.border,
  },
  label: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textSecondary,
  },
  labelEmphasised: {
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textPrimary,
  },
  value: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textPrimary,
  },
  valueEmphasised: {
    fontWeight: tokens.typography.fontWeight.bold,
  },
  negative: {
    color: tokens.colors.danger,
  },
  categories: {
    marginTop: tokens.spacing.lg,
  },
});
