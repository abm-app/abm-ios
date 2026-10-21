import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';
import type { ExpenseCategory } from '@/types/expense';
import { Chip } from '@/components/ui';

interface CategoryPickerProps {
  categories: ExpenseCategory[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

// Chips shown inline in the form (a second modal on top of the form modal is avoided).
export default function CategoryPicker({ categories, selectedId, onSelect }: CategoryPickerProps) {
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
      </View>
      {categories.length === 0 && (
        <Text style={styles.hint}>
          No categories yet. Add some with the Categories button on the Expenses screen.
        </Text>
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
  hint: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
  },
});
