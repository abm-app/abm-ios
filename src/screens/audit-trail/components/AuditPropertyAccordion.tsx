import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '@/theme/tokens';
import { useAuditEvents, AuditFilters } from '@/hooks/audit/useAuditEvents';
import { LoadingSpinner, ErrorState } from '@/components/shared';
import { AuditCard } from './AuditCard';
import type { AuditProperty } from '@/types/audit';

interface AuditPropertyAccordionProps {
  propertyKey: AuditProperty;
  propertyName: string;
  activeFilters: AuditFilters;
  defaultExpanded?: boolean;
}

export default function AuditPropertyAccordion({
  propertyKey,
  propertyName,
  activeFilters,
  defaultExpanded = false,
}: AuditPropertyAccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const filtersForProperty = useMemo<AuditFilters>(
    () => ({
      ...activeFilters,
      property: [propertyKey],
    }),
    [activeFilters, propertyKey],
  );

  const {
    events,
    total,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useAuditEvents(filtersForProperty);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header} activeOpacity={0.7}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{propertyName}</Text>
          <Text style={styles.count}>({total})</Text>
        </View>
        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={tokens.iconSizes.content}
          color={tokens.colors.textSecondary}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <ErrorState message="Failed to load events." onRetry={refetch} />
          ) : events.length === 0 ? (
            <Text style={styles.emptyText}>No audit events for this property.</Text>
          ) : (
            <View style={styles.listContent}>
              {events.map(event => (
                <AuditCard key={event.id} event={event} />
              ))}
              {hasNextPage && (
                <TouchableOpacity
                  onPress={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  style={styles.loadMoreButton}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Load more events"
                >
                  {isFetchingNextPage ? (
                    <ActivityIndicator size="small" color={tokens.colors.primary} />
                  ) : (
                    <Text style={styles.loadMoreText}>Load More</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: tokens.spacing.mdLg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.subhead,
    fontWeight: '600',
    color: tokens.colors.textSecondary,
  },
  count: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.subhead,
    color: tokens.colors.textMuted,
  },
  content: {
    marginTop: tokens.spacing.sm,
  },
  emptyText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textHint,
    textAlign: 'center',
    padding: tokens.spacing.xl,
  },
  listContent: {
    gap: tokens.spacing.md,
  },
  loadMoreButton: {
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tokens.borderRadius.md,
    backgroundColor: tokens.colors.surface,
    marginTop: tokens.spacing.sm,
  },
  loadMoreText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
});
