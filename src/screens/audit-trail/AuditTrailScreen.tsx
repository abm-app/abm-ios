import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import tokens from '@/theme/tokens';
import type { AuditFilters } from '@/hooks/audit/useAuditEvents';
import { AuditFilterSheet } from './components/AuditFilterSheet';
import AuditPropertyAccordion from './components/AuditPropertyAccordion';
import { PROPERTY_OPTIONS } from '@/types/audit';

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

  const handleApplyFilters = (filters: AuditFilters) => {
    setActiveFilters(filters);
    setIsFilterVisible(false);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {PROPERTY_OPTIONS.map((property, index) => (
          <AuditPropertyAccordion
            key={property.value}
            propertyKey={property.value}
            propertyName={property.label}
            activeFilters={activeFilters}
            defaultExpanded={index === 0}
          />
        ))}
      </ScrollView>
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
  scrollContent: {
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.md,
  },
});
