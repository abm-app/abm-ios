export type PropertyKey = 'express' | 'international';

export type RoomStatusType = 'occupied' | 'vacant' | 'checking_out' | 'arriving';

export interface PropertyStatusOverview {
  name: string;
  key: PropertyKey;
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
  guestName: string | null;
  arrivalDate: string | null;
  departureDate: string | null;
}

export interface LiveStatusRoomsResponse {
  property: PropertyKey;
  rooms: LiveStatusRoom[];
}
