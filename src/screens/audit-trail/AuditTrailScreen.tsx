import React, { useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import {
  SectionList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '@/theme/tokens';
import { useAuditEvents } from '@/hooks/audit/useAuditEvents';
import type { AuditFilters } from '@/hooks/audit/useAuditEvents';
import { AuditCard } from './components/AuditCard';
import { AuditFilterSheet } from './components/AuditFilterSheet';
import { LoadingSpinner, ErrorState } from '@/components/shared';
import type { AuditProperty, AuditEvent } from '@/types/audit';

export interface AuditTrailScreenRef {
  openFilters: () => void;
}

interface PropertySection {
  propertyKey: AuditProperty;
  propertyName: string;
  total: number;
  expanded: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  data: AuditEvent[];
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

const AuditTrailScreen = forwardRef<AuditTrailScreenRef, unknown>((_, ref) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<AuditFilters>({});
  const [expandedMap, setExpandedMap] = useState<Record<AuditProperty, boolean>>({
    express: true,
    international: false,
  });

  useImperativeHandle(ref, () => ({
    openFilters: () => {
      setIsFilterVisible(true);
    },
  }));

  const expressFilters = useMemo<AuditFilters>(
    () => ({
      ...activeFilters,
      property: ['express'],
    }),
    [activeFilters],
  );

  const internationalFilters = useMemo<AuditFilters>(
    () => ({
      ...activeFilters,
      property: ['international'],
    }),
    [activeFilters],
  );

  const expressQuery = useAuditEvents(expressFilters);
  const internationalQuery = useAuditEvents(internationalFilters);

  const handleApplyFilters = (filters: AuditFilters) => {
    setActiveFilters(filters);
    setIsFilterVisible(false);
  };

  const toggleProperty = (propertyKey: AuditProperty) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedMap(prev => ({
      ...prev,
      [propertyKey]: !prev[propertyKey],
    }));
  };

  const sections = useMemo<PropertySection[]>(
    () => [
      {
        propertyKey: 'express',
        propertyName: 'ABM Express',
        total: expressQuery.total,
        expanded: expandedMap.express ?? true,
        isLoading: expressQuery.isLoading,
        isError: expressQuery.isError,
        refetch: expressQuery.refetch,
        data: (expandedMap.express ?? true) ? expressQuery.events : [],
        hasNextPage: expressQuery.hasNextPage,
        isFetchingNextPage: expressQuery.isFetchingNextPage,
        fetchNextPage: expressQuery.fetchNextPage,
      },
      {
        propertyKey: 'international',
        propertyName: 'ABM International',
        total: internationalQuery.total,
        expanded: expandedMap.international ?? false,
        isLoading: internationalQuery.isLoading,
        isError: internationalQuery.isError,
        refetch: internationalQuery.refetch,
        data: (expandedMap.international ?? false) ? internationalQuery.events : [],
        hasNextPage: internationalQuery.hasNextPage,
        isFetchingNextPage: internationalQuery.isFetchingNextPage,
        fetchNextPage: internationalQuery.fetchNextPage,
      },
    ],
    [expandedMap, expressQuery, internationalQuery],
  );

  const handleEndReached = () => {
    if (expandedMap.express && expressQuery.hasNextPage && !expressQuery.isFetchingNextPage) {
      expressQuery.fetchNextPage();
    }
    if (
      expandedMap.international &&
      internationalQuery.hasNextPage &&
      !internationalQuery.isFetchingNextPage
    ) {
      internationalQuery.fetchNextPage();
    }
  };

  return (
    <>
      <SectionList<AuditEvent, PropertySection>
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <AuditCard event={item} />}
        renderSectionHeader={({ section }) => (
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => toggleProperty(section.propertyKey)}
              style={styles.header}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Toggle ${section.propertyName} accordion`}
            >
              <View style={styles.titleRow}>
                <Text style={styles.title}>{section.propertyName}</Text>
                <Text style={styles.count}>({section.total})</Text>
              </View>
              <Feather
                name={section.expanded ? 'chevron-up' : 'chevron-down'}
                size={tokens.iconSizes.content}
                color={tokens.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        )}
        renderSectionFooter={({ section }) => {
          if (!section.expanded) return null;
          if (section.isLoading) {
            return (
              <View style={styles.sectionFooter}>
                <LoadingSpinner />
              </View>
            );
          }
          if (section.isError) {
            return (
              <View style={styles.sectionFooter}>
                <ErrorState message="Failed to load events." onRetry={section.refetch} />
              </View>
            );
          }
          if (section.data.length === 0) {
            return (
              <View style={styles.sectionFooter}>
                <Text style={styles.emptyText}>No audit events for this property.</Text>
              </View>
            );
          }
          if (section.isFetchingNextPage) {
            return (
              <View style={styles.sectionFooter}>
                <ActivityIndicator size="small" color={tokens.colors.primary} />
              </View>
            );
          }
          return <View style={styles.sectionSpacing} />;
        }}
        stickySectionHeadersEnabled={true}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
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
    paddingBottom: tokens.spacing.xl,
  },
  headerContainer: {
    backgroundColor: tokens.colors.background,
    paddingVertical: tokens.spacing.md,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  sectionFooter: {
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
  },
  sectionSpacing: {
    height: tokens.spacing.md,
  },
  emptyText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textHint,
    textAlign: 'center',
    padding: tokens.spacing.xl,
  },
});
