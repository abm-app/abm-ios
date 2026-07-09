import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { Badge, Card } from '@/components/ui';
import { ROOMS_DB } from '@/types/room';
import { formatDate } from '@/utils/dateUtils';
import type { Booking } from '@/types/booking';

interface GuestStayHistoryProps {
  bookings: Booking[];
}

export default function GuestStayHistory({ bookings }: GuestStayHistoryProps) {
  if (bookings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No stay history found.</Text>
      </View>
    );
  }

  return (
    <View>
      {bookings.map((booking, index) => {
        const isLast = index === bookings.length - 1;
        const roomName = ROOMS_DB[booking.rmCode] || booking.rmCode;

        return (
          <View key={booking.id} style={styles.timelineRow}>
            <View style={styles.timelineLeft}>
              <View style={styles.timelineDot} />
              {!isLast && <View style={styles.timelineLine} />}
            </View>

            <Card variant="flat" padded style={styles.timelineContent}>
              <View style={styles.stayHeader}>
                <Text style={styles.stayDate}>Checkout: {formatDate(booking.checkoutDate)}</Text>
                <Badge label={`+${booking.pointsEarned} Pts`} variant="low" />
              </View>
              <Text style={styles.roomName}>{roomName}</Text>
              <View style={styles.stayMeta}>
                <Feather
                  name={booking.notes ? 'star' : 'file-text'}
                  size={12}
                  color={tokens.colors.textMuted}
                />
                <Text style={styles.stayMetaText}>
                  {booking.notes || `Folio ${booking.folioNumber}`}
                </Text>
              </View>
            </Card>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: tokens.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: tokens.spacing.md,
  },
  timelineLeft: {
    width: 24,
    alignItems: 'center',
    marginRight: tokens.spacing.sm,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.textPrimary,
    marginTop: 6,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: tokens.colors.border,
    marginTop: tokens.spacing.sm,
  },
  timelineContent: {
    flex: 1,
  },
  stayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
  },
  stayDate: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textSecondary,
    fontWeight: '500',
  },
  roomName: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.sm,
  },
  stayMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stayMetaText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginLeft: tokens.spacing.s,
  },
});
