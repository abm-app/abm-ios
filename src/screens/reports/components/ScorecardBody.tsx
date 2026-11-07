import React from 'react';
import { View, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';
import { FinanceBreakdown } from '@/components/shared';
import type { ScorecardData } from '@/types/reports';
import DetailRowsCard from './DetailRowsCard';
import GuestMixCard from './GuestMixCard';
import KpiGrid from './KpiGrid';
import OccupancyCard from './OccupancyCard';

interface ScorecardBodyProps {
  data: ScorecardData;
}

export default function ScorecardBody({ data }: ScorecardBodyProps) {
  const { block, days, finance } = data;
  const isRange = days !== null;

  return (
    <View style={styles.stack}>
      <OccupancyCard
        percentage={block.occupancyPct}
        occupied={block.roomsOccupied}
        vacant={block.roomsVacant}
        days={days}
      />
      <KpiGrid
        items={[
          { label: 'Room revenue', value: block.roomRevenue },
          { label: 'Avg room rent', value: block.avgRoomRent },
          { label: 'Revenue PAR', value: block.revenuePAR },
          { label: 'F&B revenue', value: block.totalFnB },
        ]}
      />
      <DetailRowsCard
        title="Arrivals"
        rows={[
          { label: 'Arrivals', value: block.arrivals },
          { label: 'Walk-ins', value: block.walkIns },
          { label: 'Reservations', value: block.reservations },
          { label: 'No-shows', value: block.noShows },
          { label: 'Cancellations', value: block.cancellations },
        ]}
      />
      <DetailRowsCard
        title="In house"
        unit={isRange ? 'guest-nights' : 'guests'}
        rows={[
          { label: 'House count', value: block.houseCount },
          { label: 'Indians', value: block.indiansInHouse },
          { label: 'Foreigners', value: block.foreignersInHouse },
          { label: 'Single occupancy', value: block.singleOccupancy },
          { label: 'Multiple occupancy', value: block.multipleOccupancy },
        ]}
      />
      <DetailRowsCard
        title="Rooms"
        unit={isRange ? 'room-nights' : 'rooms'}
        rows={[
          { label: 'Under maintenance', value: block.roomsUnderMaintenance },
          { label: 'Complimentary', value: block.complimentaryRooms },
          { label: 'Day use', value: block.dayUse },
        ]}
      />
      <GuestMixCard
        domestic={block.domestic}
        foreigner={block.foreigner}
        domesticPct={block.domesticPct}
        foreignerPct={block.foreignerPct}
      />
      {finance && (
        <FinanceBreakdown
          title={isRange ? 'Cash & expenses · period' : 'Cash & expenses · today'}
          finance={finance}
          alwaysShowRoomRevenue
          style={styles.finance}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: tokens.spacing.lgMd,
  },
  finance: {
    marginHorizontal: 0,
    marginBottom: 0,
    borderRadius: tokens.borderRadius.xl,
  },
});
