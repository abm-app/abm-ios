import tokens from '@/theme/tokens';
import type { RoomStatusType } from '@/types/status';

export function getRoomStatusConfig(status: RoomStatusType) {
  switch (status) {
    case 'occupied':
      return {
        label: 'OCCUPIED',
        colors: {
          bg: tokens.colors.statusOccupiedBg,
          text: tokens.colors.statusOccupiedText,
          border: tokens.colors.statusOccupiedBorder,
        },
      };
    case 'checkout':
      return {
        label: 'CHECKOUT',
        colors: {
          bg: tokens.colors.statusCheckoutBg,
          text: tokens.colors.statusCheckoutText,
          border: tokens.colors.statusCheckoutBorder,
        },
      };
    case 'arrival':
      return {
        label: 'ARRIVAL',
        colors: {
          bg: tokens.colors.statusArrivalBg,
          text: tokens.colors.statusArrivalText,
          border: tokens.colors.statusArrivalBorder,
        },
      };
    case 'vacant':
    default:
      return {
        label: 'VACANT',
        colors: {
          bg: tokens.colors.statusVacantBg,
          text: tokens.colors.statusVacantText,
          border: tokens.colors.statusVacantBorder,
        },
      };
  }
}
