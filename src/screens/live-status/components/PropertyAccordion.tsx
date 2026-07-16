import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '@/theme/tokens';
import { useStatusRooms } from '@/hooks/status/useStatusRooms';
import { LoadingSpinner, ErrorState } from '@/components/shared';
import RoomCard from '@/components/shared/RoomCard';
import RoomGridCard from './RoomGridCard';
import type { PropertyStatusOverview, LiveStatusRoom } from '@/types/status';
import type { ViewMode } from './LiveStatusFilters';

interface PropertyAccordionProps {
  property: PropertyStatusOverview;
  searchQuery: string;
  activeFilters: string[];
  viewMode: ViewMode;
  onRoomPress: (room: LiveStatusRoom) => void;
  defaultExpanded?: boolean;
}

const EMPTY_ROOMS: LiveStatusRoom[] = [];

export default function PropertyAccordion({
  property,
  searchQuery,
  activeFilters,
  viewMode,
  onRoomPress,
  defaultExpanded = false,
}: PropertyAccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const { data, isLoading, isError, error, refetch } = useStatusRooms(property.key, expanded);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const rooms = data?.rooms || EMPTY_ROOMS;

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        room.rmCode.toLowerCase().includes(query) ||
        (room.guestName || '').toLowerCase().includes(query);

      if (!matchesSearch) return false;

      if (!activeFilters.includes('all')) {
        let isMatch = false;
        if (activeFilters.includes('departures') && room.status === 'checking_out') isMatch = true;
        if (activeFilters.includes('arrivals') && room.status === 'arriving') isMatch = true;
        if (activeFilters.includes('vacant') && room.status === 'vacant') isMatch = true;
        if (!isMatch) return false;
      }
      return true;
    });
  }, [rooms, searchQuery, activeFilters]);

  const floors = useMemo(() => {
    const grouped: Record<string, LiveStatusRoom[]> = {};
    filteredRooms.forEach(room => {
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleExpand} activeOpacity={0.8}>
        <View style={styles.headerContent}>
          <Text style={styles.propertyName}>{property.name}</Text>
          <Text style={styles.propertyStats}>
            {property.totalRooms} Rooms • {property.occupied} Occupied
          </Text>
        </View>
        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={tokens.colors.textPrimary}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <ErrorState message={error.message} onRetry={refetch} />
          ) : filteredRooms.length === 0 ? (
            <Text style={styles.emptyText}>No rooms match your filters.</Text>
          ) : viewMode === 'list' ? (
            <View style={styles.listContent}>
              {filteredRooms.map(room => (
                <RoomCard key={room.rmCode} room={room} />
              ))}
            </View>
          ) : (
            <View style={styles.gridContent}>
              {Object.entries(floors).map(([floorName, floorRooms]) => (
                <View key={floorName} style={styles.floorSection}>
                  <Text style={styles.floorTitle}>{floorName}</Text>
                  <View style={styles.gridWrapper}>
                    {floorRooms.map(room => (
                      <RoomGridCard key={room.rmCode} room={room} onPress={onRoomPress} />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
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
    marginBottom: tokens.spacing.lg,
    backgroundColor: tokens.colors.surfaceLight,
    borderRadius: tokens.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.white,
  },
  headerContent: {
    flex: 1,
  },
  propertyName: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.h2,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.xs,
  },
  propertyStats: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textHint,
  },
  content: {
    padding: tokens.spacing.md,
  },
  emptyText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textHint,
    textAlign: 'center',
    padding: tokens.spacing.xl,
  },
  listContent: {
    gap: tokens.spacing.md,
  },
  gridContent: {
    gap: tokens.spacing.lg,
  },
  floorSection: {
    marginBottom: tokens.spacing.md,
  },
  floorTitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: '700',
    color: tokens.colors.textHint,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: tokens.spacing.md,
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
  },
});
