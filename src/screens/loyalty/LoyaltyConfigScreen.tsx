import React, { useState, useCallback, useRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { ScreenHeaderV2 } from '@/components/shared/ScreenHeader';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import {
  Backdrop,
  ListSurface,
  LoadingSpinner,
  ErrorState,
  SharedFormModal,
  ConfirmationModal,
} from '@/components/shared';
import { useLoyaltyConfig, useUpdateLoyaltyConfig } from '@/hooks/loyalty/useLoyaltyConfig';
import type { TierThreshold, RewardCatalogItem } from '@/types/loyalty';

const TABS = [
  { id: 'rewards', label: 'Rewards' },
  { id: 'tiers', label: 'Tiers' },
];

// ── RewardsTab ──────────────────────────────────────────────────────────────

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

  // ── Delete confirmation modal state ────────────────────────────────────────
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

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
              <TouchableOpacity onPress={() => onEditItem(index, item)} activeOpacity={0.7}>
                <Feather name="edit" size={15} color={tokens.colors.info} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDeletingIndex(index)}
                style={styles.deleteBtn}
                activeOpacity={0.7}
              >
                <Feather name="trash-2" size={16} color={tokens.colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Delete Confirmation Modal */}
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

// ── TiersTab ─────────────────────────────────────────────────────────────────

function TiersTab({
  tiers,
  onSave,
  isSaving,
}: {
  tiers: TierThreshold[];
  onSave: (updated: TierThreshold[]) => void;
  isSaving: boolean;
}) {
  const [items, setItems] = useState<TierThreshold[]>(tiers);
  const [newName, setNewName] = useState('');
  const [newMin, setNewMin] = useState('');

  const moveUp = useCallback((index: number) => {
    if (index === 0) return;
    setItems(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((index: number) => {
    setItems(prev => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, itemIndex) => itemIndex !== index));
  }, []);

  const addItem = useCallback(() => {
    const min = parseInt(newMin, 10);
    if (!newName.trim() || Number.isNaN(min) || min < 0) {
      Alert.alert('Invalid input', 'Please enter a valid tier name and minimum points.');
      return;
    }
    setItems(prev => [...prev, { name: newName.trim(), minPoints: min }]);
    setNewName('');
    setNewMin('');
  }, [newMin, newName]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollInner}>
      {items.map((item, index) => (
        <View key={item.name + index} style={styles.row}>
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
          <TouchableOpacity
            onPress={() => removeItem(index)}
            style={styles.deleteBtn}
            activeOpacity={0.7}
          >
            <Feather name="trash-2" size={16} color={tokens.colors.danger} />
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.addRow}>
        <TextInput
          style={[styles.addInput, styles.addInputName]}
          placeholder="Tier name"
          placeholderTextColor={tokens.colors.textHint}
          value={newName}
          onChangeText={setNewName}
        />
        <TextInput
          style={[styles.addInput, styles.addInputCost]}
          placeholder="Min pts"
          placeholderTextColor={tokens.colors.textHint}
          value={newMin}
          onChangeText={setNewMin}
          keyboardType="number-pad"
        />
        <TouchableOpacity onPress={addItem} style={styles.addBtn} activeOpacity={0.7}>
          <Feather name="plus" size={18} color={tokens.colors.white} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
        onPress={() => onSave(items)}
        activeOpacity={0.8}
        disabled={isSaving}
      >
        <Text style={styles.saveBtnText}>{isSaving ? 'Saving\u2026' : 'Save Tiers'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ── Main Screen ─────────────────────────────────────────────────────────────

export default function LoyaltyConfigScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('rewards');
  const { data, isLoading, isError, error, refetch } = useLoyaltyConfig();
  const { mutate: updateConfig, isPending: isSaving } = useUpdateLoyaltyConfig();
  const rewardsTabRef = useRef<RewardsTabHandle>(null);

  // ── Add / Edit modal state ───────────────────────────────────────────────
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newCost, setNewCost] = useState('');

  // ── Error modal state ────────────────────────────────────────────────────
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isEditing = editingIndex !== null;

  const bottomPadding =
    tokens.navigation.height +
    tokens.navigation.paddingVertical +
    Math.max(insets.bottom, tokens.navigation.paddingVertical) +
    tokens.spacing.lg;

  const handleOpenAddModal = useCallback(() => {
    setEditingIndex(null);
    setNewName('');
    setNewCost('');
    setAddModalVisible(true);
  }, []);

  const handleOpenEditModal = useCallback((_index: number, item: RewardCatalogItem) => {
    setEditingIndex(_index);
    setNewName(item.name);
    setNewCost(String(item.cost));
    setAddModalVisible(true);
  }, []);

  const handleSubmitReward = useCallback(() => {
    const trimmedName = newName.trim();
    const cost = parseInt(newCost, 10);

    if (!trimmedName || Number.isNaN(cost) || cost < 0) {
      setErrorMessage('Please enter a valid name and point cost.');
      setErrorModalVisible(true);
      return;
    }

    if (isEditing && editingIndex !== null) {
      rewardsTabRef.current?.updateItem(editingIndex, trimmedName, cost);
    } else {
      rewardsTabRef.current?.addItem(trimmedName, cost);
    }

    setNewName('');
    setNewCost('');
    setEditingIndex(null);
    setAddModalVisible(false);
  }, [newName, newCost, isEditing, editingIndex]);

  const handleAutoSaveRewards = useCallback(
    (rewards: RewardCatalogItem[]) => {
      updateConfig({
        rewardCatalog: rewards.map(({ id, name, cost }) => ({ id: id || undefined, name, cost })),
      });
    },
    [updateConfig],
  );

  const handleSaveTiers = useCallback(
    (tiers: TierThreshold[]) => {
      updateConfig(
        { tierThresholds: tiers },
        {
          onSuccess: () => Alert.alert('Saved', 'Tier thresholds updated.'),
          onError: () => Alert.alert('Error', 'Failed to save tiers. Please try again.'),
        },
      );
    },
    [updateConfig],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Backdrop />
      <ScreenHeaderV2
        title="Loyalty Config"
        showRightButton={activeTab === 'rewards'}
        rightButtonText="Add Reward"
        onRightButtonPress={handleOpenAddModal}
        showNotifications={false}
        showBackButton
      />
      <View style={[styles.mainWrapper, { paddingBottom: bottomPadding }]}>
        <ListSurface>
          <View style={styles.tabsContainer}>
            <SegmentedControl tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
          </View>

          {isLoading ? (
            <View style={styles.center}>
              <LoadingSpinner />
            </View>
          ) : isError ? (
            <View style={styles.center}>
              <ErrorState
                message={error?.message ?? 'Failed to load loyalty config.'}
                onRetry={refetch}
              />
            </View>
          ) : !data ? null : activeTab === 'rewards' ? (
            <RewardsTab
              ref={rewardsTabRef}
              rewards={data.rewardCatalog}
              onSave={handleAutoSaveRewards}
              onEditItem={handleOpenEditModal}
            />
          ) : (
            <TiersTab tiers={data.tierThresholds} onSave={handleSaveTiers} isSaving={isSaving} />
          )}
        </ListSurface>
      </View>

      {/* Add / Edit Reward Modal */}
      <SharedFormModal
        visible={addModalVisible}
        title={isEditing ? 'Edit Reward' : 'Add Reward'}
        buttonLabel={isEditing ? 'Save' : 'Add'}
        onClose={() => {
          setAddModalVisible(false);
          setEditingIndex(null);
        }}
        onSubmit={handleSubmitReward}
      >
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Reward Name</Text>
          <TextInput
            style={styles.formInput}
            placeholder="e.g. Free Night Stay"
            placeholderTextColor={tokens.colors.textHint}
            value={newName}
            onChangeText={setNewName}
            autoFocus
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Point Cost</Text>
          <TextInput
            style={styles.formInput}
            placeholder="e.g. 500"
            placeholderTextColor={tokens.colors.textHint}
            value={newCost}
            onChangeText={setNewCost}
            keyboardType="number-pad"
          />
        </View>
      </SharedFormModal>

      {/* Validation Error Modal */}
      <ConfirmationModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        onConfirm={() => setErrorModalVisible(false)}
        title="Invalid Input"
        content={errorMessage}
        confirmLabel="Okay"
        icon={<Feather name="alert-circle" size={28} color={tokens.colors.danger} />}
        iconVariant="danger"
      />
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainWrapper: {
    flex: 1,
    paddingHorizontal: tokens.spacing.xlMd,
    paddingTop: tokens.spacing.md,
  },
  tabsContainer: {
    paddingBottom: tokens.spacing.lgMd,
  },
  scrollInner: {
    flexGrow: 1,
    paddingBottom: tokens.spacing.xl,
  },
  center: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
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
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: tokens.borderRadius.sm,
    backgroundColor: tokens.colors.badgeCatBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    padding: tokens.spacing.xs,
  },
  reorderBtns: {
    flexDirection: 'column',
    gap: 2,
  },
  reorderBtn: {
    padding: 2,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.lg,
  },
  addInput: {
    height: 40,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.border,
    borderRadius: tokens.borderRadius.md,
    paddingHorizontal: tokens.spacing.md,
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textPrimary,
    backgroundColor: tokens.colors.background,
  },
  addInputName: {
    flex: 1,
  },
  addInputCost: {
    width: 80,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: tokens.borderRadius.md,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtn: {
    marginTop: tokens.spacing.xl,
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.borderRadius.pill,
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.white,
  },
  // ── Modal form styles ─────────────────────────────────────────────────────
  formGroup: {
    marginBottom: tokens.spacing.lg,
  },
  formLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: tokens.spacing.sm,
  },
  formInput: {
    height: 48,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.border,
    borderRadius: tokens.borderRadius.md,
    paddingHorizontal: tokens.spacing.md,
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textPrimary,
    backgroundColor: tokens.colors.surface,
  },
});
