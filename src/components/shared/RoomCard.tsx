import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tokens from '@/theme/tokens';
import { Badge, Card } from '@/components/ui';
import { formatDateShort } from '@/utils/dateUtils';
import { getRoomStatusConfig } from '@/utils/roomUtils';
import type { LiveStatusRoom } from '@/types/status';

interface RoomCardProps {
  room: LiveStatusRoom;
}

export default function RoomCard({ room }: RoomCardProps) {
  const { label, colors } = getRoomStatusConfig(room.status);
  const statusStyle = { backgroundColor: colors.bg, color: colors.text };

  return (
    <Card variant="shadow-outlined" shadow="elevatedCard" padded style={styles.container}>
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
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
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
