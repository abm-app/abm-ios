import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import tokens from '@/theme/tokens';
import { PROPERTY_DISPLAY_NAMES } from '@/types/audit';
import type { MenuStackParamList } from '@/navigation/types';
import type { CreateExpenseInput, Expense, UpdateExpenseInput } from '@/types/expense';
import { getApiErrorMessage } from '@/utils/apiError';
import {
  useCreateExpense,
  useDeleteExpense,
  useExpenseCategories,
  useExpenses,
  usePettyCash,
  useUpdateExpense,
} from '@/hooks/expenses/useExpenses';
import { useAllowedProperties, useExpenseFilters } from '@/hooks/expenses/useExpenseFilters';
import type { PropertyFilter } from '@/hooks/expenses/useExpenseFilters';
import {
  AlertModal,
  Backdrop,
  ConfirmationModal,
  EmptyState,
  ErrorState,
  LoadingSpinner,
  ScreenHeaderV2,
  SegmentedControl,
} from '@/components/shared';
import { Card } from '@/components/ui';
import ExpenseRow from './components/ExpenseRow';
import ExpenseFormModal from './components/ExpenseFormModal';
import CategoryManagerModal from './components/CategoryManagerModal';
import MonthSwitcher from './components/MonthSwitcher';
import PettyCashRow from './components/PettyCashRow';

type ExpenseTab = 'expenses' | 'pettyCash';

const TAB_OPTIONS = [
  { id: 'expenses', label: 'Extra expenses' },
  { id: 'pettyCash', label: 'Petty cash' },
];

type MenuNavProp = NativeStackNavigationProp<MenuStackParamList>;

export default function ExpensesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<MenuNavProp>();

  const allowedProperties = useAllowedProperties();
  const filters = useExpenseFilters();
  const {
    data: expenses,
    isLoading,
    isError,
    error,
    refetch,
  } = useExpenses(filters.from, filters.to, filters.apiProperty);
  const [tab, setTab] = useState<ExpenseTab>('expenses');
  const pettyCashQuery = usePettyCash(
    filters.from,
    filters.to,
    filters.apiProperty,
    tab === 'pettyCash',
  );
  const { data: categories = [] } = useExpenseCategories(true);
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formError, setFormError] = useState('');
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);

  const rootStyle = useMemo(() => [styles.root, { paddingTop: insets.top }], [insets.top]);

  const propertyTabs = useMemo(
    () => [
      { id: 'all', label: 'All' },
      ...allowedProperties.map(p => ({ id: p, label: PROPERTY_DISPLAY_NAMES[p] })),
    ],
    [allowedProperties],
  );

  const handleOpenCreate = () => {
    setEditingExpense(null);
    setFormError('');
    setIsFormVisible(true);
  };

  const handleOpenEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormError('');
    setIsFormVisible(true);
  };

  const handleSubmitCreate = (data: CreateExpenseInput) => {
    setFormError('');
    createExpense.mutate(data, {
      onSuccess: () => setIsFormVisible(false),
      onError: err => setFormError(getApiErrorMessage(err, 'Could not save the expense')),
    });
  };

  const handleSubmitUpdate = (id: string, data: UpdateExpenseInput) => {
    setFormError('');
    updateExpense.mutate(
      { id, data },
      {
        onSuccess: () => setIsFormVisible(false),
        onError: err => setFormError(getApiErrorMessage(err, 'Could not save the changes')),
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!deletingExpense) return;
    deleteExpense.mutate(deletingExpense.id, {
      onSuccess: () => setDeletingExpense(null),
      onError: err => {
        setDeletingExpense(null);
        setDeleteError(getApiErrorMessage(err, 'Could not delete the expense'));
      },
    });
  };

  const renderExpenseList = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <LoadingSpinner />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerContainer}>
          <ErrorState
            message={getApiErrorMessage(error, 'Failed to load expenses')}
            onRetry={() => refetch()}
          />
        </View>
      );
    }

    if (!expenses || expenses.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <EmptyState
            icon="credit-card"
            title="No expenses"
            subtitle={`Nothing recorded for ${filters.monthLabel}.`}
            action={{ label: 'Add expense', onPress: handleOpenCreate }}
          />
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card variant="shadow" style={styles.listCard}>
          {expenses.map((expense, index) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              showProperty={allowedProperties.length > 1}
              onEdit={handleOpenEdit}
              onDelete={setDeletingExpense}
              isLast={index === expenses.length - 1}
            />
          ))}
        </Card>
      </ScrollView>
    );
  };

  const renderPettyCashList = () => {
    if (pettyCashQuery.isLoading) {
      return (
        <View style={styles.centerContainer}>
          <LoadingSpinner />
        </View>
      );
    }

    if (pettyCashQuery.isError) {
      return (
        <View style={styles.centerContainer}>
          <ErrorState
            message={getApiErrorMessage(pettyCashQuery.error, 'Failed to load petty cash')}
            onRetry={() => pettyCashQuery.refetch()}
          />
        </View>
      );
    }

    const entries = pettyCashQuery.data;
    if (!entries || entries.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <EmptyState
            icon="credit-card"
            title="No petty cash"
            subtitle={`Nothing recorded in Atithi for ${filters.monthLabel}.`}
          />
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card variant="shadow" style={styles.listCard}>
          {entries.map((entry, index) => (
            <PettyCashRow
              key={entry.id}
              entry={entry}
              showProperty={allowedProperties.length > 1}
              isLast={index === entries.length - 1}
            />
          ))}
        </Card>
      </ScrollView>
    );
  };

  return (
    <View style={rootStyle}>
      <Backdrop />

      <ScreenHeaderV2
        title="Expenses"
        showBackButton
        onBackPress={() => navigation.goBack()}
        showRightButton={tab === 'expenses'}
        rightButtonText="+ New"
        onRightButtonPress={handleOpenCreate}
        showNotifications={false}
      />

      <View style={styles.controls}>
        <SegmentedControl
          tabs={TAB_OPTIONS}
          activeTab={tab}
          onChange={id => setTab(id as ExpenseTab)}
          style={styles.segmentedControl}
        />
        <MonthSwitcher
          label={filters.monthLabel}
          canGoNext={!filters.isCurrentMonth}
          onPrevious={filters.goToPreviousMonth}
          onNext={filters.goToNextMonth}
        />
        {allowedProperties.length > 1 && (
          <SegmentedControl
            tabs={propertyTabs}
            activeTab={filters.property}
            onChange={id => filters.setProperty(id as PropertyFilter)}
            style={styles.segmentedControl}
          />
        )}
      </View>

      {tab === 'expenses' ? renderExpenseList() : renderPettyCashList()}

      <ExpenseFormModal
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        initialExpense={editingExpense}
        allowedProperties={allowedProperties}
        defaultProperty={filters.apiProperty ?? null}
        categories={categories}
        errorMessage={formError}
        onManageCategories={() => {
          setIsFormVisible(false);
          setIsCategoriesVisible(true);
        }}
        onSubmitCreate={handleSubmitCreate}
        onSubmitUpdate={handleSubmitUpdate}
        isSubmitting={createExpense.isPending || updateExpense.isPending}
      />

      <CategoryManagerModal
        visible={isCategoriesVisible}
        onClose={() => setIsCategoriesVisible(false)}
      />

      <ConfirmationModal
        visible={deletingExpense !== null}
        onClose={() => setDeletingExpense(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense"
        content={`Delete "${deletingExpense?.description ?? ''}"? It will no longer count towards the net figure.`}
        confirmLabel={deleteExpense.isPending ? 'Deleting...' : 'Delete Expense'}
        confirmDisabled={deleteExpense.isPending}
        iconVariant="danger"
      />

      <AlertModal
        visible={deleteError !== ''}
        onClose={() => setDeleteError('')}
        title="Could not delete"
        content={deleteError}
        iconVariant="danger"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  controls: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    gap: tokens.spacing.md,
  },
  segmentedControl: {
    width: '100%',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
  },
  listCard: {
    padding: 0,
    overflow: 'hidden',
  },
});
