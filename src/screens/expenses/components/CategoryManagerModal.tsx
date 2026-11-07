import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import {
  useCreateCategory,
  useExpenseCategories,
  useUpdateCategory,
} from '@/hooks/expenses/useExpenses';
import type { ExpenseCategory } from '@/types/expense';
import { getApiErrorMessage } from '@/utils/apiError';
import { MAX_CATEGORY_NAME_LENGTH } from '@/utils/expenseAmount';
import { SharedFormModal } from '@/components/shared';
import { Button, Input } from '@/components/ui';

interface CategoryManagerModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CategoryManagerModal({ visible, onClose }: CategoryManagerModalProps) {
  const { data: categories = [], isLoading, isError } = useExpenseCategories(true);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [newName, setNewName] = useState('');
  const [addError, setAddError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editError, setEditError] = useState('');

  const handleAdd = () => {
    const name = newName.trim();
    if (name === '') return;
    setAddError('');
    createCategory.mutate(name, {
      onSuccess: () => setNewName(''),
      onError: error => setAddError(getApiErrorMessage(error, 'Could not add the category')),
    });
  };

  const startRename = (category: ExpenseCategory) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditError('');
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditError('');
  };

  const saveRename = (category: ExpenseCategory) => {
    const name = editName.trim();
    if (name === '') return;
    if (name === category.name) {
      cancelRename();
      return;
    }
    setEditError('');
    updateCategory.mutate(
      { id: category.id, data: { name } },
      {
        onSuccess: cancelRename,
        onError: error => setEditError(getApiErrorMessage(error, 'Could not rename the category')),
      },
    );
  };

  const toggleActive = (category: ExpenseCategory, active: boolean) => {
    updateCategory.mutate({ id: category.id, data: { active } });
  };

  const renderList = () => {
    if (isLoading) return <Text style={styles.hint}>Loading categories...</Text>;
    if (isError) return <Text style={styles.errorText}>Could not load categories.</Text>;
    if (categories.length === 0) {
      return <Text style={styles.hint}>No categories yet. Add your first one above.</Text>;
    }

    return categories.map(category => (
      <View key={category.id} style={styles.row}>
        {editingId === category.id ? (
          <View style={styles.editArea}>
            <Input
              value={editName}
              onChangeText={setEditName}
              maxLength={MAX_CATEGORY_NAME_LENGTH}
              error={editError || undefined}
              style={styles.editInput}
            />
            <View style={styles.editActions}>
              <TouchableOpacity
                onPress={() => saveRename(category)}
                style={styles.iconButton}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Save name"
              >
                <Feather name="check" size={16} color={tokens.colors.success} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={cancelRename}
                style={styles.iconButton}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Cancel rename"
              >
                <Feather name="x" size={16} color={tokens.colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <Text style={[styles.name, !category.active && styles.nameInactive]} numberOfLines={1}>
              {category.name}
            </Text>
            <TouchableOpacity
              onPress={() => startRename(category)}
              style={styles.iconButton}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Rename ${category.name}`}
            >
              <Feather name="edit-2" size={16} color={tokens.colors.textPrimary} />
            </TouchableOpacity>
            <Switch
              value={category.active}
              onValueChange={value => toggleActive(category, value)}
              trackColor={{ false: tokens.colors.border, true: tokens.colors.success }}
              accessibilityLabel={`${category.name} active`}
            />
          </>
        )}
      </View>
    ));
  };

  return (
    <SharedFormModal
      visible={visible}
      title="Categories"
      buttonLabel="Done"
      onClose={onClose}
      onSubmit={onClose}
    >
      <View style={styles.container}>
        <View style={styles.addRow}>
          <View style={styles.addInput}>
            <Input
              label="New category"
              placeholder="e.g. Diesel"
              value={newName}
              onChangeText={setNewName}
              maxLength={MAX_CATEGORY_NAME_LENGTH}
              error={addError || undefined}
            />
          </View>
          <Button
            label="Add"
            onPress={handleAdd}
            size="sm"
            disabled={newName.trim() === '' || createCategory.isPending}
            loading={createCategory.isPending}
          />
        </View>

        <Text style={styles.hint}>
          Turn a category off to stop using it for new expenses. Old expenses keep it.
        </Text>

        <View style={styles.list}>{renderList()}</View>
      </View>
    </SharedFormModal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: tokens.spacing.md,
    gap: tokens.spacing.lg,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: tokens.spacing.md,
  },
  addInput: {
    flex: 1,
  },
  list: {
    gap: tokens.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
  },
  name: {
    flex: 1,
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.textPrimary,
  },
  nameInactive: {
    color: tokens.colors.textMuted,
  },
  editArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  editInput: {
    flex: 1,
  },
  editActions: {
    flexDirection: 'row',
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
  hint: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
  },
  errorText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.danger,
  },
});
