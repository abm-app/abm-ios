import React, { useState, useCallback, useImperativeHandle, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { ConfirmationModal } from '@/components/shared';
import type { RewardCatalogItem } from '@/types/loyalty';

export interface RewardsTabHandle {
  addItem: (name: string, cost: number) => void;
  updateItem: (index: number, name: string, cost: number) => void;
}

const RewardsTab = React.forwardRef<
  RewardsTabHandle,
  {
    rewards: RewardCatalogItem[];
    onSave: (updated: RewardCatalogItem[]) => void;
    onEditItem: (index: number, item: RewardCatalogItem) => void;
  }
>(({ rewards, onSave, onEditItem }, ref) => {
  const [items, setItems] = useState<RewardCatalogItem[]>(rewards);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  useEffect(() => {
    setItems(rewards);
  }, [rewards]);

  useImperativeHandle(ref, () => ({
    addItem: (name: string, cost: number) => {
      setItems(prev => {
        const updated = [...prev, { id: '', name, cost }];
        onSave(updated);
        return updated;
      });
    },
    updateItem: (index: number, name: string, cost: number) => {
      setItems(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], name, cost };
        onSave(updated);
        return updated;
      });
    },
  }));

  const handleRemoveItem = useCallback(
    (index: number) => {
      setItems(prev => {
        const updated = prev.filter((_, itemIndex) => itemIndex !== index);
        onSave(updated);
        return updated;
      });
    },
    [onSave],
  );

  const handleConfirmDelete = useCallback(() => {
    if (deletingIndex !== null) {
      handleRemoveItem(deletingIndex);
      setDeletingIndex(null);
    }
  }, [deletingIndex, handleRemoveItem]);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollInner}>
        {items.length === 0 && (
          <View style={styles.emptyRow}>
            <Feather name="gift" size={24} color={tokens.colors.textHint} />
            <Text style={styles.emptyText}>
              No rewards yet. Tap &quot;Add Reward&quot; above to create one.
            </Text>
          </View>
        )}
        {items.map((item, index) => (
          <View key={item.id || index} style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowName}>{item.name}</Text>
              <Text style={styles.rowSub}>{item.cost} pts</Text>
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={() => onEditItem(index, item)}
                style={styles.iconButton}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Edit ${item.name}`}
              >
                <Feather name="edit-2" size={16} color={tokens.colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDeletingIndex(index)}
                style={[styles.iconButton, styles.deleteButton]}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${item.name}`}
              >
                <Feather name="trash-2" size={16} color={tokens.colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <ConfirmationModal
        visible={deletingIndex !== null}
        onClose={() => setDeletingIndex(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Reward"
        content="Are you sure you want to delete this reward? This action cannot be undone."
        confirmLabel="Delete"
        icon={<Feather name="trash-2" size={28} color={tokens.colors.danger} />}
        iconVariant="danger"
      />
    </>
  );
});

RewardsTab.displayName = 'RewardsTab';
export default RewardsTab;

const styles = StyleSheet.create({
  scrollInner: {
    flexGrow: 1,
    paddingBottom: tokens.spacing.xl,
  },
  emptyRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.xxxl,
    gap: tokens.spacing.md,
  },
  emptyText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textHint,
    textAlign: 'center',
    paddingHorizontal: tokens.spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: tokens.borderWidth.hairline,
    borderBottomColor: tokens.colors.border,
    gap: tokens.spacing.sm,
  },
  rowLeft: {
    flex: 1,
  },
  rowName: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.textPrimary,
  },
  rowSub: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginTop: 2,
  },
  actionRow: {
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
