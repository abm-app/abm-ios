import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';
import { Badge, Card } from '@/components/ui';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/shared';
import { ROOMS_DB } from '@/types/room';
import { formatDate } from '@/utils/dateUtils';
import { useGuestStays } from '@/hooks/guests/useGuests';

interface GuestStayHistoryProps {
  guestId: string;
}

export default function GuestStayHistory({ guestId }: GuestStayHistoryProps) {
  const { data, isLoading, isError, refetch } = useGuestStays(guestId);

  if (isLoading) {
    return (
      <View style={styles.stateContainer}>
        <LoadingSpinner />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.stateContainer}>
        <ErrorState message="Failed to load stay history" onRetry={refetch} />
      </View>
    );
  }

  const bookings = data?.stays ?? [];

  if (bookings.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <EmptyState
          icon="calendar"
          title="No stay history"
          subtitle="This guest doesn't have any recorded stays yet."
        />
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
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
                <View style={styles.stayDates}>
                  <Text style={styles.stayDate}>Check-in: {formatDate(booking.checkinDate)}</Text>
                  <Text style={styles.stayDate}>Checkout: {formatDate(booking.checkoutDate)}</Text>
                </View>
                {!!booking.pointsEarned && (
                  <Badge label={`+${booking.pointsEarned} Pts`} variant="low" />
                )}
              </View>
              <Text style={styles.roomName}>Room No. {roomName}</Text>
            </Card>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stateContainer: {
    padding: tokens.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  listContainer: {
    paddingVertical: tokens.spacing.md,
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
  stayDates: {
    gap: tokens.spacing.xs,
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
    marginTop: tokens.spacing.sm,
  },
});
