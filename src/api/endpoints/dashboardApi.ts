import { DashboardSummary } from '../../types/dashboard';

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        occupancy: {
          express: { name: 'ABM Express', occupied: 35, total: 40 },
          international: { name: 'ABM International', occupied: 112, total: 150 },
        },
        todayRevenue: { express: 70000, international: 110000 },
        unreadNotifications: 3,
        lastSyncedAt: '2026-07-07T10:30:00.000Z',
        recentEvents: [
          {
            id: '1',
            type: 'check_in',
            guestName: 'R. Kumar',
            room: '121',
            timestamp: '2026-07-07T10:15:00.000Z',
          },
          {
            id: '2',
            type: 'rate_override',
            guestName: 'Suite 402',
            room: '402',
            timestamp: '2026-07-07T09:45:00.000Z',
          },
          {
            id: '3',
            type: 'check_in',
            guestName: 'A. Sharma',
            room: 'VIP',
            timestamp: '2026-07-07T09:30:00.000Z',
          },
          {
            id: '4',
            type: 'rate_override',
            guestName: 'M. Patel',
            room: '205',
            timestamp: '2026-07-07T09:00:00.000Z',
          },
          {
            id: '5',
            type: 'check_in',
            guestName: 'S. Verma',
            room: '310',
            timestamp: '2026-07-07T08:30:00.000Z',
          },
        ],
      });
    }, 800);
  });
}
