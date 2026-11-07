import React from 'react';
import { View, StyleSheet } from 'react-native';

import tokens from '@/theme/tokens';
import type { ReportFinance, ScorecardData } from '@/types/reports';
import DetailRowsCard from './DetailRowsCard';
import type { DetailRow } from './DetailRowsCard';
import GuestMixCard from './GuestMixCard';
import KpiGrid from './KpiGrid';
import OccupancyCard from './OccupancyCard';

// Only the lines the server sent: managers get two, owners five. A missing key is hidden,
// never shown as zero.
function buildCashRows(finance: ReportFinance): DetailRow[] {
  const rows: DetailRow[] = [
    { label: 'Room revenue', value: finance.roomRevenue, kind: 'rupees' },
    { label: 'Cash received', value: finance.cashReceived, kind: 'rupees' },
  ];
  if (finance.pettyCashSpending !== undefined) {
    rows.push({ label: 'Petty cash spending', value: finance.pettyCashSpending, kind: 'rupees' });
  }
  if (finance.extraExpenses !== undefined) {
    rows.push({ label: 'Extra expenses', value: finance.extraExpenses, kind: 'rupees' });
  }
  if (finance.net !== undefined) {
    rows.push({ label: 'Net', value: finance.net, kind: 'rupees', isNet: true });
  }
  return rows;
}

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
        <DetailRowsCard
          title="Cash & expenses"
          unit={isRange ? 'period' : 'today'}
          rows={buildCashRows(finance)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: tokens.spacing.lgMd,
  },
});
