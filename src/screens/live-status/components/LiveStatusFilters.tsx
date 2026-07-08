import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '@/theme/tokens';
import { Input, Chip } from '@/components/ui';

export type ViewMode = 'list' | 'grid';

interface LiveStatusFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  stats: {
    total: number;
    departures: number;
    arrivals: number;
  };
}

export default function LiveStatusFilters({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  activeFilter,
  onFilterChange,
  stats,
}: LiveStatusFiltersProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search room or guest..."
            value={searchQuery}
            onChangeText={onSearchChange}
            rightIcon={<Feather name="search" size={16} color={tokens.colors.textHint} />}
          />
        </View>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
            onPress={() => onViewModeChange('list')}
            activeOpacity={0.8}
          >
            <Feather
              name="list"
              size={16}
              color={viewMode === 'list' ? tokens.colors.textPrimary : tokens.colors.textHint}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'grid' && styles.toggleBtnActive]}
            onPress={() => onViewModeChange('grid')}
            activeOpacity={0.8}
          >
            <Feather
              name="grid"
              size={16}
              color={viewMode === 'grid' ? tokens.colors.textPrimary : tokens.colors.textHint}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersScroll}
      >
        <Chip
          label="All Rooms"
          active={activeFilter === 'all'}
          tone={activeFilter === 'all' ? 'primary' : 'default'}
          onPress={() => onFilterChange('all')}
        />
        <Chip
          label={`Departures (${stats.departures})`}
          active={activeFilter === 'departures'}
          tone={activeFilter === 'departures' ? 'primary' : 'default'}
          onPress={() => onFilterChange('departures')}
        />
        <Chip
          label={`Arrivals (${stats.arrivals})`}
          active={activeFilter === 'arrivals'}
          tone={activeFilter === 'arrivals' ? 'primary' : 'default'}
          onPress={() => onFilterChange('arrivals')}
        />
        <Chip
          label="Vacant"
          active={activeFilter === 'vacant'}
          tone={activeFilter === 'vacant' ? 'primary' : 'default'}
          onPress={() => onFilterChange('vacant')}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: tokens.borderWidth.hairline,
    borderBottomColor: tokens.colors.border,
    backgroundColor: tokens.colors.background,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lgMd,
    marginBottom: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },
  searchContainer: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.pill,
    padding: 2,
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.borderMd,
  },
  toggleBtn: {
    padding: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.pill,
  },
  toggleBtnActive: {
    backgroundColor: tokens.colors.white,
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  filtersScroll: {
    paddingHorizontal: tokens.spacing.lgMd,
    gap: tokens.spacing.sm,
  },
});
