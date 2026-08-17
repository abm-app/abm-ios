import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  SectionList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '@/theme/tokens';
import { useAuditSections } from '@/hooks/audit/useAuditSections';
import type { PropertySection } from '@/hooks/audit/useAuditSections';
import type { AuditFilters } from '@/hooks/audit/useAuditEvents';
import { AuditCard } from './components/AuditCard';
import { AuditFilterSheet } from './components/AuditFilterSheet';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/shared';
import type { AuditEvent } from '@/types/audit';

export interface AuditTrailScreenRef {
  openFilters: () => void;
}

const AuditTrailScreen = forwardRef<AuditTrailScreenRef, unknown>((_, ref) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<AuditFilters>({});

  useImperativeHandle(ref, () => ({
    openFilters: () => {
      setIsFilterVisible(true);
    },
  }));

  const { sections, toggleProperty, handleEndReached } = useAuditSections(activeFilters);

  const handleApplyFilters = (filters: AuditFilters) => {
    setActiveFilters(filters);
    setIsFilterVisible(false);
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
                <EmptyState
                  icon="file-text"
                  title="No audit events"
                  subtitle="No audit events for this property."
                />
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
});
