import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { loginUser } from '@/api/endpoints/authApi';
import { useAuthStore } from '@/store/authStore';
import type { LoginRequest, LoginResponse } from '@/types/auth';

export function useLogin() {
  const setSession = useAuthStore(s => s.setSession);

  return useMutation<LoginResponse, AxiosError<{ error: string }>, LoginRequest>({
    mutationFn: (payload: LoginRequest) => loginUser(payload),
    onSuccess: data => {
      setSession(data.accessToken, data.refreshToken, data.user, data.modules);
    },
  });
}
