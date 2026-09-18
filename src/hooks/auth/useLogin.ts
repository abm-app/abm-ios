import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { loginUser } from '@/api/endpoints/authApi';
import { useAuthStore } from '@/store/authStore';
import { usePushRegistration } from '@/hooks/notifications/usePushRegistration';
import type { LoginRequest, LoginResponse } from '@/types/auth';

export function useLogin() {
  const setSession = useAuthStore(s => s.setSession);
  const pushRegistration = usePushRegistration();

  return useMutation<LoginResponse, AxiosError<{ error: string }>, LoginRequest>({
    mutationFn: (payload: LoginRequest) => loginUser(payload),
    onSuccess: async data => {
      // Must await — setSession only puts the token in the store once its SecureStore
      // writes finish, and push registration needs that token for its Authorization header.
      await setSession(data.accessToken, data.refreshToken, data.user, data.modules);
      pushRegistration.mutate();
    },
  });
}
