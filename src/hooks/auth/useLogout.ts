import { useMutation } from '@tanstack/react-query';

import { logout as logoutApi } from '@/api/endpoints/authApi';
import { useAuthStore } from '@/store/authStore';

export function useLogout() {
  const clearSession = useAuthStore(s => s.clearSession);

  return useMutation({
    mutationFn: () => logoutApi(),
    onSettled: () => {
      clearSession();
    },
  });
}
