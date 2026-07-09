import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import tokens from '@/theme/tokens';
import { useAuditEvents } from '@/hooks/audit/useAuditEvents';
import type { AuditFilters } from '@/hooks/audit/useAuditEvents';
import { AuditCard } from './components/AuditCard';
import { AuditFilterSheet } from './components/AuditFilterSheet';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/shared';

export interface AuditTrailScreenRef {
  openFilters: () => void;
}

const AuditTrailScreen = forwardRef<AuditTrailScreenRef, unknown>((_, ref) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<AuditFilters>({});

  const { events, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useAuditEvents(activeFilters);

  useImperativeHandle(ref, () => ({
    openFilters: () => {
      setIsFilterVisible(true);
    },
  }));

  const handleApplyFilters = (filters: AuditFilters) => {
    setActiveFilters(filters);
    setIsFilterVisible(false);
  };

  return (
    <>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <AuditCard event={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={styles.footerLoader} color={tokens.colors.primary} />
          ) : null
        }
        ListEmptyComponent={
          isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <ErrorState message="Failed to load events." onRetry={refetch} />
          ) : (
            <EmptyState
              icon="file-text"
              title="No events found"
              subtitle="Audit events will appear here."
            />
          )
        }
      />
      <AuditFilterSheet
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        initialFilters={activeFilters}
        onApply={handleApplyFilters}
      />
    </>
  );
});

AuditTrailScreen.displayName = 'AuditTrailScreen';

export default AuditTrailScreen;

const styles = StyleSheet.create({
  listContent: {
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.xl,
  },
  footerLoader: {
    marginVertical: tokens.spacing.md,
  },
  centered: {
    marginTop: tokens.spacing.xxxl,
  },
  emptyText: {
    textAlign: 'center',
    color: tokens.colors.textMuted,
    marginTop: tokens.spacing.xxxl,
    fontSize: tokens.typography.fontSize.body,
    fontFamily: tokens.typography.fontFamily.sub,
  },
});
