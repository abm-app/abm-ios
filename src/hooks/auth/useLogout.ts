import { useMutation } from '@tanstack/react-query';

import { logout as logoutApi } from '@/api/endpoints/authApi';
import { useAuthStore } from '@/store/authStore';

export function useLogout() {
  const logout = useAuthStore(s => s.logout);

  return useMutation({
    mutationFn: () => logoutApi(),
    onSettled: () => {
      logout();
    },
  });
}
