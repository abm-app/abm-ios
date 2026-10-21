import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';
import { PROPERTY_DISPLAY_NAMES } from '@/types/audit';
import type { AuditProperty } from '@/types/audit';
import type {
  CreateExpenseInput,
  Expense,
  ExpenseCategory,
  UpdateExpenseInput,
} from '@/types/expense';
import { formatDate } from '@/utils/dateUtils';
import { MAX_DESCRIPTION_LENGTH, parseAmountInput } from '@/utils/expenseAmount';
import { SharedFormModal, SegmentedControl } from '@/components/shared';
import { Input } from '@/components/ui';
import CategoryPicker from './CategoryPicker';

interface ExpenseFormModalProps {
  visible: boolean;
  onClose: () => void;
  initialExpense?: Expense | null;
  allowedProperties: AuditProperty[];
  defaultProperty: AuditProperty | null;
  categories: ExpenseCategory[];
  errorMessage?: string;
  onSubmitCreate: (data: CreateExpenseInput) => void;
  onSubmitUpdate: (id: string, data: UpdateExpenseInput) => void;
  isSubmitting: boolean;
}

export default function ExpenseFormModal({
  visible,
  onClose,
  initialExpense,
  allowedProperties,
  defaultProperty,
  categories,
  errorMessage,
  onSubmitCreate,
  onSubmitUpdate,
  isSubmitting,
}: ExpenseFormModalProps) {
  const isEditing = !!initialExpense;

  const [property, setProperty] = useState<AuditProperty | null>(null);
  const [amountText, setAmountText] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [prevVisible, setPrevVisible] = useState(visible);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      if (initialExpense) {
        setProperty(initialExpense.property);
        setAmountText(String(initialExpense.amount));
        setDescription(initialExpense.description);
        setCategoryId(initialExpense.categoryId);
      } else {
        setProperty(allowedProperties.length === 1 ? allowedProperties[0] : defaultProperty);
        setAmountText('');
        setDescription('');
        setCategoryId(null);
      }
    }
  }

  const amount = parseAmountInput(amountText);
  const trimmedDescription = description.trim();
  const amountError =
    amountText.trim() !== '' && amount === null
      ? 'Enter an amount above 0 with up to 2 decimals'
      : undefined;

  const isFormValid =
    amount !== null &&
    trimmedDescription !== '' &&
    trimmedDescription.length <= MAX_DESCRIPTION_LENGTH &&
    property !== null;

  const handleSubmit = () => {
    if (amount === null || property === null) return;

    if (isEditing && initialExpense) {
      const payload: UpdateExpenseInput = {};
      if (amount !== initialExpense.amount) payload.amount = amount;
      if (trimmedDescription !== initialExpense.description) {
        payload.description = trimmedDescription;
      }
      if (categoryId !== initialExpense.categoryId) payload.categoryId = categoryId;

      if (Object.keys(payload).length === 0) {
        onClose();
        return;
      }
      onSubmitUpdate(initialExpense.id, payload);
    } else {
      onSubmitCreate({
        property,
        amount,
        description: trimmedDescription,
        ...(categoryId ? { categoryId } : {}),
      });
    }
  };

  // An inactive category the expense already uses stays selectable; others are hidden.
  const selectableCategories = categories.filter(
    c => c.active || c.id === initialExpense?.categoryId,
  );

  return (
    <SharedFormModal
      visible={visible}
      title={isEditing ? 'Edit Expense' : 'New Expense'}
      buttonLabel={isEditing ? 'Save Changes' : 'Add Expense'}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitDisabled={!isFormValid}
    >
      <View style={styles.formContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>HOTEL</Text>
          {isEditing || allowedProperties.length === 1 ? (
            <Text style={styles.readOnlyText}>
              {property ? PROPERTY_DISPLAY_NAMES[property] : ''}
            </Text>
          ) : (
            <SegmentedControl
              tabs={allowedProperties.map(p => ({ id: p, label: PROPERTY_DISPLAY_NAMES[p] }))}
              activeTab={property ?? ''}
              onChange={id => setProperty(id as AuditProperty)}
              style={styles.segmentedControl}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DATE</Text>
          <Text style={styles.readOnlyText}>
            {isEditing && initialExpense
              ? (formatDate(initialExpense.date) ?? initialExpense.date)
              : 'Today'}
          </Text>
        </View>

        <Input
          label="Amount (₹)"
          placeholder="e.g. 1500"
          value={amountText}
          onChangeText={setAmountText}
          keyboardType="decimal-pad"
          error={amountError}
        />

        <Input
          label="Description"
          placeholder="e.g. Generator diesel"
          value={description}
          onChangeText={setDescription}
          maxLength={MAX_DESCRIPTION_LENGTH}
        />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CATEGORY (OPTIONAL)</Text>
          <CategoryPicker
            categories={selectableCategories}
            selectedId={categoryId}
            onSelect={setCategoryId}
          />
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </View>
    </SharedFormModal>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    paddingVertical: tokens.spacing.md,
    gap: tokens.spacing.xl,
  },
  section: {
    gap: tokens.spacing.sm,
  },
  sectionLabel: {
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textPrimary,
    letterSpacing: tokens.typography.letterSpacing.label,
    textTransform: 'uppercase',
    marginBottom: tokens.form.labelBottomMargin,
  },
  readOnlyText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textSecondary,
  },
  segmentedControl: {
    width: '100%',
  },
  errorText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.danger,
  },
});
