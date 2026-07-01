import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import tokens from '@/theme/tokens';
import { useInfiniteGuests } from '@/hooks/guests/useGuests';
import { useLoyaltyConfig } from '@/hooks/loyalty/useLoyaltyConfig';
import {
  EmptyState,
  ErrorState,
  LoadingSpinner,
  ScreenHeaderV2,
  ListSurface,
  Backdrop,
} from '@/components/shared';
import GuestCard from './components/GuestCard';
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

  const bottomPadding =
    tokens.navigation.height +
    tokens.navigation.paddingVertical +
    Math.max(insets.bottom, tokens.navigation.paddingVertical) +
    tokens.spacing.lg;

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
      <View style={[styles.mainWrapper, { paddingBottom: bottomPadding }]}>
        <ListSurface>
          <FlatList
            data={guests}
            keyExtractor={item => item._id}
            renderItem={({ item }) => <GuestCard guest={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
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
        </ListSurface>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Backdrop />
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
  mainWrapper: {
    flex: 1,
    paddingHorizontal: tokens.spacing.xlMd,
    paddingTop: tokens.spacing.md,
  },
  listContent: {
    paddingTop: tokens.spacing.sm,
  },
  footerLoader: {
    paddingVertical: tokens.spacing.xl,
    alignItems: 'center',
  },
});
