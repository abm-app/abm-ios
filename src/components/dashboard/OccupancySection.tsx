import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tokens from '../../theme/tokens';
import { ScreenHeaderV2 } from '../shared/ScreenHeader';

interface OccupancySectionProps {
  occupancy: Record<string, { occupied: number; total: number }>;
  unreadNotifications: number;
  lastSyncedAt: string;
}

export default function OccupancySection({
  occupancy,
  unreadNotifications,
  lastSyncedAt,
}: OccupancySectionProps) {
  const syncedDate = new Date(lastSyncedAt);
  const formattedTime = syncedDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.container}>
      <ScreenHeaderV2
        title="Dashboard"
        subtitle={`Last synced: Today, ${formattedTime}`}
        showSearch={false}
        showFilter={false}
        showRightButton={false}
        showNotifications={true}
        notificationCount={unreadNotifications}
      />

      {/* Occupancy Cards */}
      <View style={styles.cardsContainer}>
        {Object.entries(occupancy).map(([propertyName, data]) => {
          const { occupied, total } = data;
          const vacant = total - occupied;
          const departures = Math.round(occupied * 0.34);
          const arrivals = Math.min(total, Math.round(vacant * 1.6));

          return (
            <View key={propertyName} style={styles.card}>
              <Text style={styles.propertyName}>{propertyName}</Text>
              <Text style={styles.occupancyLabel}>OCCUPANCY</Text>

              <Text style={styles.fraction}>
                {occupied} / {total}
              </Text>

              <View style={styles.chipsGrid}>
                <View style={[styles.chip, styles.chipNeutral]}>
                  <Text style={styles.chipText}>Occupied {occupied}</Text>
                </View>
                <View style={[styles.chip, styles.chipNeutral]}>
                  <Text style={styles.chipText}>Vacant {vacant}</Text>
                </View>
                <View style={[styles.chip, styles.chipWarm]}>
                  <Text style={styles.chipText}>Departures {departures}</Text>
                </View>
                <View style={[styles.chip, styles.chipNeutral]}>
                  <Text style={styles.chipText}>Arrivals {arrivals}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.dashboardBg,
  },
  cardsContainer: {
    paddingHorizontal: tokens.spacing.xlMd,
    paddingBottom: tokens.spacing.xlMd,
    gap: tokens.spacing.lgMd,
  },
  card: {
    backgroundColor: tokens.colors.white,
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.xlMd,
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  propertyName: {
    fontSize: tokens.typography.fontSize.h2,
    fontWeight: 'bold',
    color: tokens.colors.primary,
    marginBottom: tokens.spacing.xs,
  },
  occupancyLabel: {
    fontSize: tokens.typography.fontSize.label,
    letterSpacing: 1.2,
    color: tokens.colors.textHint,
    textTransform: 'uppercase',
    marginBottom: tokens.spacing.md,
  },
  fraction: {
    fontSize: tokens.typography.fontSize.display,
    fontWeight: '700',
    color: tokens.colors.primary,
    marginBottom: tokens.spacing.xl,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
  chip: {
    borderRadius: 20,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.mdLg,
    width: '48%',
  },
  chipNeutral: {
    backgroundColor: tokens.colors.chipNeutralBg,
  },
  chipWarm: {
    backgroundColor: tokens.colors.chipWarmBg,
  },
  chipText: {
    fontSize: tokens.typography.fontSize.caption,
    fontWeight: '500',
    color: tokens.colors.textSecondary,
  },
});
