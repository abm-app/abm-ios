import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import tokens from '@/theme/tokens';
import { useCreateCategory } from '@/hooks/expenses/useExpenses';
import type { ExpenseCategory } from '@/types/expense';
import { getApiErrorMessage } from '@/utils/apiError';
import { MAX_CATEGORY_NAME_LENGTH } from '@/utils/expenseAmount';
import { Button, Chip, Input } from '@/components/ui';

interface CategoryPickerProps {
  categories: ExpenseCategory[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  // Closes the form and opens the full category manager (rename, switch off).
  onManage?: () => void;
}

// Chips shown inline in the form (a second modal on top of the form modal is avoided).
// A new category can be created right here and is selected straight away.
export default function CategoryPicker({
  categories,
  selectedId,
  onSelect,
  onManage,
}: CategoryPickerProps) {
  const createCategory = useCreateCategory();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [addError, setAddError] = useState('');

  const handleAdd = () => {
    const name = newName.trim();
    if (name === '') return;
    setAddError('');
    createCategory.mutate(name, {
      onSuccess: created => {
        onSelect(created.id);
        setNewName('');
        setIsAdding(false);
      },
      onError: error => setAddError(getApiErrorMessage(error, 'Could not add the category')),
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewName('');
    setAddError('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.chips}>
        <Chip
          label="No category"
          active={selectedId === null}
          tone="primary"
          onPress={() => onSelect(null)}
        />
        {categories.map(category => (
          <Chip
            key={category.id}
            label={category.active ? category.name : `${category.name} (inactive)`}
            active={selectedId === category.id}
            tone="primary"
            onPress={() => onSelect(category.id)}
          />
        ))}
        {!isAdding && <Chip label="+ New category" onPress={() => setIsAdding(true)} />}
      </View>

      {categories.length === 0 && !isAdding && (
        <Text style={styles.hint}>{'No categories yet. Tap + New category to add one.'}</Text>
      )}

      {isAdding && (
        <View style={styles.addRow}>
          <View style={styles.addInput}>
            <Input
              placeholder="e.g. Diesel"
              value={newName}
              onChangeText={setNewName}
              maxLength={MAX_CATEGORY_NAME_LENGTH}
              error={addError || undefined}
              autoFocus
            />
          </View>
          <Button
            label="Add"
            onPress={handleAdd}
            size="sm"
            disabled={newName.trim() === '' || createCategory.isPending}
            loading={createCategory.isPending}
          />
          <Button label="Cancel" onPress={handleCancel} size="sm" variant="secondary" />
        </View>
      )}

      {onManage && (
        <TouchableOpacity onPress={onManage} activeOpacity={0.7} accessibilityRole="button">
          <Text style={styles.manageLink}>Rename or turn off categories</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: tokens.spacing.sm,
  },
  addInput: {
    flex: 1,
  },
  hint: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
  },
  manageLink: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.info,
  },
});
