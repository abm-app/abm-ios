import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import tokens from '@/theme/tokens';
import { useInfiniteGuests } from '@/hooks/guests/useGuests';
import { useLoyaltyConfig } from '@/hooks/loyalty/useLoyaltyConfig';
import {
  EmptyState,
  ErrorState,
  LoadingSpinner,
  ScreenHeaderV2,
  FilterSheet,
} from '@/components/shared';
import { Button, Chip } from '@/components/ui';
import GuestCard from './components/GuestCard';

const LAPSED_OPTIONS = [
  { label: 'Above 30 days', value: '30_days' },
  { label: '3 months', value: '3_months' },
  { label: '6 months', value: '6_months' },
  { label: '12 months', value: '12_months' },
];

export default function GuestDirectoryScreen() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeTier, setActiveTier] = useState('All');
  const [activeLapsed, setActiveLapsed] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const { data: loyaltyConfig } = useLoyaltyConfig();

  const tierOptions = useMemo(() => {
    const baseOptions = ['All'];
    if (loyaltyConfig?.tierThresholds) {
      const tiers = Object.keys(loyaltyConfig.tierThresholds).map(
        tier => tier.charAt(0).toUpperCase() + tier.slice(1),
      );
      baseOptions.push(...tiers);
    }
    return baseOptions;
  }, [loyaltyConfig]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const filters = useMemo(() => {
    return {
      search: debouncedSearch,
      tier: activeTier,
      lapsed: activeLapsed || undefined,
    };
  }, [debouncedSearch, activeTier, activeLapsed]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteGuests(filters);

  const guests = useMemo(() => {
    return data?.pages.flatMap(page => page.guests) || [];
  }, [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={tokens.colors.primary} />
      </View>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (isError) {
      return <ErrorState message={error?.message || 'Failed to load guests'} onRetry={refetch} />;
    }

    return (
      <FlatList
        data={guests}
        keyExtractor={item => item._id}
        renderItem={({ item }) => <GuestCard guest={item} />}
        contentContainerStyle={styles.listContent}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <EmptyState
            icon="users"
            title="No guests found"
            subtitle="Try adjusting your search or filters."
          />
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeaderV2
        title="Guest Directory"
        showSearch
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        showFilter
        onFilterPress={() => setIsFilterVisible(true)}
        showRightButton={false}
      />

      {renderContent()}

      <FilterSheet
        title="Filters"
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
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
                setIsFilterVisible(false);
              }}
            />
            <Button
              label="Apply"
              variant="primary"
              style={styles.filterButton}
              onPress={() => setIsFilterVisible(false)}
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
                onPress={() =>
                  setActiveLapsed(prev => (prev === option.value ? null : option.value))
                }
                style={styles.filterChip}
              />
            ))}
          </View>
        </View>
      </FilterSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  listContent: {
    paddingHorizontal: tokens.spacing.xlMd,
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.xxxl * 2, // Extra space for tab bar
  },
  footerLoader: {
    paddingVertical: tokens.spacing.xl,
    alignItems: 'center',
  },
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
