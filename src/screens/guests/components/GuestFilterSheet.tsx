import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';
import { FilterSheet } from '@/components/shared';
import { Button, Chip } from '@/components/ui';

const LAPSED_OPTIONS = [
  { label: 'Above 30 days', value: '30_days' },
  { label: '3 months', value: '3_months' },
  { label: '6 months', value: '6_months' },
  { label: '12 months', value: '12_months' },
];

interface GuestFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  activeTier: string;
  setActiveTier: (tier: string) => void;
  activeLapsed: string | null;
  setActiveLapsed: React.Dispatch<React.SetStateAction<string | null>>;
  activeDoNotContact: 'true' | 'false' | undefined;
  setActiveDoNotContact: React.Dispatch<React.SetStateAction<'true' | 'false' | undefined>>;
  tierOptions: string[];
}

export default function GuestFilterSheet({
  visible,
  onClose,
  activeTier,
  setActiveTier,
  activeLapsed,
  setActiveLapsed,
  activeDoNotContact,
  setActiveDoNotContact,
  tierOptions,
}: GuestFilterSheetProps) {
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
            onPress={() => {
              setActiveTier('All');
              setActiveLapsed(null);
              setActiveDoNotContact(undefined);
              onClose();
            }}
          />
          <Button label="Apply" variant="primary" style={styles.filterButton} onPress={onClose} />
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
              active={activeTier === tier}
              tone={activeTier === tier ? 'primary' : 'default'}
              onPress={() => setActiveTier(tier)}
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
              active={activeLapsed === option.value}
              tone={activeLapsed === option.value ? 'primary' : 'default'}
              onPress={() => setActiveLapsed(prev => (prev === option.value ? null : option.value))}
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
            active={activeDoNotContact === 'false'}
            tone={activeDoNotContact === 'false' ? 'primary' : 'default'}
            onPress={() => setActiveDoNotContact(prev => (prev === 'false' ? undefined : 'false'))}
            style={styles.filterChip}
          />
          <Chip
            label="Opted Out"
            active={activeDoNotContact === 'true'}
            tone={activeDoNotContact === 'true' ? 'primary' : 'default'}
            onPress={() => setActiveDoNotContact(prev => (prev === 'true' ? undefined : 'true'))}
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
