import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import tokens from '@/theme/tokens';
import { useStatusOverview, useStatusOverviewStats } from '@/hooks/status/useStatusOverview';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/shared';
import PropertyAccordion from './components/PropertyAccordion';
import { LiveStatusFilterSheet } from './components/LiveStatusFilterSheet';
import { RoomDetailsSheet } from './components/RoomDetailsSheet';
import type { LiveStatusRoom } from '@/types/status';
import type { ViewMode } from './components/LiveStatusFilters';

export interface LiveStatusScreenRef {
  openFilters: () => void;
}

interface LiveStatusScreenProps {
  searchQuery: string;
  viewMode: ViewMode;
}

const LiveStatusScreen = forwardRef<LiveStatusScreenRef, LiveStatusScreenProps>(
  ({ searchQuery, viewMode }, ref) => {
    const { data: overview, isLoading, isError, error, refetch } = useStatusOverview();

    const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      openFilters: () => setIsFilterSheetOpen(true),
    }));

    const [selectedRoom, setSelectedRoom] = useState<LiveStatusRoom | null>(null);
    const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);

    const handleRoomPress = (room: LiveStatusRoom) => {
      setSelectedRoom(room);
      setIsDetailsSheetOpen(true);
    };

    const { data: statsData } = useStatusOverviewStats();
    const stats = statsData || { total: 0, departures: 0, arrivals: 0 };

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <ErrorState message={error.message} onRetry={refetch} />;

    const properties = overview?.properties || [];

    return (
      <>
        {properties.length === 0 ? (
          <EmptyState
            icon="home"
            title="No properties found"
            subtitle="There are no properties available to display."
          />
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {properties.map((property, index) => (
              <PropertyAccordion
                key={property.key}
                property={property}
                searchQuery={searchQuery}
                activeFilters={activeFilters}
                viewMode={viewMode}
                onRoomPress={handleRoomPress}
                defaultExpanded={index === 0} // Expand the first property by default
              />
            ))}
          </ScrollView>
        )}

        <LiveStatusFilterSheet
          visible={isFilterSheetOpen}
          onClose={() => setIsFilterSheetOpen(false)}
          onApply={filters => {
            setActiveFilters(filters);
            setIsFilterSheetOpen(false);
          }}
          initialFilters={activeFilters}
          stats={stats}
        />

        <RoomDetailsSheet
          visible={isDetailsSheetOpen}
          onClose={() => setIsDetailsSheetOpen(false)}
          room={selectedRoom}
        />
      </>
    );
  },
);

LiveStatusScreen.displayName = 'LiveStatusScreen';

export default LiveStatusScreen;

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.md,
  },
});
