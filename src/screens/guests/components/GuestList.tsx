import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

import tokens from '@/theme/tokens';
import { EmptyState, ErrorState, LoadingSpinner, ListSurface } from '@/components/shared';
import GuestCard from './GuestCard';
import type { Guest } from '@/types/guest';

interface GuestListProps {
  guests: Guest[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  bottomPadding: number;
}

export default function GuestList({
  guests,
  isLoading,
  isError,
  error,
  refetch,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  bottomPadding,
}: GuestListProps) {
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
          keyExtractor={item => item.id}
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
}

const styles = StyleSheet.create({
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
