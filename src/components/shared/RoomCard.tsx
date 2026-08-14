import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tokens from '@/theme/tokens';
import { Badge, Card } from '@/components/ui';
import { formatDateShort } from '@/utils/dateUtils';
import { getRoomStatusConfig } from '@/utils/roomUtils';
import type { LiveStatusRoom } from '@/types/status';

interface RoomCardProps {
  room: LiveStatusRoom;
  onPress?: () => void;
}

export default function RoomCard({ room, onPress }: RoomCardProps) {
  const { label, colors } = getRoomStatusConfig(room.status);
  const statusStyle = { backgroundColor: colors.bg, color: colors.text };

  return (
    <Card
      variant="shadow-outlined"
      shadow="elevatedCard"
      padded
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.topSection}>
        <Text style={styles.roomNumber}>Room {room.rmCode}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.roomType}>{room.roomType}</Text>
          <Badge label={label} style={statusStyle} />
        </View>
      </View>

      <View style={styles.detailContainer}>
        {room.status === 'vacant' ? (
          <View style={styles.detailRow}>
            <Text style={styles.vacantText}>Ready for Check-in</Text>
          </View>
        ) : (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.guestName}>{room.guestName || 'Unknown Guest'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {room.status === 'arriving' ? 'Status: ' : 'Stay: '}
              </Text>
              <Text style={styles.detailValue}>
                {room.status === 'arriving'
                  ? 'Arriving Today'
                  : `${formatDateShort(room.arrivalDate ?? undefined)} → ${formatDateShort(room.departureDate ?? undefined)}`}
              </Text>
            </View>
          </>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    height: tokens.listCard.height,
    marginBottom: tokens.spacing.mdLg,
    justifyContent: 'space-between',
  },
  topSection: {
    gap: tokens.spacing.xs,
  },
  roomNumber: {
    fontFamily: tokens.typography.fontFamily.headingBold,
    fontSize: tokens.typography.fontSize.h2,
    color: tokens.colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomType: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    fontWeight: '500',
  },
  detailContainer: {
    backgroundColor: tokens.colors.surfaceLight,
    borderRadius: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.mdLg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guestName: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  detailLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
  },
  detailValue: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: '600',
    color: tokens.colors.textSecondary,
  },
  vacantText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontStyle: 'italic',
    color: tokens.colors.textHint,
  },
  divider: {
    height: tokens.borderWidth.thin,
    backgroundColor: tokens.colors.border,
    marginVertical: tokens.spacing.xs,
  },
});
