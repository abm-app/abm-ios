import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import tokens from '@/theme/tokens';
import { useInfiniteGuests } from '@/hooks/guests/useGuests';
import { useLoyaltyConfig } from '@/hooks/loyalty/useLoyaltyConfig';
import { ScreenHeaderV2, Backdrop } from '@/components/shared';
import GuestList from './components/GuestList';
import GuestFilterSheet from './components/GuestFilterSheet';

export default function GuestDirectoryScreen() {
  const insets = useSafeAreaInsets();
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
      search: debouncedSearch ? debouncedSearch : undefined,
      tier: activeTier === 'All' ? undefined : activeTier,
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

  const bottomPadding =
    tokens.navigation.height +
    tokens.navigation.paddingVertical +
    Math.max(insets.bottom, tokens.navigation.paddingVertical) +
    tokens.spacing.lg;

  const guests = useMemo(() => {
    return data?.pages.flatMap(page => page.guests) || [];
  }, [data]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Backdrop />
      <ScreenHeaderV2
        title="Guest List"
        showSearch
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        showFilter
        onFilterPress={() => setIsFilterVisible(true)}
        showRightButton={false}
      />

      <GuestList
        guests={guests}
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        bottomPadding={bottomPadding}
      />

      <GuestFilterSheet
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        activeTier={activeTier}
        setActiveTier={setActiveTier}
        activeLapsed={activeLapsed}
        setActiveLapsed={setActiveLapsed}
        tierOptions={tierOptions}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
});
