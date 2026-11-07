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

// Owner-only events about money. The server never sends them to managers or staff.
export type MoneyEventType =
  | 'expense_created'
  | 'expense_updated'
  | 'expense_deleted'
  | 'expense_category_created'
  | 'expense_category_updated'
  | 'petty_cash_added'
  | 'petty_cash_removed';

export type AnyAuditEventType = AuditEventType | MoneyEventType;

export type AuditProperty = 'express' | 'international';

export const PROPERTY_OPTIONS: { label: string; value: AuditProperty }[] = [
  { label: 'ABM Express', value: 'express' },
  { label: 'ABM International', value: 'international' },
];

export const PROPERTY_DISPLAY_NAMES: Record<AuditProperty, string> = {
  express: 'ABM Express',
  international: 'ABM International',
};

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

export interface AuditEventCore {
  id: string;
  // Category events carry no hotel.
  property?: AuditProperty;
  actor?: string;
  detectedAt: string;
  idempotencyKey?: string;
}

export interface AuditEventBase extends AuditEventCore {
  chCode?: string;
  regId?: number;
  rmCode: string;
  property: AuditProperty;
  guestName: string;
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
    })
  | (AuditEventCore & {
      eventType: MoneyEventType;
      before: Record<string, unknown>;
      after: Record<string, unknown>;
    });

export type MoneyAuditEvent = Extract<AuditEvent, { eventType: MoneyEventType }>;
export type BookingAuditEvent = Exclude<AuditEvent, MoneyAuditEvent>;

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
    eventType?: AnyAuditEventType[];
    rmCode?: string[];
    from?: string;
    to?: string;
    search?: string;
  };
}
