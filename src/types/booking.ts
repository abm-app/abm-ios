export interface Booking {
  id: string;
  guestId: string;
  rmCode: string;
  property?: 'express' | 'international' | null;
  checkinStaffName?: string | null;
  checkoutStaffName?: string | null;
  checkinDate: string;
  checkoutDate: string;
  pointsEarned: number | null;
  folioNumber?: string;
  notes?: string;
}

export interface GuestStaysResponse {
  stays: Booking[];
  total: number;
}
