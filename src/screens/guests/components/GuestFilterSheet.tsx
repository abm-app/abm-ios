import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';
import { FilterSheet } from '@/components/shared';
import { Button, Chip } from '@/components/ui';

const LAPSED_OPTIONS = [
  { label: '1 month', value: 30 },
  { label: '3 months', value: 90 },
  { label: '6 months', value: 180 },
  { label: '12 months', value: 365 },
];

interface GuestFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  initialTier: string;
  initialLapsed: number | null;
  initialDoNotContact: 'true' | 'false' | undefined;
  tierOptions: string[];
  onApply: (filters: {
    tier: string;
    lapsed: number | null;
    doNotContact: 'true' | 'false' | undefined;
  }) => void;
}

export default function GuestFilterSheet({
  visible,
  onClose,
  initialTier,
  initialLapsed,
  initialDoNotContact,
  tierOptions,
  onApply,
}: GuestFilterSheetProps) {
  const [draftTier, setDraftTier] = useState(initialTier);
  const [draftLapsed, setDraftLapsed] = useState(initialLapsed);
  const [draftDoNotContact, setDraftDoNotContact] = useState(initialDoNotContact);
  const [prevVisible, setPrevVisible] = useState(visible);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setDraftTier(initialTier);
      setDraftLapsed(initialLapsed);
      setDraftDoNotContact(initialDoNotContact);
    }
  }

  const handleApply = () => {
    onApply({
      tier: draftTier,
      lapsed: draftLapsed,
      doNotContact: draftDoNotContact,
    });
    onClose();
  };

  const handleClearAll = () => {
    setDraftTier('All');
    setDraftLapsed(null);
    setDraftDoNotContact(undefined);
  };
  return (
    <FilterSheet
      title="Filters"
      visible={visible}
      onClose={onClose}
      showDragIndicator
      footer={
        <View style={styles.filterFooter}>
          <Button
            label="Clear All"
            variant="secondary"
            style={styles.filterButton}
            onPress={handleClearAll}
          />
          <Button
            label="Apply"
            variant="primary"
            style={styles.filterButton}
            onPress={handleApply}
          />
        </View>
      }
    >
      <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>Tier</Text>
        <View style={styles.chipGroup}>
          {tierOptions.map(tier => (
            <Chip
              key={tier}
              label={tier}
              active={draftTier === tier}
              tone={draftTier === tier ? 'primary' : 'default'}
              onPress={() => setDraftTier(tier)}
              style={styles.filterChip}
            />
          ))}
        </View>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>Lapsed</Text>
        <View style={styles.chipGroup}>
          {LAPSED_OPTIONS.map(option => (
            <Chip
              key={option.value}
              label={option.label}
              active={draftLapsed === option.value}
              tone={draftLapsed === option.value ? 'primary' : 'default'}
              onPress={() => setDraftLapsed(prev => (prev === option.value ? null : option.value))}
              style={styles.filterChip}
            />
          ))}
        </View>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>Contact Preference</Text>
        <View style={styles.chipGroup}>
          <Chip
            label="Opted In"
            active={draftDoNotContact === 'false'}
            tone={draftDoNotContact === 'false' ? 'primary' : 'default'}
            onPress={() => setDraftDoNotContact(prev => (prev === 'false' ? undefined : 'false'))}
            style={styles.filterChip}
          />
          <Chip
            label="Opted Out"
            active={draftDoNotContact === 'true'}
            tone={draftDoNotContact === 'true' ? 'primary' : 'default'}
            onPress={() => setDraftDoNotContact(prev => (prev === 'true' ? undefined : 'true'))}
            style={styles.filterChip}
          />
        </View>
      </View>
    </FilterSheet>
  );
}

const styles = StyleSheet.create({
  filterFooter: {
    flex: 1,
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  filterButton: {
    flex: 1,
  },
  filterSection: {
    marginBottom: tokens.spacing.xl,
  },
  filterSectionTitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.subhead,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.md,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
  filterChip: {
    marginBottom: tokens.spacing.xs,
  },
});
