export interface Guest {
  _id: string;
  name: string;
  phone: string;
  email: string | null;
  properties: string[];
  totalStays: number;
  totalPointsLifetime: number;
  spendableBalance: number;
  tier: string;
  lastStayDate: string;
  firstStayDate: string;
  birthdate: string | null;
  doNotContact: boolean;
  source: string;
  createdAt: string;
}

export interface GuestResponse {
  guests: Guest[];
  total: number;
  page: number;
  limit: number;
}

export interface GuestFilters {
  search?: string;
  tier?: string;
  lapsed?: string | boolean; // e.g. '30_days', '3_months', '6_months', '12_months'
  page?: number;
  limit?: number;
}
