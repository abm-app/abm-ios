import type { Guest, GuestFilters, GuestResponse, CommunicationLogEvent } from '@/types/guest';

const mockGuests: Guest[] = [
  {
    _id: '60d5ec49f1b2c8b1f8e4e1a1',
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
    _id: '60d5ec49f1b2c8b1f8e4e1a2',
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
    _id: '60d5ec49f1b2c8b1f8e4e1a3',
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
    _id: '60d5ec49f1b2c8b1f8e4e1a4',
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
];

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
    _id: `60d5ec49f1b2c8b1f8e4e1a${i}`,
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
  });
}

export const fetchMockGuests = async (filters: GuestFilters): Promise<GuestResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  let filtered = [...mockGuests];

  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(
      g => g.name.toLowerCase().includes(query) || g.phone.includes(query),
    );
  }

  if (filters.tier && filters.tier !== 'All') {
    filtered = filtered.filter(g => g.tier.toLowerCase() === filters.tier?.toLowerCase());
  }

  if (filters.lapsed) {
    const cutoffDate = new Date();
    if (filters.lapsed === '30_days' || filters.lapsed === true) {
      cutoffDate.setDate(cutoffDate.getDate() - 30);
    } else if (filters.lapsed === '3_months') {
      cutoffDate.setMonth(cutoffDate.getMonth() - 3);
    } else if (filters.lapsed === '6_months') {
      cutoffDate.setMonth(cutoffDate.getMonth() - 6);
    } else if (filters.lapsed === '12_months') {
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
    }
    filtered = filtered.filter(g => new Date(g.lastStayDate) < cutoffDate);
  }

  const limit = filters.limit || 10;
  const page = filters.page || 1;
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedGuests = filtered.slice(start, end);

  return {
    guests: paginatedGuests,
    total: filtered.length,
    page,
    limit,
  };
};

export const fetchGuestById = async (
  id: string,
): Promise<import('@/types/guest').GuestProfileResponse> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const guest = mockGuests.find(g => g._id === id);
  if (!guest) {
    throw new Error('Guest not found');
  }

  // Generate mock bookings based on guest stays
  const bookings: import('@/types/booking').Booking[] = [];
  const roomCodes = ['DLX_CV', 'EXEC_SU', 'STD_Q', 'STD_K', 'PREM_SU', 'PRES_SU'];

  for (let i = 0; i < guest.totalStays; i++) {
    const d = new Date(guest.lastStayDate);
    d.setMonth(d.getMonth() - i * 3); // fake spread out dates

    bookings.push({
      id: `b_${id}_${i}`,
      guestId: id,
      rmCode: roomCodes[Math.floor(Math.random() * roomCodes.length)],
      checkoutDate: d.toISOString(),
      pointsEarned: Math.floor(Math.random() * 500) + 50,
      folioNumber: `#${Math.floor(Math.random() * 90000) + 10000}`,
      notes: i % 3 === 0 ? 'Anniversary Trip' : undefined,
    });
  }

  return { guest, bookings };
};

export const updateGuestDnc = async (
  id: string,
  doNotContact: boolean,
): Promise<import('@/types/guest').GuestProfileResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const guestIndex = mockGuests.findIndex(g => g._id === id);
  if (guestIndex === -1) {
    throw new Error('Guest not found');
  }

  mockGuests[guestIndex] = {
    ...mockGuests[guestIndex],
    doNotContact,
  };

  // Re-fetch to return full profile
  return fetchGuestById(id);
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
