export interface AuditEventBefore {
  departureDate?: string;
  rmCode?: string;
}

export interface AuditEventAfter {
  departureDate?: string;
  rmCode?: string;
}

export type AuditEventType =
  | 'extension'
  | 'room_change'
  | 'checkout'
  | 'cancellation'
  | 'modification';

export interface AuditEvent {
  id: string;
  eventType: AuditEventType;
  chCode: string;
  rmCode: string;
  property: string;
  guestName: string;
  before: AuditEventBefore;
  after: AuditEventAfter;
  detectedAt: string;
  description?: string;
  revenueDelta?: number;
}

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
    property?: string;
    eventType?: string;
    rmCode?: string;
    from?: string;
    to?: string;
  };
}

const mockAuditEvents: AuditEvent[] = [
  {
    id: 'evt-001',
    eventType: 'cancellation',
    chCode: 'CH-1000',
    rmCode: '101',
    property: 'express',
    guestName: 'Rahul Kumar',
    before: {},
    after: {},
    description: 'Booking cancelled. No revenue captured.',
    detectedAt: '2026-10-24T10:15:00Z',
  },
  {
    id: 'evt-002',
    eventType: 'extension',
    chCode: 'CH-1001',
    rmCode: '405',
    property: 'grand',
    guestName: 'Sarah Jenkins',
    before: { departureDate: '2026-10-24T12:00:00Z' },
    after: { departureDate: '2026-10-26T12:00:00Z' },
    revenueDelta: 8000,
    detectedAt: '2026-10-24T09:30:00Z',
  },
  {
    id: 'evt-003',
    eventType: 'modification',
    chCode: 'CH-1002',
    rmCode: '202',
    property: 'suite',
    guestName: 'James Holden',
    before: {},
    after: {},
    description: 'Guest profile updated (Phone number changed)',
    detectedAt: '2026-10-24T08:12:00Z',
  },
  {
    id: 'evt-004',
    eventType: 'extension',
    chCode: 'CH-1004',
    rmCode: '401',
    property: 'express',
    guestName: 'Diana Evans',
    before: { departureDate: '2026-06-14T12:00:00Z' },
    after: { departureDate: '2026-06-15T12:00:00Z' },
    detectedAt: '2026-06-13T16:20:00Z',
  },
  {
    id: 'evt-005',
    eventType: 'room_change',
    chCode: 'CH-1005',
    rmCode: '112',
    property: 'suite',
    guestName: 'Ethan Wright',
    before: { rmCode: '108' },
    after: { rmCode: '112' },
    detectedAt: '2026-06-15T10:05:00Z',
  },
  {
    id: 'evt-006',
    eventType: 'checkout',
    chCode: 'CH-1006',
    rmCode: '250',
    property: 'grand',
    guestName: 'Fiona Garcia',
    before: {},
    after: {},
    detectedAt: '2026-06-16T11:30:00Z',
  },
  {
    id: 'evt-007',
    eventType: 'extension',
    chCode: 'CH-1007',
    rmCode: '305',
    property: 'express',
    guestName: 'George Harris',
    before: { departureDate: '2026-06-18T12:00:00Z', rmCode: '305' },
    after: { departureDate: '2026-06-20T12:00:00Z', rmCode: '305' },
    detectedAt: '2026-06-17T15:50:00Z',
  },
  {
    id: 'evt-008',
    eventType: 'room_change',
    chCode: 'CH-1008',
    rmCode: '422',
    property: 'grand',
    guestName: 'Hannah Clark',
    before: { rmCode: '410' },
    after: { rmCode: '422' },
    detectedAt: '2026-06-19T13:40:00Z',
  },
  {
    id: 'evt-009',
    eventType: 'checkout',
    chCode: 'CH-1009',
    rmCode: '118',
    property: 'suite',
    guestName: 'Ian Lewis',
    before: {},
    after: {},
    detectedAt: '2026-06-20T08:55:00Z',
  },
  {
    id: 'evt-010',
    eventType: 'extension',
    chCode: 'CH-1010',
    rmCode: '234',
    property: 'express',
    guestName: 'Julia Walker',
    before: { departureDate: '2026-06-22T12:00:00Z' },
    after: { departureDate: '2026-06-25T12:00:00Z' },
    detectedAt: '2026-06-21T17:10:00Z',
  },
  {
    id: 'evt-011',
    eventType: 'room_change',
    chCode: 'CH-1011',
    rmCode: '345',
    property: 'suite',
    guestName: 'Kevin Hall',
    before: { rmCode: '330' },
    after: { rmCode: '345' },
    detectedAt: '2026-06-23T09:25:00Z',
  },
  {
    id: 'evt-012',
    eventType: 'checkout',
    chCode: 'CH-1012',
    rmCode: '411',
    property: 'grand',
    guestName: 'Laura Allen',
    before: {},
    after: {},
    detectedAt: '2026-06-25T10:45:00Z',
  },
  {
    id: 'evt-013',
    eventType: 'extension',
    chCode: 'CH-1013',
    rmCode: '122',
    property: 'express',
    guestName: 'Michael Young',
    before: { departureDate: '2026-06-28T12:00:00Z', rmCode: '122' },
    after: { departureDate: '2026-06-29T12:00:00Z', rmCode: '122' },
    detectedAt: '2026-06-27T14:15:00Z',
  },
  {
    id: 'evt-014',
    eventType: 'room_change',
    chCode: 'CH-1014',
    rmCode: '245',
    property: 'grand',
    guestName: 'Nina King',
    before: { rmCode: '201' },
    after: { rmCode: '245' },
    detectedAt: '2026-06-29T11:05:00Z',
  },
  {
    id: 'evt-015',
    eventType: 'checkout',
    chCode: 'CH-1015',
    rmCode: '350',
    property: 'suite',
    guestName: 'Oliver Scott',
    before: {},
    after: {},
    detectedAt: '2026-07-01T08:20:00Z',
  },
  {
    id: 'evt-016',
    eventType: 'extension',
    chCode: 'CH-1016',
    rmCode: '433',
    property: 'express',
    guestName: 'Paula Green',
    before: { departureDate: '2026-07-03T12:00:00Z' },
    after: { departureDate: '2026-07-05T12:00:00Z' },
    detectedAt: '2026-07-02T16:40:00Z',
  },
  {
    id: 'evt-017',
    eventType: 'room_change',
    chCode: 'CH-1017',
    rmCode: '125',
    property: 'suite',
    guestName: 'Quinn Adams',
    before: { rmCode: '115' },
    after: { rmCode: '125' },
    detectedAt: '2026-07-04T09:50:00Z',
  },
  {
    id: 'evt-018',
    eventType: 'checkout',
    chCode: 'CH-1018',
    rmCode: '260',
    property: 'grand',
    guestName: 'Rachel Baker',
    before: {},
    after: {},
    detectedAt: '2026-07-05T12:10:00Z',
  },
  {
    id: 'evt-019',
    eventType: 'extension',
    chCode: 'CH-1019',
    rmCode: '312',
    property: 'express',
    guestName: 'Sam Nelson',
    before: { departureDate: '2026-07-08T12:00:00Z', rmCode: '312' },
    after: { departureDate: '2026-07-10T12:00:00Z', rmCode: '312' },
    detectedAt: '2026-07-07T15:30:00Z',
  },
  {
    id: 'evt-020',
    eventType: 'room_change',
    chCode: 'CH-1020',
    rmCode: '445',
    property: 'grand',
    guestName: 'Tina Carter',
    before: { rmCode: '420' },
    after: { rmCode: '445' },
    detectedAt: '2026-07-09T10:20:00Z',
  },
  {
    id: 'evt-021',
    eventType: 'checkout',
    chCode: 'CH-1021',
    rmCode: '135',
    property: 'suite',
    guestName: 'Umar Mitchell',
    before: {},
    after: {},
    detectedAt: '2026-07-11T09:40:00Z',
  },
  {
    id: 'evt-022',
    eventType: 'extension',
    chCode: 'CH-1022',
    rmCode: '277',
    property: 'express',
    guestName: 'Victor Perez',
    before: { departureDate: '2026-07-14T12:00:00Z' },
    after: { departureDate: '2026-07-16T12:00:00Z' },
    detectedAt: '2026-07-13T14:55:00Z',
  },
  {
    id: 'evt-023',
    eventType: 'room_change',
    chCode: 'CH-1023',
    rmCode: '333',
    property: 'suite',
    guestName: 'Wendy Roberts',
    before: { rmCode: '310' },
    after: { rmCode: '333' },
    detectedAt: '2026-07-15T11:15:00Z',
  },
  {
    id: 'evt-024',
    eventType: 'checkout',
    chCode: 'CH-1024',
    rmCode: '450',
    property: 'grand',
    guestName: 'Xander Turner',
    before: {},
    after: {},
    detectedAt: '2026-07-16T10:00:00Z',
  },
  {
    id: 'evt-025',
    eventType: 'extension',
    chCode: 'CH-1025',
    rmCode: '144',
    property: 'express',
    guestName: 'Yara Phillips',
    before: { departureDate: '2026-07-19T12:00:00Z', rmCode: '144' },
    after: { departureDate: '2026-07-20T12:00:00Z', rmCode: '144' },
    detectedAt: '2026-07-18T16:25:00Z',
  },
];

export const getAuditEvents = (params: GetAuditEventsParams): Promise<AuditEventsResponse> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const { page, limit } = params;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedEvents = mockAuditEvents.slice(startIndex, endIndex);

      resolve({
        events: paginatedEvents,
        total: 142,
        page,
        limit,
      });
    }, 800);
  });
};
