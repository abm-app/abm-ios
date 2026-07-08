import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import tokens from '@/theme/tokens';
import { FilterSheet } from '@/components/shared/FilterSheet';
import { Button, Chip } from '@/components/ui';
import { CustomCalender } from '@/components/shared/CustomCalender';
import { getCalendarDateString } from '@/utils/dateUtils';
import type { AuditFilters } from '@/hooks/audit/useAuditEvents';
import { PROPERTIES, EVENT_TYPES } from '@/constants';
import { useRoomTypes } from '@/hooks/rooms/useRoomTypes';

interface AuditFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: AuditFilters) => void;
  initialFilters: AuditFilters;
}

export function AuditFilterSheet({
  visible,
  onClose,
  onApply,
  initialFilters,
}: AuditFilterSheetProps) {
  const [draftFilters, setDraftFilters] = useState<AuditFilters>(initialFilters);
  const [isFromDateVisible, setIsFromDateVisible] = useState(false);
  const [isToDateVisible, setIsToDateVisible] = useState(false);

  const { data: roomTypes, isLoading: isLoadingRooms } = useRoomTypes();

  const [prevVisible, setPrevVisible] = useState(visible);

  // Sync draft filters with initial filters when the sheet is opened
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setDraftFilters(initialFilters);
    }
  }

  const handleApply = () => {
    onApply(draftFilters);
  };

  const handleReset = () => {
    setDraftFilters({});
    onApply({});
  };

  const renderFooter = () => (
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
    <>
      <FilterSheet
        title="Filters"
        visible={visible}
        onClose={onClose}
        showDragIndicator
        footer={renderFooter()}
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
            {isLoadingRooms ? (
              <ActivityIndicator size="small" color={tokens.colors.primary} />
            ) : (
              roomTypes?.map(type => (
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
              ))
            )}
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
      </FilterSheet>

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
    </>
  );
}

const styles = StyleSheet.create({
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
  input: {
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.spacing.sm,
    padding: tokens.spacing.sm,
    justifyContent: 'center',
    height: 44,
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
