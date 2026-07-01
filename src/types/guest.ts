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
  lapsed?: boolean; // Lapsed > 30 Days
  page?: number;
  limit?: number;
}
