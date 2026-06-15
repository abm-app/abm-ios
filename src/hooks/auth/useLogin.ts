import { useMutation } from '@tanstack/react-query';

import { login as loginApi } from '@/api/endpoints/authApi';
import { useAuthStore } from '@/store/authStore';
import type { LoginRequest } from '@/types/auth';

export function useLogin() {
  const setAuth = useAuthStore(s => s.setAuth);

  return useMutation({
    mutationFn: (payload: LoginRequest) => loginApi(payload),
    onSuccess: data => {
      setAuth(data.accessToken, data.refreshToken, data.user);
    },
  });
}
