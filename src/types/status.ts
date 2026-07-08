export type RoomStatusType = 'occupied' | 'vacant' | 'checkout' | 'arrival';

export interface PropertyStatusOverview {
  name: string;
  key: string;
  totalRooms: number;
  occupied: number;
  vacant: number;
  checkingOutToday: number;
  arrivingToday: number;
}

export interface LiveStatusOverviewResponse {
  properties: PropertyStatusOverview[];
  lastSyncedAt: string;
}

export interface LiveStatusRoom {
  rmCode: string;
  roomType: string;
  status: RoomStatusType;
  guestName?: string;
  arrivalDate?: string;
  departureDate?: string;
}

export interface LiveStatusRoomsResponse {
  property: string;
  rooms: LiveStatusRoom[];
}
