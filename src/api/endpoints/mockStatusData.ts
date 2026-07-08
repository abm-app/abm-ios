import type { LiveStatusOverviewResponse, LiveStatusRoomsResponse } from '@/types/status';

export const mockStatusOverview: LiveStatusOverviewResponse = {
  properties: [
    {
      name: 'Abm Express',
      key: 'express',
      totalRooms: 40,
      occupied: 35,
      vacant: 3,
      checkingOutToday: 2,
      arrivingToday: 4,
    },
    {
      name: 'Abm International',
      key: 'international',
      totalRooms: 45,
      occupied: 38,
      vacant: 5,
      checkingOutToday: 3,
      arrivingToday: 2,
    },
  ],
  lastSyncedAt: '2026-06-09T10:30:00Z',
};

export const mockStatusRoomsExpress: LiveStatusRoomsResponse = {
  property: 'express',
  rooms: [
    {
      rmCode: '101',
      roomType: 'Standard Room',
      status: 'checkout',
      guestName: 'Rahul Kumar',
      arrivalDate: '2026-06-07',
      departureDate: '2026-06-10',
    },
    {
      rmCode: '102',
      roomType: 'Deluxe',
      status: 'occupied',
      guestName: 'Sarah Jenkins',
      arrivalDate: '2026-06-08',
      departureDate: '2026-06-12',
    },
    {
      rmCode: '201',
      roomType: 'Executive Suite',
      status: 'arrival',
      guestName: 'A. Sharma',
      arrivalDate: '2026-06-09',
      departureDate: '2026-06-11',
    },
    {
      rmCode: '205',
      roomType: 'Standard Room',
      status: 'vacant',
    },
    {
      rmCode: '121',
      roomType: 'Standard',
      status: 'occupied',
      guestName: 'R. Kumar',
      arrivalDate: '2026-06-07',
      departureDate: '2026-06-10',
    },
  ],
};
