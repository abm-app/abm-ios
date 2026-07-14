export interface AuditEventDiffFields {
  arrivalDate?: string;
  departureDate?: string;
  status?: string;
  rate?: number;
  roomId?: string;
  rmCode?: string;
  discountPercent?: number;
  discountAmount?: number;
  adults?: number;
  children?: number;
  cancelDate?: string;
  cancelReason?: string;
}

export type AuditEventType =
  | 'new_booking'
  | 'extension'
  | 'early_checkout'
  | 'cancellation'
  | 'modification';

export type AuditProperty = 'express' | 'international';

export const PROPERTY_OPTIONS: { label: string; value: AuditProperty }[] = [
  { label: 'ABM Express', value: 'express' },
  { label: 'ABM International', value: 'international' },
];

export const EVENT_TYPE_OPTIONS: { label: string; value: AuditEventType }[] = [
  { label: 'New Booking', value: 'new_booking' },
  { label: 'Extension', value: 'extension' },
  { label: 'Early Checkout', value: 'early_checkout' },
  { label: 'Cancellation', value: 'cancellation' },
  { label: 'Modification', value: 'modification' },
];

export interface NewBookingAfter {
  arrivalDate: string;
  departureDate: string;
  rate: number;
  rmCode: string;
}

export interface AuditEventBase {
  id: string;
  chCode: string;
  rmCode: string;
  property: AuditProperty;
  guestName: string;
  detectedAt: string;
}

export type AuditEvent =
  | (AuditEventBase & {
      eventType: 'new_booking';
      before: Record<string, never>;
      after: NewBookingAfter;
    })
  | (AuditEventBase & {
      eventType: Exclude<AuditEventType, 'new_booking'>;
      before: AuditEventDiffFields;
      after: AuditEventDiffFields;
    });

export interface AuditEventsResponse {
  events: AuditEvent[];
  total: number;
  page: number;
  limit: number;
}

export interface GetAuditEventsParams {
  page: number;
  limit: number;
  filters?: {
    property?: AuditProperty[];
    eventType?: AuditEventType[];
    rmCode?: string[];
    from?: string;
    to?: string;
  };
}
