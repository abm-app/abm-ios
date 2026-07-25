import { useMemo } from 'react';
import type { MenuItem } from '@/components/shared/MenuList';
import { useAuthStore } from '@/store/authStore';

const MENU_ITEMS: MenuItem[] = [
  { label: 'Revenue Analytics', icon: 'bar-chart-2', route: 'RevenueAnalytics' },
  { label: 'User Management', icon: 'users', route: 'UserManagement' },
  { label: 'Loyalty Configuration', icon: 'award', route: 'LoyaltyConfiguration' },
];

export function useMenuItems(): MenuItem[] {
  const user = useAuthStore(state => state.user);

  return useMemo(() => {
    if (!user || user.role === 'staff') return [];
    if (user.role === 'manager') {
      return MENU_ITEMS.filter(item => item.route !== 'UserManagement');
    }
    return MENU_ITEMS; // owner
  }, [user]);
}
