import tokens from '@/theme/tokens';
import type { RoomStatusType } from '@/types/status';

export function getRoomStatusConfig(status: RoomStatusType) {
  switch (status) {
    case 'occupied':
      return {
        label: 'Occupied',
        colors: {
          bg: tokens.colors.statusOccupiedBg,
          text: tokens.colors.statusOccupiedText,
          border: tokens.colors.statusOccupiedBorder,
        },
      };
    case 'checking_out':
      return {
        label: 'Checkout',
        colors: {
          bg: tokens.colors.statusCheckoutBg,
          text: tokens.colors.statusCheckoutText,
          border: tokens.colors.statusCheckoutBorder,
        },
      };
    case 'arriving':
      return {
        label: 'Arrival',
        colors: {
          bg: tokens.colors.statusArrivalBg,
          text: tokens.colors.statusArrivalText,
          border: tokens.colors.statusArrivalBorder,
        },
      };
    case 'dirty':
      return {
        label: 'Dirty',
        colors: {
          bg: tokens.colors.statusDirtyBg,
          text: tokens.colors.statusDirtyText,
          border: tokens.colors.statusDirtyBorder,
        },
      };
    case 'maintenance':
      return {
        label: 'Maintenance',
        colors: {
          bg: tokens.colors.statusMaintenanceBg,
          text: tokens.colors.statusMaintenanceText,
          border: tokens.colors.statusMaintenanceBorder,
        },
      };
    case 'management':
      return {
        label: 'Management',
        colors: {
          bg: tokens.colors.statusManagementBg,
          text: tokens.colors.statusManagementText,
          border: tokens.colors.statusManagementBorder,
        },
      };
    case 'vacant':
    default:
      return {
        label: 'Vacant',
        colors: {
          bg: tokens.colors.statusVacantBg,
          text: tokens.colors.statusVacantText,
          border: tokens.colors.statusVacantBorder,
        },
      };
  }
}
