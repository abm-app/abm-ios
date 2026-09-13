import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

import tokens from '@/theme/tokens';
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/shared';
import AutomationCard from './AutomationCard';
import type { Campaign } from '@/types/campaign';

interface AutomationListProps {
  automations: Campaign[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export default function AutomationList({
  automations,
  isLoading,
  isError,
  error,
  refetch,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: AutomationListProps) {
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
    return (
      <ErrorState message={error?.message || 'Failed to load automations'} onRetry={refetch} />
    );
  }

  return (
    <FlatList
      data={automations}
      keyExtractor={item => item._id}
      renderItem={({ item }) => <AutomationCard automation={item} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={
        <EmptyState
          icon="zap"
          title="No Automations"
          subtitle="Automations you create will show up here once submitted."
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingTop: tokens.spacing.sm,
  },
  footerLoader: {
    paddingVertical: tokens.spacing.xl,
    alignItems: 'center',
  },
});
