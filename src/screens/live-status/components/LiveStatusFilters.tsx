import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '@/theme/tokens';
import { Input } from '@/components/ui';

export type ViewMode = 'list' | 'grid';

interface LiveStatusFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onFilterPress: () => void;
  hasActiveFilter: boolean;
}

export default function LiveStatusFilters({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onFilterPress,
  hasActiveFilter,
}: LiveStatusFiltersProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search room or guest..."
            value={searchQuery}
            onChangeText={onSearchChange}
            rightIcon={
              searchQuery.length > 0 ? (
                <TouchableOpacity
                  onPress={() => onSearchChange('')}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="x-circle" size={16} color={tokens.colors.textHint} />
                </TouchableOpacity>
              ) : (
                <Feather name="search" size={16} color={tokens.colors.textHint} />
              )
            }
          />
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, hasActiveFilter && styles.filterBtnActive]}
          onPress={onFilterPress}
          activeOpacity={0.8}
        >
          <Feather
            name="filter"
            size={18}
            color={hasActiveFilter ? tokens.colors.white : tokens.colors.textPrimary}
          />
        </TouchableOpacity>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: tokens.spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lgMd,
    gap: tokens.spacing.sm,
  },
  searchContainer: {
    flex: 1,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: tokens.borderRadius.md,
    backgroundColor: tokens.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.borderMd,
  },
  filterBtnActive: {
    backgroundColor: tokens.colors.primary,
    borderColor: tokens.colors.primary,
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
});
