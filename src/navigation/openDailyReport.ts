import { authStore } from '@/store/authStore';
import { navigationRef } from './navigationRef';

// Opens the Daily scorecard for a date (a "report ready" notification). Back returns to the
// Menu home. Staff cannot reach Reports, so for them this does nothing.
export function openDailyReport(date: string) {
  if (!navigationRef.isReady()) return;
  if (authStore.getState().user?.role === 'staff') return;

  navigationRef.navigate('Main', {
    screen: 'Menu',
    params: {
      screen: 'ReportScorecard',
      params: { type: 'daily', from: date },
      initial: false,
    },
  });
}
