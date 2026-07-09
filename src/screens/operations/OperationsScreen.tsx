import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tokens from '@/theme/tokens';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { ScreenHeaderV2 } from '@/components/shared/ScreenHeader';
import AuditTrailScreen, { AuditTrailScreenRef } from '@/screens/audit-trail/AuditTrailScreen';
import LiveStatusScreen, { LiveStatusScreenRef } from '@/screens/live-status/LiveStatusScreen';
import type { ViewMode } from '@/screens/live-status/components/LiveStatusFilters';
import Backdrop from '@/components/shared/Backdrop';
import { ListSurface } from '@/components/shared';

export default function OperationsScreen() {
  const [activeTab, setActiveTab] = useState('live_status');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const auditTrailRef = useRef<AuditTrailScreenRef>(null);
  const liveStatusRef = useRef<LiveStatusScreenRef>(null);
  const insets = useSafeAreaInsets();

  const bottomPadding =
    tokens.navigation.height +
    tokens.navigation.paddingVertical +
    Math.max(insets.bottom, tokens.navigation.paddingVertical) +
    tokens.spacing.lg;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Backdrop />
      <ScreenHeaderV2
        title="Operations"
        showNotifications={false}
        showRightButton={false}
        showFilter={true}
        onFilterPress={() => {
          if (activeTab === 'live_status') {
            liveStatusRef.current?.openFilters();
          } else {
            auditTrailRef.current?.openFilters();
          }
        }}
        showSearch={activeTab === 'live_status'}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        showViewModeToggle={activeTab === 'live_status'}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <View style={[styles.mainWrapper, { paddingBottom: bottomPadding }]}>
        <ListSurface>
          <View style={styles.tabsContainer}>
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
            <LiveStatusScreen ref={liveStatusRef} searchQuery={searchQuery} viewMode={viewMode} />
          ) : (
            <AuditTrailScreen ref={auditTrailRef} />
          )}
        </ListSurface>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  mainWrapper: {
    flex: 1,
    paddingHorizontal: tokens.spacing.xlMd,
    paddingTop: tokens.spacing.md,
  },
  tabsContainer: {
    paddingBottom: tokens.spacing.lgMd,
  },
});
