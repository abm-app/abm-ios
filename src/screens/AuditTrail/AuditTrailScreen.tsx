import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tokens from '@/theme/tokens';
import { useAuditEvents } from '@/hooks/audit/useAuditEvents';
import type { AuditFilters } from '@/hooks/audit/useAuditEvents';
import { AuditCard } from './components/AuditCard';
import { FilterSheet } from '@/components/shared/FilterSheet';
import { Button } from '@/components/ui';

export interface AuditTrailScreenRef {
  openFilters: () => void;
}

const AuditTrailScreen = forwardRef<AuditTrailScreenRef, unknown>((_, ref) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<AuditFilters>({});
  const [draftFilters, setDraftFilters] = useState<AuditFilters>({});

  const insets = useSafeAreaInsets();
  const tabBarTotalHeight =
    tokens.navigation.height +
    tokens.navigation.paddingVertical +
    Math.max(insets.bottom, tokens.navigation.paddingVertical);
  const overlap = tabBarTotalHeight - insets.bottom;
  const bottomSpace = overlap + tokens.spacing.md;

  const { events, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useAuditEvents(activeFilters);

  useImperativeHandle(ref, () => ({
    openFilters: () => {
      setDraftFilters(activeFilters);
      setIsFilterVisible(true);
    },
  }));

  const handleApply = () => {
    setActiveFilters(draftFilters);
    setIsFilterVisible(false);
  };

  const handleReset = () => {
    setDraftFilters({});
    setActiveFilters({});
    setIsFilterVisible(false);
  };

  const renderFilterSheetFooter = () => (
    <View style={styles.footerButtons}>
      <Button variant="secondary" label="Reset" onPress={handleReset} />
      <Button
        variant="primary"
        label="Apply Filters"
        onPress={handleApply}
        style={styles.applyButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.listContainer, { marginBottom: bottomSpace }]}>
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
              <ActivityIndicator style={styles.centered} color={tokens.colors.primary} />
            ) : isError ? (
              <Text style={styles.emptyText}>Failed to load events.</Text>
            ) : (
              <Text style={styles.emptyText}>No events found.</Text>
            )
          }
        />
      </View>

      <FilterSheet
        title="Filters"
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        showDragIndicator
        footer={renderFilterSheetFooter()}
      >
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Property</Text>
          <TextInput
            style={styles.input}
            value={draftFilters.property || ''}
            onChangeText={val => setDraftFilters(prev => ({ ...prev, property: val }))}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Event Type</Text>
          <TextInput
            style={styles.input}
            placeholder="extension, room_change, checkout"
            placeholderTextColor={tokens.colors.textHint}
            value={draftFilters.eventType || ''}
            onChangeText={val => setDraftFilters(prev => ({ ...prev, eventType: val }))}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Room Code</Text>
          <TextInput
            style={styles.input}
            value={draftFilters.rmCode || ''}
            onChangeText={val => setDraftFilters(prev => ({ ...prev, rmCode: val }))}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>From Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={tokens.colors.textHint}
            value={draftFilters.from || ''}
            onChangeText={val => setDraftFilters(prev => ({ ...prev, from: val }))}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>To Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={tokens.colors.textHint}
            value={draftFilters.to || ''}
            onChangeText={val => setDraftFilters(prev => ({ ...prev, to: val }))}
          />
        </View>
      </FilterSheet>
    </View>
  );
});

AuditTrailScreen.displayName = 'AuditTrailScreen';

export default AuditTrailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    backgroundColor: tokens.colors.surfaceLight,
    marginHorizontal: tokens.spacing.xlMd,
    borderRadius: tokens.spacing.xl,
    overflow: 'hidden',
    padding: tokens.spacing.xlMd, // Add padding inside the card
  },
  headerButton: {
    marginRight: tokens.spacing.md,
  },
  listContent: {
    paddingTop: tokens.spacing.sm, // Remove overall padding, keep top padding for the items
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
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  applyButton: {
    flex: 1,
  },
  fieldGroup: {
    marginBottom: tokens.spacing.md,
  },
  label: {
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.xs,
    fontFamily: tokens.typography.fontFamily.sub,
  },
  input: {
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.spacing.sm,
    padding: tokens.spacing.sm,
    color: tokens.colors.textPrimary,
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
  },
});
