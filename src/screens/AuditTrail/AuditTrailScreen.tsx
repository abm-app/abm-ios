import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tokens from '@/theme/tokens';
import { useAuditEvents } from '@/hooks/audit/useAuditEvents';
import type { AuditFilters } from '@/hooks/audit/useAuditEvents';
import { AuditCard } from './components/AuditCard';
import { FilterSheet } from '@/components/shared/FilterSheet';
import { Button, Chip } from '@/components/ui';
import { CustomCalender } from '@/components/shared/CustomCalender';
import { getCalendarDateString } from '@/utils/dateUtils';

const PROPERTIES = ['ABM Express', 'ABM International'];
const EVENT_TYPES = [
  'new_booking',
  'extension',
  'early_checkout',
  'cancellation',
  'modification',
  'room_change',
];
const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite'];

export interface AuditTrailScreenRef {
  openFilters: () => void;
}

const AuditTrailScreen = forwardRef<AuditTrailScreenRef, unknown>((_, ref) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<AuditFilters>({});
  const [draftFilters, setDraftFilters] = useState<AuditFilters>({});

  const [isFromDateVisible, setIsFromDateVisible] = useState(false);
  const [isToDateVisible, setIsToDateVisible] = useState(false);

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
          <View style={styles.chipGroup}>
            {PROPERTIES.map(prop => (
              <Chip
                key={prop}
                label={prop}
                active={draftFilters.property === prop}
                onPress={() =>
                  setDraftFilters(prev => ({
                    ...prev,
                    property: prev.property === prop ? undefined : prop,
                  }))
                }
              />
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Event Type</Text>
          <View style={styles.chipGroup}>
            {EVENT_TYPES.map(type => (
              <Chip
                key={type}
                label={type.replace('_', ' ')}
                active={draftFilters.eventType === type}
                onPress={() =>
                  setDraftFilters(prev => ({
                    ...prev,
                    eventType: prev.eventType === type ? undefined : type,
                  }))
                }
              />
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Room Type</Text>
          <View style={styles.chipGroup}>
            {ROOM_TYPES.map(type => (
              <Chip
                key={type}
                label={type}
                active={draftFilters.rmCode === type}
                onPress={() =>
                  setDraftFilters(prev => ({
                    ...prev,
                    rmCode: prev.rmCode === type ? undefined : type,
                  }))
                }
              />
            ))}
          </View>
        </View>

        <View style={styles.dateRow}>
          <View style={[styles.fieldGroup, styles.flex1]}>
            <Text style={styles.label}>From Date</Text>
            <Pressable style={styles.input} onPress={() => setIsFromDateVisible(true)}>
              <Text style={draftFilters.from ? styles.inputText : styles.placeholderText}>
                {draftFilters.from || 'YYYY-MM-DD'}
              </Text>
            </Pressable>
          </View>

          <View style={[styles.fieldGroup, styles.flex1]}>
            <Text style={styles.label}>To Date</Text>
            <Pressable style={styles.input} onPress={() => setIsToDateVisible(true)}>
              <Text style={draftFilters.to ? styles.inputText : styles.placeholderText}>
                {draftFilters.to || 'YYYY-MM-DD'}
              </Text>
            </Pressable>
          </View>
        </View>

        <CustomCalender
          visible={isFromDateVisible}
          onClose={() => setIsFromDateVisible(false)}
          selectedDate={draftFilters.from ? new Date(draftFilters.from) : undefined}
          onSelectDate={date => {
            setDraftFilters(prev => ({ ...prev, from: getCalendarDateString(date) }));
            setIsFromDateVisible(false);
          }}
        />

        <CustomCalender
          visible={isToDateVisible}
          onClose={() => setIsToDateVisible(false)}
          selectedDate={draftFilters.to ? new Date(draftFilters.to) : undefined}
          onSelectDate={date => {
            setDraftFilters(prev => ({ ...prev, to: getCalendarDateString(date) }));
            setIsToDateVisible(false);
          }}
        />
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
    justifyContent: 'center',
    height: 44,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  flex1: {
    flex: 1,
  },
  inputText: {
    color: tokens.colors.textPrimary,
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
  },
  placeholderText: {
    color: tokens.colors.textHint,
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
  },
});
