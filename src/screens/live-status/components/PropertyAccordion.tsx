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
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        const isDeparture =
          room.status === 'checking_out' ||
          (room.departureDate && room.departureDate.split('T')[0] === todayStr);
        const isArrival =
          room.status === 'arriving' ||
          (room.arrivalDate && room.arrivalDate.split('T')[0] === todayStr);

        if (activeFilters.includes('departures') && isDeparture) isMatch = true;
        if (activeFilters.includes('arrivals') && isArrival) isMatch = true;
        if (activeFilters.includes('vacant') && room.status === 'vacant') isMatch = true;
        if (activeFilters.includes('occupied') && room.status === 'occupied') isMatch = true;

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
      <TouchableOpacity onPress={toggleExpand} style={styles.header} activeOpacity={0.7}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
            {property.name}
          </Text>
          <Text style={styles.count} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
            (occupied: {property.occupied}, total: {property.totalRooms})
          </Text>
        </View>
        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={tokens.iconSizes.content}
          color={tokens.colors.textSecondary}
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
                <RoomCard key={room.rmCode} room={room} onPress={() => onRoomPress(room)} />
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
    marginBottom: tokens.spacing.mdLg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexShrink: 1,
    gap: tokens.spacing.xs,
    paddingRight: tokens.spacing.sm,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.subhead,
    fontWeight: '600',
    color: tokens.colors.textSecondary,
    flexShrink: 1,
  },
  count: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.subhead,
    color: tokens.colors.textMuted,
    flexShrink: 0,
  },
  content: {
    marginTop: tokens.spacing.sm,
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
    letterSpacing: tokens.typography.letterSpacing.captionCaps,
    marginBottom: tokens.spacing.md,
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
  },
});
