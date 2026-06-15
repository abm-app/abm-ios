import { useMutation } from '@tanstack/react-query';

import { login as loginApi } from '@/api/endpoints/authApi';
import { useAuthStore } from '@/store/authStore';
import type { LoginPayload } from '@/types/auth';

export function useLogin() {
  const setAuth = useAuthStore(s => s.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: data => {
      setAuth(data.accessToken, data.refreshToken, data.user);
    },
  });
}
