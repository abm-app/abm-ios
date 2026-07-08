import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tokens from '@/theme/tokens';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { ScreenHeaderV2 } from '@/components/shared/ScreenHeader';
import AuditTrailScreen, { AuditTrailScreenRef } from '@/screens/AuditTrail/AuditTrailScreen';
import Backdrop from '@/components/shared/Backdrop';

export default function OperationsScreen() {
  const [activeTab, setActiveTab] = useState('live_status');
  const auditTrailRef = useRef<AuditTrailScreenRef>(null);

  return (
    <View style={styles.root}>
      <Backdrop />
      <SafeAreaView style={styles.container}>
        <ScreenHeaderV2
          title="Operations"
          showNotifications={false}
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  segmentedControlContainer: {
    padding: tokens.spacing.md,
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
