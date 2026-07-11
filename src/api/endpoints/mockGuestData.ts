import type { Guest, CommunicationLogEvent } from '@/types/guest';

const mockGuests = [
  {
    id: '60d5ec49f1b2c8b1f8e4e1a1',
    name: 'Aarav Patel',
    phone: '+91 98765 43210',
    email: 'aarav.patel@example.com',
    properties: ['express', 'international'],
    totalStays: 5,
    totalPointsLifetime: 750,
    spendableBalance: 500,
    tier: 'Gold',
    lastStayDate: '2023-10-12T14:30:00Z',
    firstStayDate: '2022-11-12T09:15:00Z',
    birthdate: '1988-05-14',
    doNotContact: false,
    source: 'direct',
    createdAt: '2022-11-12T09:15:00Z',
  },
  {
    id: '60d5ec49f1b2c8b1f8e4e1a2',
    name: 'Marcus Reed',
    phone: '+44 7700 900077',
    email: 'marcus.reed@example.com',
    properties: ['express'],
    totalStays: 2,
    totalPointsLifetime: 450,
    spendableBalance: 450,
    tier: 'Bronze',
    lastStayDate: '2023-11-05T11:20:00Z',
    firstStayDate: '2023-10-01T11:20:00Z',
    birthdate: null,
    doNotContact: true,
    source: 'ota',
    createdAt: '2023-10-01T11:20:00Z',
  },
  {
    id: '60d5ec49f1b2c8b1f8e4e1a3',
    name: 'Elena Larson',
    phone: '+1 555 0198',
    email: 'elena.larson@example.com',
    properties: ['international'],
    totalStays: 12,
    totalPointsLifetime: 3200,
    spendableBalance: 2100,
    tier: 'Silver',
    lastStayDate: '2023-12-01T10:00:00Z',
    firstStayDate: '2021-06-15T09:00:00Z',
    birthdate: '1990-08-22',
    doNotContact: false,
    source: 'direct',
    createdAt: '2021-06-15T09:00:00Z',
  },
  {
    id: '60d5ec49f1b2c8b1f8e4e1a4',
    name: 'Sarah Jenkins',
    phone: '+91 98765 43210',
    email: 'sarah.jenkins@example.com',
    properties: ['express'],
    totalStays: 8,
    totalPointsLifetime: 1450,
    spendableBalance: 1450,
    tier: 'Gold',
    lastStayDate: '2023-10-12T14:30:00Z',
    firstStayDate: '2022-01-10T09:15:00Z',
    birthdate: '1985-03-12',
    doNotContact: false,
    source: 'direct',
    createdAt: '2022-01-10T09:15:00Z',
  },
] as unknown as Guest[];

// Generate more mock data for infinite scrolling
for (let i = 5; i <= 45; i++) {
  const isSuite = i % 3 === 0;
  const isLapsed = i % 4 === 0;

  const date = new Date();
  if (isLapsed) {
    date.setDate(date.getDate() - 40); // Lapsed > 30 days
  } else {
    date.setDate(date.getDate() - 5);
  }

  mockGuests.push({
    id: `60d5ec49f1b2c8b1f8e4e1a${i}`,
    name: `Guest User ${i}`,
    phone: `+91 90000 000${i.toString().padStart(2, '0')}`,
    email: `guest${i}@example.com`,
    properties: ['express'],
    totalStays: Math.floor(Math.random() * 10) + 1,
    totalPointsLifetime: Math.floor(Math.random() * 2000) + 100,
    spendableBalance: Math.floor(Math.random() * 1000) + 50,
    tier: isSuite ? 'Gold' : i % 2 === 0 ? 'Silver' : 'Bronze',
    lastStayDate: date.toISOString(),
    firstStayDate: '2022-01-01T00:00:00Z',
    birthdate: null,
    doNotContact: false,
    source: 'direct',
    createdAt: '2022-01-01T00:00:00Z',
  } as unknown as Guest);
}

export const updateGuestDnc = async (
  id: string,
  doNotContact: boolean,
): Promise<import('@/types/guest').GuestProfileResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const guestIndex = mockGuests.findIndex(g => g.id === id);
  if (guestIndex === -1) {
    throw new Error('Guest not found');
  }

  mockGuests[guestIndex] = {
    ...mockGuests[guestIndex],
    doNotContact,
  };

  return Promise.resolve({
    guest: mockGuests[guestIndex],
    bookings: [],
  });
};

export const deductGuestPoints = async (id: string, points: number): Promise<void> => {
  const guestIndex = mockGuests.findIndex(g => g.id === id);
  if (guestIndex !== -1) {
    mockGuests[guestIndex] = {
      ...mockGuests[guestIndex],
      spendableBalance: Math.max(0, (mockGuests[guestIndex].spendableBalance ?? 0) - points),
    };
  }
};

export const fetchGuestCommunications = async (_id: string): Promise<CommunicationLogEvent[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    {
      _id: 'msg_67890abc',
      campaignId: 'camp_888',
      templateId: 'festival_offer_01',
      templateName: 'Diwali Special Offer',
      sentAt: '2026-06-20T10:30:00Z',
      status: 'read',
      channel: 'whatsapp',
    },
    {
      _id: 'msg_12345xyz',
      campaignId: null,
      templateId: 'post_checkout_01',
      templateName: 'Post-Checkout Thank You',
      sentAt: '2026-05-15T09:15:00Z',
      status: 'delivered',
      channel: 'whatsapp',
    },
    {
      _id: 'msg_98765fail',
      campaignId: 'camp_999',
      templateId: 'reengagement_02',
      templateName: 'We Miss You - 10% Off',
      sentAt: '2026-04-10T14:20:00Z',
      status: 'failed',
      channel: 'whatsapp',
    },
  ];
};
