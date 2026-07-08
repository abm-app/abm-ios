import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tokens from '@/theme/tokens';
import { Badge } from '@/components/ui';
import type { LiveStatusRoom, RoomStatusType } from '@/types/status';

interface RoomCardProps {
  room: LiveStatusRoom;
}

export default function RoomCard({ room }: RoomCardProps) {
  const { label } = getStatusConfig(room.status);
  const statusStyle = statusBadgeStyles[room.status] || statusBadgeStyles.vacant;

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
            <Text style={styles.guestName}>{room.guestName || 'Unknown Guest'}</Text>
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
        <Badge label={label} style={statusStyle} />
      </View>
    </View>
  );
}

function getStatusConfig(status: RoomStatusType) {
  switch (status) {
    case 'occupied':
      return { label: 'OCCUPIED' };
    case 'checkout':
      return { label: 'CHECKOUT' };
    case 'arrival':
      return { label: 'ARRIVAL' };
    case 'vacant':
    default:
      return { label: 'VACANT' };
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

const statusBadgeStyles = StyleSheet.create({
  occupied: {
    backgroundColor: tokens.colors.statusOccupiedBg,
    color: tokens.colors.statusOccupiedText,
  },
  checkout: {
    backgroundColor: tokens.colors.statusCheckoutBg,
    color: tokens.colors.statusCheckoutText,
  },
  arrival: {
    backgroundColor: tokens.colors.statusArrivalBg,
    color: tokens.colors.statusArrivalText,
  },
  vacant: { backgroundColor: tokens.colors.statusVacantBg, color: tokens.colors.statusVacantText },
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.lgMd,
    borderBottomWidth: tokens.borderWidth.hairline,
    borderBottomColor: tokens.colors.border,
  },
  roomInfoCol: {
    width: tokens.spacing.xxxl * 1.5,
  },
  roomNumber: {
    fontFamily: tokens.typography.fontFamily.headingBold,
    fontSize: tokens.typography.fontSize.h2,
    color: tokens.colors.textPrimary,
  },
  roomType: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.sectionLabel,
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
    minWidth: tokens.spacing.xxxl * 1.5,
  },
});
