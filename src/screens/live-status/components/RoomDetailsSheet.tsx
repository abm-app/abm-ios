import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tokens from '@/theme/tokens';
import { FilterSheet } from '@/components/shared/FilterSheet';
import type { LiveStatusRoom, RoomStatusType } from '@/types/status';

interface RoomDetailsSheetProps {
  visible: boolean;
  onClose: () => void;
  room: LiveStatusRoom | null;
}

export function RoomDetailsSheet({ visible, onClose, room }: RoomDetailsSheetProps) {
  if (!room) return null;

  const getStatusDisplay = (status: RoomStatusType) => {
    switch (status) {
      case 'checkout':
        return {
          label: 'Checkout Today',
          bg: tokens.colors.statusCheckoutBg,
          text: tokens.colors.statusCheckoutText,
        };
      case 'arrival':
        return {
          label: 'Arrival Today',
          bg: tokens.colors.statusArrivalBg,
          text: tokens.colors.statusArrivalText,
        };
      case 'occupied':
        return {
          label: 'Occupied',
          bg: tokens.colors.statusOccupiedBg,
          text: tokens.colors.statusOccupiedText,
        };
      case 'vacant':
      default:
        return {
          label: 'Vacant',
          bg: tokens.colors.statusVacantBg,
          text: tokens.colors.statusVacantText,
        };
    }
  };

  const statusDisplay = getStatusDisplay(room.status);

  return (
    <FilterSheet
      title=""
      visible={visible}
      onClose={onClose}
      showDragIndicator
      scrollable={false}
      contentStyle={styles.sheetContent}
    >
      <View style={styles.content}>
        <View style={styles.badgeWrapper}>
          <View style={[styles.badge, { backgroundColor: statusDisplay.bg }]}>
            <Text style={[styles.badgeText, { color: statusDisplay.text }]}>
              {statusDisplay.label}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Room {room.rmCode}</Text>
        {room.guestName ? <Text style={styles.subtitle}>{room.guestName}</Text> : null}

        <View style={styles.divider} />

        {(() => {
          const dateValue = room.status === 'arrival' ? room.arrivalDate : room.departureDate;
          return dateValue ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                {room.status === 'arrival' ? 'ARRIVING' : 'DEPARTING'}
              </Text>
              <Text style={styles.sectionValue}>{dateValue}</Text>
            </View>
          ) : null;
        })()}
      </View>
    </FilterSheet>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing.lgMd,
  },
  content: {
    paddingTop: tokens.spacing.sm,
  },
  badgeWrapper: {
    flexDirection: 'row',
    marginBottom: tokens.spacing.sm,
  },
  badge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.pill,
  },
  badgeText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.bold,
    letterSpacing: tokens.typography.letterSpacing.label,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.numeric,
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.xs,
  },
  subtitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.subhead,
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.md,
  },
  divider: {
    height: tokens.borderWidth.hairline,
    backgroundColor: tokens.colors.border,
    marginBottom: tokens.spacing.md,
  },
  section: {
    marginBottom: 0,
  },
  sectionLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textHint,
    letterSpacing: tokens.typography.letterSpacing.label,
    marginBottom: tokens.spacing.xs,
  },
  sectionValue: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textPrimary,
  },
});
