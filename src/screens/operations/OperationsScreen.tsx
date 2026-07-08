import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tokens from '@/theme/tokens';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { ScreenHeaderV2 } from '@/components/shared/ScreenHeader';
import AuditTrailScreen, { AuditTrailScreenRef } from '@/screens/AuditTrail/AuditTrailScreen';

export default function OperationsScreen() {
  const [activeTab, setActiveTab] = useState('live_status');
  const auditTrailRef = useRef<AuditTrailScreenRef>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeaderV2
        title="Operations"
        showNotifications={true}
        showRightButton={false}
        showFilter={activeTab === 'audit_trail'}
        onFilterPress={() => auditTrailRef.current?.openFilters()}
      />
      <View style={styles.segmentedControlContainer}>
        <SegmentedControl
          tabs={[
            { id: 'live_status', label: 'Live Status' },
            { id: 'audit_trail', label: 'Audit Trail' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </View>

      {activeTab === 'live_status' ? (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>Live Status coming soon</Text>
        </View>
      ) : (
        <AuditTrailScreen ref={auditTrailRef} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  segmentedControlContainer: {
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
  },
});
