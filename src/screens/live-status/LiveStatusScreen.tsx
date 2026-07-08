import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tokens from '@/theme/tokens';
import { useAuthStore } from '@/store/authStore';
import { useStatusRooms } from '@/hooks/status/useStatusRooms';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/shared';
import RoomCard from '@/components/shared/RoomCard';
import RoomGridCard from './components/RoomGridCard';
import LiveStatusFilters, { ViewMode } from './components/LiveStatusFilters';
import { LiveStatusFilterSheet } from './components/LiveStatusFilterSheet';
import { RoomDetailsSheet } from './components/RoomDetailsSheet';
import type { LiveStatusRoom } from '@/types/status';

const EMPTY_ROOMS: LiveStatusRoom[] = [];

export default function LiveStatusScreen() {
  const property = useAuthStore(s => s.user?.property) || 'express';
  const { data, isLoading, isError, error, refetch } = useStatusRooms(property);

  const insets = useSafeAreaInsets();
  const tabBarTotalHeight =
    tokens.navigation.height +
    tokens.navigation.paddingVertical +
    Math.max(insets.bottom, tokens.navigation.paddingVertical);
  const overlap = tabBarTotalHeight - insets.bottom;
  const bottomSpace = overlap + tokens.spacing.md;

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState<LiveStatusRoom | null>(null);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);

  const handleRoomPress = (room: LiveStatusRoom) => {
    setSelectedRoom(room);
    setIsDetailsSheetOpen(true);
  };

  const rooms = data?.rooms || EMPTY_ROOMS;

  // Derived state: filters and search
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      // 1. Text search
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        room.rmCode.toLowerCase().includes(query) ||
        (room.guestName || '').toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // 2. Filter tabs
      if (!activeFilters.includes('all')) {
        let isMatch = false;
        if (activeFilters.includes('departures') && room.status === 'checkout') isMatch = true;
        if (activeFilters.includes('arrivals') && room.status === 'arrival') isMatch = true;
        if (activeFilters.includes('vacant') && room.status === 'vacant') isMatch = true;
        if (!isMatch) return false;
      }
      return true;
    });
  }, [rooms, searchQuery, activeFilters]);

  // Derived state: stats for filter pills
  const stats = useMemo(() => {
    return {
      total: rooms.length,
      departures: rooms.filter(r => r.status === 'checkout').length,
      arrivals: rooms.filter(r => r.status === 'arrival').length,
    };
  }, [rooms]);

  // Derived state: grouped by floor for grid view
  const floors = useMemo(() => {
    const grouped: Record<string, LiveStatusRoom[]> = {};
    filteredRooms.forEach(room => {
      // Simple heuristic: first digit of room number
      const floorStr = room.rmCode.charAt(0);
      const floorNum = parseInt(floorStr, 10);
      const floorKey = isNaN(floorNum) ? 'Other' : `${floorNum}${getOrdinal(floorNum)} FLOOR`;

      if (!grouped[floorKey]) {
        grouped[floorKey] = [];
      }
      grouped[floorKey].push(room);
    });
    return grouped;
  }, [filteredRooms]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <LiveStatusFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onFilterPress={() => setIsFilterSheetOpen(true)}
        hasActiveFilter={activeFilters.length > 0 && !activeFilters.includes('all')}
      />

      <View style={[styles.listContainer, { marginBottom: bottomSpace }]}>
        {filteredRooms.length === 0 ? (
          <EmptyState
            icon="search"
            title="No rooms found"
            subtitle="Try adjusting your search or filters."
          />
        ) : viewMode === 'list' ? (
          <FlatList
            data={filteredRooms}
            keyExtractor={item => item.rmCode}
            renderItem={({ item }) => <RoomCard room={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <ScrollView
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
          >
            {Object.entries(floors).map(([floorName, floorRooms]) => (
              <View key={floorName} style={styles.floorSection}>
                <Text style={styles.floorTitle}>{floorName}</Text>
                <View style={styles.gridWrapper}>
                  {floorRooms.map(room => (
                    <RoomGridCard key={room.rmCode} room={room} onPress={handleRoomPress} />
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

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
    </View>
  );
}

function getOrdinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

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
    padding: tokens.spacing.xlMd,
    marginTop: tokens.spacing.md,
  },
  listContent: {
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.xl,
  },
  gridContent: {
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.xl,
  },
  floorSection: {
    marginBottom: tokens.spacing.xxl,
  },
  floorTitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.textHint,
    textTransform: 'uppercase',
    letterSpacing: tokens.typography.letterSpacing.caps,
    marginBottom: tokens.spacing.mdLg,
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.mdLg,
  },
});
