import React, { useState, useCallback, useImperativeHandle, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { ConfirmationModal } from '@/components/shared';
import type { TierThreshold } from '@/types/loyalty';

export interface TiersTabHandle {
  addItem: (name: string, minPoints: number) => void;
  updateItem: (index: number, name: string, minPoints: number) => void;
}

const TiersTab = React.forwardRef<
  TiersTabHandle,
  {
    tiers: TierThreshold[];
    onSave: (updated: TierThreshold[]) => void;
    onEditItem: (index: number, item: TierThreshold) => void;
  }
>(({ tiers, onSave, onEditItem }, ref) => {
  const [items, setItems] = useState<TierThreshold[]>(tiers);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  useEffect(() => {
    setItems(tiers);
  }, [tiers]);

  useImperativeHandle(ref, () => ({
    addItem: (name: string, minPoints: number) => {
      setItems(prev => {
        const updated = [...prev, { name, minPoints }];
        onSave(updated);
        return updated;
      });
    },
    updateItem: (index: number, name: string, minPoints: number) => {
      setItems(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], name, minPoints };
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

  const moveUp = useCallback(
    (index: number) => {
      if (index === 0) return;
      setItems(prev => {
        const next = [...prev];
        [next[index - 1], next[index]] = [next[index], next[index - 1]];
        onSave(next);
        return next;
      });
    },
    [onSave],
  );

  const moveDown = useCallback(
    (index: number) => {
      setItems(prev => {
        if (index === prev.length - 1) return prev;
        const next = [...prev];
        [next[index], next[index + 1]] = [next[index + 1], next[index]];
        onSave(next);
        return next;
      });
    },
    [onSave],
  );

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollInner}>
        {items.length === 0 && (
          <View style={styles.emptyRow}>
            <Feather name="layers" size={24} color={tokens.colors.textHint} />
            <Text style={styles.emptyText}>
              No tiers yet. Tap &quot;Add Tier&quot; above to create one.
            </Text>
          </View>
        )}
        {items.map((item, index) => (
          <View key={item.name} style={styles.row}>
            <View style={styles.reorderBtns}>
              <TouchableOpacity
                onPress={() => moveUp(index)}
                disabled={index === 0}
                activeOpacity={0.7}
                style={styles.reorderBtn}
              >
                <Feather
                  name="chevron-up"
                  size={16}
                  color={index === 0 ? tokens.colors.textHint : tokens.colors.textPrimary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => moveDown(index)}
                disabled={index === items.length - 1}
                activeOpacity={0.7}
                style={styles.reorderBtn}
              >
                <Feather
                  name="chevron-down"
                  size={16}
                  color={
                    index === items.length - 1 ? tokens.colors.textHint : tokens.colors.textPrimary
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={styles.rowLeft}>
              <Text style={[styles.rowName, styles.capitalize]}>{item.name}</Text>
              <Text style={styles.rowSub}>{item.minPoints} pts minimum</Text>
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
        title="Delete Tier"
        content="Are you sure you want to delete this tier? This action cannot be undone."
        confirmLabel="Delete"
        icon={<Feather name="trash-2" size={28} color={tokens.colors.danger} />}
        iconVariant="danger"
      />
    </>
  );
});

TiersTab.displayName = 'TiersTab';
export default TiersTab;

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
  capitalize: {
    textTransform: 'capitalize',
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
  reorderBtns: {
    flexDirection: 'column',
    gap: 2,
  },
  reorderBtn: {
    padding: 2,
  },
});
