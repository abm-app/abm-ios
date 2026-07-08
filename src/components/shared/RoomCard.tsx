import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tokens from '@/theme/tokens';
import { Badge } from '@/components/ui';
import type { LiveStatusRoom, RoomStatusType } from '@/types/status';

interface RoomCardProps {
  room: LiveStatusRoom;
}

export default function RoomCard({ room }: RoomCardProps) {
  const { statusColors, label } = getStatusConfig(room.status);

  return (
    <View style={styles.container}>
      <View style={styles.roomInfoCol}>
        <Text style={styles.roomNumber}>{room.rmCode}</Text>
        <Text style={styles.roomType}>{room.roomType}</Text>
      </View>
      <View style={styles.guestInfoCol}>
        {room.status === 'vacant' ? (
          <Text style={styles.vacantText}>Ready for Check-in</Text>
        ) : (
          <>
            <Text style={styles.guestName}>{room.guestName}</Text>
            {room.status === 'arrival' ? (
              <Text style={styles.dates}>Arriving Today</Text>
            ) : (
              <Text style={styles.dates}>
                {formatDateShort(room.arrivalDate)} - {formatDateShort(room.departureDate)}
              </Text>
            )}
          </>
        )}
      </View>
      <View style={styles.statusCol}>
        <Badge
          label={label}
          style={{ backgroundColor: statusColors.bg, color: statusColors.text }}
        />
      </View>
    </View>
  );
}

function getStatusConfig(status: RoomStatusType) {
  switch (status) {
    case 'occupied':
      return {
        label: 'OCCUPIED',
        statusColors: {
          bg: tokens.colors.statusOccupiedBg,
          text: tokens.colors.statusOccupiedText,
        },
      };
    case 'checkout':
      return {
        label: 'CHECKOUT',
        statusColors: {
          bg: tokens.colors.statusCheckoutBg,
          text: tokens.colors.statusCheckoutText,
        },
      };
    case 'arrival':
      return {
        label: 'ARRIVAL',
        statusColors: {
          bg: tokens.colors.statusArrivalBg,
          text: tokens.colors.statusArrivalText,
        },
      };
    case 'vacant':
    default:
      return {
        label: 'VACANT',
        statusColors: {
          bg: tokens.colors.statusVacantBg,
          text: tokens.colors.statusVacantText,
        },
      };
  }
}

// Quick helper since we don't have a shared date formatter for "Jun 07" available immediately
function formatDateShort(dateStr?: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // fallback
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const m = months[date.getMonth()];
  const d = date.getDate().toString().padStart(2, '0');
  return `${m} ${d}`;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.lgMd,
    borderBottomWidth: tokens.borderWidth.hairline,
    borderBottomColor: tokens.colors.border,
  },
  roomInfoCol: {
    width: 80,
  },
  roomNumber: {
    fontFamily: tokens.typography.fontFamily.headingBold,
    fontSize: tokens.typography.fontSize.h2,
    color: tokens.colors.textPrimary,
  },
  roomType: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: 10, // Slight variation for very small text
    color: tokens.colors.textHint,
    marginTop: tokens.spacing.xxs,
  },
  guestInfoCol: {
    flex: 1,
    paddingHorizontal: tokens.spacing.md,
  },
  guestName: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.subhead,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.textSecondary,
  },
  dates: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginTop: tokens.spacing.xxs,
  },
  vacantText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontStyle: 'italic',
    color: tokens.colors.textHint,
  },
  statusCol: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
});
