export interface Booking {
  id: string;
  guestId: string;
  rmCode: string;
  checkoutDate: string;
  pointsEarned: number;
  folioNumber?: string;
  notes?: string;
}
