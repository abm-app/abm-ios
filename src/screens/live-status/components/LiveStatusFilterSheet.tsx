import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tokens from '@/theme/tokens';
import { FilterSheet } from '@/components/shared/FilterSheet';
import { Button, Chip } from '@/components/ui';

interface LiveStatusFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: string[]) => void;
  initialFilters: string[];
  stats: {
    total: number;
    departures: number;
    arrivals: number;
  };
}

export function LiveStatusFilterSheet({
  visible,
  onClose,
  onApply,
  initialFilters,
  stats,
}: LiveStatusFilterSheetProps) {
  const [draftFilters, setDraftFilters] = useState<string[]>(initialFilters);

  const [prevVisible, setPrevVisible] = useState(visible);
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setDraftFilters(initialFilters);
    }
  }

  const handleApply = () => {
    onApply(draftFilters);
  };

  const handleReset = () => {
    setDraftFilters(['all']);
    // Removed onApply('all') to keep modal open on Reset
  };

  const toggleFilter = (filterKey: string) => {
    if (filterKey === 'all') {
      setDraftFilters(['all']);
      return;
    }
    setDraftFilters(prev => {
      const next = prev.filter(f => f !== 'all');
      if (next.includes(filterKey)) {
        const removed = next.filter(f => f !== filterKey);
        return removed.length === 0 ? ['all'] : removed;
      } else {
        return [...next, filterKey];
      }
    });
  };

  const renderFooter = () => (
    <View style={styles.footerButtons}>
      <Button variant="secondary" label="Reset" onPress={handleReset} />
      <Button
        variant="primary"
        label="Apply Filters"
        onPress={handleApply}
        style={styles.applyButton}
      />
    </View>
  );

  return (
    <FilterSheet
      title="Filters"
      visible={visible}
      onClose={onClose}
      showDragIndicator
      footer={renderFooter()}
    >
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Room Status</Text>
        <View style={styles.chipGroup}>
          <Chip
            label="All Rooms"
            active={draftFilters.includes('all')}
            tone={draftFilters.includes('all') ? 'primary' : 'default'}
            onPress={() => toggleFilter('all')}
          />
          <Chip
            label={`Departures (${stats.departures})`}
            active={draftFilters.includes('departures')}
            tone={draftFilters.includes('departures') ? 'primary' : 'default'}
            onPress={() => toggleFilter('departures')}
          />
          <Chip
            label={`Arrivals (${stats.arrivals})`}
            active={draftFilters.includes('arrivals')}
            tone={draftFilters.includes('arrivals') ? 'primary' : 'default'}
            onPress={() => toggleFilter('arrivals')}
          />
          <Chip
            label="Vacant"
            active={draftFilters.includes('vacant')}
            tone={draftFilters.includes('vacant') ? 'primary' : 'default'}
            onPress={() => toggleFilter('vacant')}
          />
        </View>
      </View>
    </FilterSheet>
  );
}

const styles = StyleSheet.create({
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  applyButton: {
    flex: 1,
  },
  fieldGroup: {
    marginBottom: tokens.spacing.md,
  },
  label: {
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.xs,
    fontFamily: tokens.typography.fontFamily.sub,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
});
