export interface Guest {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  birthdate: string | null;
  properties: string[];
  totalStays: number;
  totalPointsLifetime: number;
  spendableBalance: number | undefined;
  tier: string;
  lastStayDate: string | null;
  firstStayDate: string | null;
  doNotContact: boolean;
  source: string;
  createdAt: string;
  vipStatus: string | null;
  blacklisted: boolean;
  nationalityId: number;
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
  source?: string;
  property?: string;
  lapsedDays?: number;
  doNotContact?: 'true' | 'false';
  page?: number;
  limit?: number;
}

export interface GuestProfileResponse {
  guest: Guest;
  bookings: import('./booking').Booking[];
}

export interface CommunicationLogEvent {
  _id: string;
  campaignId: string | null;
  templateId: string;
  templateName: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | string;
  channel: string;
}
