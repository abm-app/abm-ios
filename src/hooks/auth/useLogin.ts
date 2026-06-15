import { useMutation } from '@tanstack/react-query';

import { loginUser } from '@/api/endpoints/authApi';
import { useAuthStore } from '@/store/authStore';
import type { LoginRequest } from '@/types/auth';

export function useLogin() {
  const setSession = useAuthStore(s => s.setSession);

  return useMutation({
    mutationFn: (payload: LoginRequest) => loginUser(payload),
    onSuccess: data => {
      setSession(data.accessToken, data.refreshToken, data.user, data.modules);
    },
  });
}
