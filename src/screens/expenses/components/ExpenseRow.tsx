import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { PROPERTY_DISPLAY_NAMES } from '@/types/audit';
import type { Expense } from '@/types/expense';
import { formatDate } from '@/utils/dateUtils';
import { formatRupees } from '@/utils/formatters';

interface ExpenseRowProps {
  expense: Expense;
  showProperty: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  isLast?: boolean;
}

export default function ExpenseRow({
  expense,
  showProperty,
  onEdit,
  onDelete,
  isLast,
}: ExpenseRowProps) {
  const details = [
    expense.categoryName ?? 'No category',
    formatDate(expense.date) ?? expense.date,
    ...(showProperty ? [PROPERTY_DISPLAY_NAMES[expense.property]] : []),
  ].join(' · ');

  return (
    <View style={[styles.container, !isLast && styles.borderBottom]}>
      <TouchableOpacity
        onPress={() => onEdit(expense)}
        style={styles.leftContent}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Edit ${expense.description}`}
      >
        <Text style={styles.description} numberOfLines={1}>
          {expense.description}
        </Text>
        <Text style={styles.details} numberOfLines={1}>
          {details}
        </Text>
      </TouchableOpacity>

      <Text style={styles.amount}>{formatRupees(expense.amount)}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onEdit(expense)}
          style={styles.iconButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${expense.description}`}
        >
          <Feather name="edit-2" size={16} color={tokens.colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete(expense)}
          style={[styles.iconButton, styles.deleteButton]}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${expense.description}`}
        >
          <Feather name="trash-2" size={16} color={tokens.colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.xl,
    backgroundColor: tokens.colors.white,
  },
  borderBottom: {
    borderBottomWidth: tokens.borderWidth.hairline,
    borderBottomColor: tokens.colors.border,
  },
  leftContent: {
    flex: 1,
    marginRight: tokens.spacing.md,
  },
  description: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.textPrimary,
  },
  details: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginTop: tokens.spacing.xs,
  },
  amount: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textPrimary,
    marginRight: tokens.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: tokens.borderRadius.lg,
    backgroundColor: tokens.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: tokens.colors.badgeHighBg,
  },
});
